/**
 * GALLERY COMPONENT — React Island
 * Source: REFERENCE.md Section 15-16
 * 
 * Responsive grid + lightbox.
 */

import { useState, useCallback } from 'react';

interface GalleryImage {
  imageUrl: string;
  thumbUrl: string;
  caption: string | null;
  altText: string | null;
}

interface GalleryProps {
  images: GalleryImage[];
}

function Lightbox({ image, onClose, onPrev, onNext }: {
  image: GalleryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:left-4"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Image */}
      <img
        src={image.imageUrl}
        alt={image.altText || image.caption || 'Gallery'}
        className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:right-4"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Caption */}
      {image.caption && (
        <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/80">
          {image.caption}
        </p>
      )}
    </div>
  );
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
  }, [selectedIndex, images.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
  }, [selectedIndex, images.length]);

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="invitation-section bg-[var(--color-background)]">
      <div className="mx-auto max-w-sm">
        {/* Heading */}
        <div className="mb-6 text-center">
          <p className="mb-1 font-[family-name:var(--font-accent)] text-base text-[var(--color-accent)]">Momen Bahagia</p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--color-text)]">Galeri</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-surface-soft)] transition-transform hover:scale-[1.02]"
            >
              <img
                src={img.thumbUrl || img.imageUrl}
                alt={img.altText || img.caption || 'Gallery'}
                className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          image={images[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
