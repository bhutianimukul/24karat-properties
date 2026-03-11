"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  source: string;
  publishedAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function PropertyNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => setArticles(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <div className="h-8 w-56 bg-surface-light rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-72 bg-surface-light rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface rounded-xl border border-surface-border h-72 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Property <span className="text-gold-gradient">News</span>
        </h2>
        <p className="text-muted max-w-xl mx-auto">
          Latest real estate updates from Noida, Greater Noida, Delhi NCR &amp; Dholera Smart City.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article, i) => (
          <motion.a
            key={article.url}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group bg-surface rounded-xl border border-surface-border overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-32 sm:h-40 bg-surface-light overflow-hidden">
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-light to-surface">
                  <svg className="w-10 h-10 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              )}
              {/* Source badge */}
              <div className="absolute top-2 left-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-muted border border-surface-border/50">
                  {article.source}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-3">
                {article.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted uppercase tracking-wider">{article.source}</span>
                <span className="text-[10px] text-muted">{timeAgo(article.publishedAt)}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Read More link */}
      <div className="text-center mt-8">
        <a
          href="https://news.google.com/search?q=Noida+Greater+Noida+Dholera+real+estate&hl=en-IN&gl=IN&ceid=IN:en"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors font-medium"
        >
          Read More News
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
