import React, { useState, useEffect, useRef } from "react";

function destroyViewer(viewerRef) {
  if (viewerRef.current) {
    try {
      viewerRef.current.destroy();
    } catch (e) {}
    viewerRef.current = null;
  }
}

export default function PanoramaViewer({ image }) {
  console.log("image", image)
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!image) {
      setError("No image provided");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setError(null);

    const loadPanorama = async () => {
      try {
        // Fetch image as blob to avoid CORS
        const response = await fetch(image, { mode: "cors" });
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }
        
        const blob = await response.blob();
        if (cancelled) {
          URL.revokeObjectURL(blob);
          return;
        }
        
        const blobUrl = URL.createObjectURL(blob);
        
        // Check if pannellum is available
        if (!window.pannellum) {
          // Load pannellum from node_modules
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.7/build/pannellum.js";
          script.async = true;
          
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.7/build/pannellum.css";
          document.head.appendChild(link);
          
          script.onload = () => {
            if (cancelled) return;
            initViewer(blobUrl);
          };
          script.onerror = () => {
            setError("Failed to load panorama library");
            setStatus("error");
          };
          document.head.appendChild(script);
        } else {
          initViewer(blobUrl);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading panorama:", err);
          setError(err.message || "Failed to load panorama");
          setStatus("error");
        }
      }
    };

    const initViewer = (panoramaUrl) => {
      if (!containerRef.current || !window.pannellum) return;

      // Clean up previous viewer
      destroyViewer(viewerRef);
      containerRef.current.innerHTML = "";

      try {
        viewerRef.current = window.pannellum.viewer(containerRef.current, {
          type: "equirectangular",
          panorama: panoramaUrl,
          autoLoad: true,
          showZoomCtrl: true,
          mouseZoom: true,
          compass: false,
        });
        setStatus("ready");
      } catch (err) {
        console.error("Pannellum init error:", err);
        setError("Failed to initialize panorama");
        setStatus("error");
      }
    };

    loadPanorama();

    return () => {
      cancelled = true;
      destroyViewer(viewerRef);
    };
  }, [image]);

  const handleRetry = () => {
    if (!image) return;
    setStatus("loading");
    setError(null);
    
    // Force reload by re-creating the effect
    const blobUrl = URL.createObjectURL(
      new Blob([], { type: "text/plain" })
    );
    
    // Simply re-trigger the effect by changing image temporarily
    const currentImage = image;
    // Clear and reinitialize
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
    
    // Re-trigger load
    fetch(image, { mode: "cors" })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        if (window.pannellum && containerRef.current) {
          try {
            viewerRef.current = window.pannellum.viewer(containerRef.current, {
              type: "equirectangular",
              panorama: url,
              autoLoad: true,
              showZoomCtrl: true,
              mouseZoom: true,
            });
            setStatus("ready");
          } catch (e) {
            setError("Failed to initialize panorama");
            setStatus("error");
          }
        }
      })
      .catch(err => {
        setError(err.message);
        setStatus("error");
      });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      {status === "loading" && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm font-medium">Loading image...</span>
          </div>
        </div>
      )}
      
      {status === "error" && (
        <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center gap-3">
          <span className="text-red-400 text-sm">{error || "Could not load panorama"}</span>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
