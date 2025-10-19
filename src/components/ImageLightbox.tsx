import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageLightboxProps {
  images: { id: string; image_url: string; image_name: string; caption?: string; likes_count: number }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLike: (mediaId: string) => void;
  onShare: (media: { id: string; image_url: string; image_name: string; caption?: string; likes_count: number }) => void;
  likedMedia: Set<string>;
}

const ImageLightbox = ({ images, currentIndex, onClose, onNext, onPrevious, onLike, onShare, likedMedia }: ImageLightboxProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 text-white hover:bg-white/20"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      <div className="max-w-7xl max-h-[90vh] flex items-center justify-center px-16">
        <img
          src={currentImage.image_url}
          alt={currentImage.image_name}
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>

      {currentIndex < images.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 text-white hover:bg-white/20"
          onClick={onNext}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white space-y-2">
        {currentImage.caption && (
          <p className="text-lg mb-2">{currentImage.caption}</p>
        )}
        <div className="flex items-center justify-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => onLike(currentImage.id)}
          >
            <Heart className={`h-5 w-5 mr-2 ${likedMedia.has(currentImage.id) ? 'fill-red-500 text-red-500' : ''}`} />
            {currentImage.likes_count}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => onShare(currentImage)}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>
        <p className="text-sm">{currentIndex + 1} / {images.length}</p>
      </div>
    </div>
  );
};

export default ImageLightbox;
