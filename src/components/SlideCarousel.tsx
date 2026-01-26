import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';

interface SlideCarouselProps {
  slides: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onRegenerateSlide?: (index: number) => void;
  isRegenerating?: boolean;
  regeneratingIndex?: number | null;
}

export default function SlideCarousel({
  slides,
  currentIndex,
  onIndexChange,
  onRegenerateSlide,
  isRegenerating = false,
  regeneratingIndex = null,
}: SlideCarouselProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrevious = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : slides.length - 1);
  };

  const goToNext = () => {
    onIndexChange(currentIndex < slides.length - 1 ? currentIndex + 1 : 0);
  };

  if (slides.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Slide Display */}
      <div className="relative bg-black rounded-lg overflow-hidden group">
        <img
          src={slides[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-auto cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        />

        {/* Regenerate Button */}
        {onRegenerateSlide && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => onRegenerateSlide(currentIndex)}
              disabled={isRegenerating}
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white shadow-lg"
            >
              {regeneratingIndex === currentIndex ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        )}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
          Slide {currentIndex + 1} of {slides.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`flex-shrink-0 border-2 rounded transition-all ${
              currentIndex === index
                ? 'border-primary shadow-lg scale-105'
                : 'border-gray-300 opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={slide}
              alt={`Thumbnail ${index + 1}`}
              className="h-16 w-auto"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="max-w-7xl w-full">
            <img
              src={slides[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Fullscreen Navigation */}
          {slides.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-4 transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-4 transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-primary transition-colors"
          >
            &times;
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg">
            Slide {currentIndex + 1} of {slides.length}
          </div>
        </div>
      )}
    </div>
  );
}
