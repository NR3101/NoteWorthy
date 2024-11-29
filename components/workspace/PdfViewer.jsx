import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const PdfViewer = ({ fileUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState("100%");

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector(".pdf-container");
      if (container) {
        setIframeHeight(`${container.offsetHeight}px`);
      }
    };

    // Initial calculation
    updateDimensions();

    // Small delay to ensure proper calculation after DOM is fully rendered
    const timer = setTimeout(updateDimensions, 100);

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="h-full sticky top-0">
      <div className="relative h-full w-full pdf-container bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 drop-shadow-lg" />
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 animate-pulse">
              Loading PDF...
            </p>
          </div>
        )}

        {fileUrl && (
          <iframe
            src={`${fileUrl}#toolbar=0&view=FitH`}
            className="w-full bg-white dark:bg-zinc-900 shadow-lg transition-all duration-300"
            style={{
              height: iframeHeight,
              maxWidth: "100%",
              overflow: "hidden",
            }}
            onLoad={() => {
              setIsLoading(false);
              // Trigger dimension update after iframe loads
              const container = document.querySelector(".pdf-container");
              if (container) {
                setIframeHeight(`${container.offsetHeight}px`);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
