import { useState, useRef, useEffect } from "react";
import PptxGenJS from "pptxgenjs";
import {
  LuChevronLeft,
  LuChevronRight,
  LuMaximize2,
  LuMinimize2,
  LuDownload,
} from "react-icons/lu";

export default function SlideViewer({ slides, title = "Materi-Slide" }) {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef(null);

  const prevSlide = () => setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  const nextSlide = () =>
    setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : prev));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const handleDownloadPptx = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_16x9";

      for (let i = 0; i < slides.length; i++) {
        const response = await fetch(slides[i].image);
        const blob = await response.blob();
        const base64 = await toBase64(blob);

        const slide = pptx.addSlide();
        slide.addImage({
          data: base64,
          x: 0,
          y: 0,
          w: "100%",
          h: "100%",
        });
      }

      await pptx.writeFile({ fileName: `${title || "Materi-Slide"}.pptx` });
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    const handleKeyDown = (e) => {
      if (document.fullscreenElement === containerRef.current) {
        if (e.key === "ArrowLeft") {
          setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
        }
        if (e.key === "ArrowRight") {
          setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [slides.length]);

  return (
    <div
      ref={containerRef}
      className={`w-full border border-card-border overflow-hidden bg-secondary-dark flex flex-col ${
        isFullscreen ? "h-screen rounded-none border-none" : "rounded-xl"
      }`}
    >
      {/* Layar Slide Gambar */}
      <div
        className={`relative bg-secondary-dark flex items-center justify-center overflow-hidden group ${
          isFullscreen ? "flex-1 min-h-0" : "aspect-video"
        }`}
      >
        <img
          src={slides[current].image}
          alt={slides[current].alt || `Slide ${current + 1}`}
          className="w-full h-full object-contain select-none"
        />

        {/* Tombol Navigasi Melayang */}
        <button
          onClick={prevSlide}
          disabled={current === 0}
          className="absolute left-3 p-2.5 rounded-full bg-secondary/80 text-primary-light hover:bg-secondary disabled:opacity-0 transition cursor-pointer shadow-md"
          aria-label="Slide sebelumnya"
        >
          <LuChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          disabled={current === slides.length - 1}
          className="absolute right-3 p-2.5 rounded-full bg-secondary/80 text-primary-light hover:bg-secondary disabled:opacity-0 transition cursor-pointer shadow-md"
          aria-label="Slide berikutnya"
        >
          <LuChevronRight size={20} />
        </button>
      </div>

      {/* Control Bar Bawah */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-card-header border-t border-card-border shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevSlide}
            disabled={current === 0}
            className="p-1.5 rounded-lg text-secondary hover:bg-primary disabled:opacity-35 transition cursor-pointer disabled:cursor-not-allowed"
            aria-label="Mundur"
          >
            <LuChevronLeft size={18} />
          </button>
          <button
            onClick={nextSlide}
            disabled={current === slides.length - 1}
            className="p-1.5 rounded-lg text-secondary hover:bg-primary disabled:opacity-35 transition cursor-pointer disabled:cursor-not-allowed"
            aria-label="Maju"
          >
            <LuChevronRight size={18} />
          </button>
          <span className="text-xs font-semibold text-secondary ml-1.5">
            Slide {current + 1} / {slides.length}
          </span>
        </div>

        {/* Indikator Titik */}
        <div className="hidden sm:flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === current
                  ? "w-5 bg-secondary"
                  : "w-2 bg-primary-dark/45 hover:bg-primary-dark"
              }`}
              aria-label={`Ke slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Tombol Download PPTX & Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownloadPptx}
            disabled={isDownloading}
            title="Unduh PPTX"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-secondary hover:bg-primary disabled:opacity-50 transition cursor-pointer disabled:cursor-not-allowed"
          >
            <LuDownload size={15} />
            <span className="hidden sm:inline">
              {isDownloading ? "Membuat PPTX..." : "Download"}
            </span>
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-secondary hover:bg-primary transition cursor-pointer"
          >
            {isFullscreen ? (
              <LuMinimize2 size={15} />
            ) : (
              <LuMaximize2 size={15} />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? "Keluar" : "Fullscreen"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
