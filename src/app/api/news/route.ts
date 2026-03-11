import { NextResponse } from "next/server";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  source: string;
  publishedAt: string;
}

// Direct publisher RSS feeds — these include images unlike Google News RSS
// "realty" feeds are always relevant; "business" feeds need keyword filtering
const RSS_FEEDS = [
  { url: "https://www.hindustantimes.com/feeds/rss/real-estate/rssfeed.xml", source: "Hindustan Times", isRealty: true },
  { url: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms", source: "Times of India", isRealty: false },
  { url: "https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml", source: "Hindustan Times", isRealty: false },
  { url: "https://timesofindia.indiatimes.com/rssfeeds/1898274.cms", source: "Times of India", isRealty: false },
];

// Real estate keywords to filter relevant articles from general business feeds
const RE_KEYWORDS = /real estate|property|housing|flat|apartment|realty|rera|home loan|mortgage|stamp duty|smart city|infrastructure|dholera|noida|greater noida|ncr|builder|developer|residential|commercial space|rental|lease/i;

function extractFromXML(xml: string, fallbackSource: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const items = xml.split("<item>").slice(1);

  for (const item of items) {
    const title =
      item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]>/)?.[1] ||
      item.match(/<title>(.*?)<\/title>/)?.[1] ||
      "";
    const link =
      item.match(/<link><!\[CDATA\[(.*?)\]\]>/)?.[1] ||
      item.match(/<link>(.*?)<\/link>/)?.[1] ||
      "";
    const rawDesc =
      item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]>/)?.[1] ||
      item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
      "";
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]
      || item.match(/<pubDate><!\[CDATA\[(.*?)\]\]>/)?.[1]
      || "";
    const source =
      item.match(/<source.*?>(.*?)<\/source>/)?.[1] || fallbackSource;

    // Extract image: media:content > enclosure > img in description
    const image =
      item.match(/<media:content[^>]+url=["']([^"']+)["']/)?.[1] ||
      item.match(/<enclosure[^>]+url=["']([^"']+)["']/)?.[1] ||
      rawDesc.match(/<img[^>]+src=["']([^"']+)["']/)?.[1] ||
      null;

    // Clean HTML for display — decode entities FIRST, then strip tags
    const cleanDesc = rawDesc
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();

    const cleanTitle = title
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    if (cleanTitle && link) {
      articles.push({
        title: cleanTitle,
        description: cleanDesc.slice(0, 200),
        url: link,
        image,
        source,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      });
    }
  }

  return articles;
}

// Seeded shuffle — rotates hourly so news feels fresh but stable within the hour
function shuffleWithSeed(arr: NewsArticle[]): NewsArticle[] {
  const seed = Math.floor(Date.now() / 3600000);
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = ((seed * (i + 1) * 2654435761) >>> 0) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET() {
  try {
    const allArticles: NewsArticle[] = [];
    const seen = new Set<string>();

    // Fetch all RSS feeds in parallel
    const realtyArticles: NewsArticle[] = [];
    const businessArticles: NewsArticle[] = [];

    const results = await Promise.all(
      RSS_FEEDS.map(async (feed) => {
        try {
          const res = await fetch(feed.url, { next: { revalidate: 3600 } });
          if (!res.ok) return { articles: [], isRealty: feed.isRealty };
          const xml = await res.text();
          return { articles: extractFromXML(xml, feed.source), isRealty: feed.isRealty };
        } catch {
          return { articles: [], isRealty: feed.isRealty };
        }
      })
    );

    for (const { articles, isRealty } of results) {
      for (const article of articles) {
        if (seen.has(article.title)) continue;
        seen.add(article.title);
        if (isRealty || RE_KEYWORDS.test(article.title) || RE_KEYWORDS.test(article.description)) {
          realtyArticles.push(article);
        } else {
          businessArticles.push(article);
        }
      }
    }

    // Prioritize: take all realty articles first, then fill with business
    realtyArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    businessArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Take up to 8 realty, fill remaining with business
    const picked = realtyArticles.slice(0, 8);
    if (picked.length < 8) {
      picked.push(...businessArticles.slice(0, 8 - picked.length));
    }

    const shuffled = shuffleWithSeed(picked);

    return NextResponse.json(shuffled.slice(0, 8));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
