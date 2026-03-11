"use client";

interface GoogleEarthEmbedProps {
  latitude: number;
  longitude: number;
  title: string;
}

export function GoogleEarthEmbed({ latitude, longitude, title }: GoogleEarthEmbedProps) {
  const earthUrl = `https://earth.google.com/web/@${latitude},${longitude},100a,500d,35y,0h,45t,0r`;

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden border border-surface-border">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1`}
          className="w-full h-[250px] sm:h-[300px]"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Satellite view of ${title}`}
        />
      </div>
      <div className="flex justify-end">
        <a
          href={earthUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in Google Earth
        </a>
      </div>
    </div>
  );
}
