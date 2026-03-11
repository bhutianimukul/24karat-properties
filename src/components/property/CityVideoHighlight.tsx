"use client";

import { Card } from "@/components/ui/Card";

interface CityVideoHighlightProps {
  videoUrl: string;
  title: string;
  description?: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function CityVideoHighlight({ videoUrl, title, description }: CityVideoHighlightProps) {
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) return null;

  return (
    <Card className="overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row">
        {/* Video Embed */}
        <div className="sm:w-1/2 lg:w-2/5">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 sm:w-1/2 lg:w-3/5 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-gold-muted border border-gold/20 text-gold text-[10px] font-medium w-fit mb-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
              <path fill="#0a0a0f" d="M9.545 15.568V8.432L15.818 12z" />
            </svg>
            FEATURED VIDEO
          </div>
          <h3 className="font-semibold text-sm sm:text-base mb-1">{title}</h3>
          {description && (
            <p className="text-xs text-muted leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
