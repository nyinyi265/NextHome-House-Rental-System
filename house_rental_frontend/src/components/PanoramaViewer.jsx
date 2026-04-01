import { useEffect, useRef } from "react";
import "pannellum/build/pannellum.css";
import "pannellum/build/pannellum.js";

export default function PanoramaViewer({ image }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!image || !viewerRef.current) return;

    // Ensure the container is empty before Pannellum injects its <iframe> or Canvas
    viewerRef.current.innerHTML = "";

    const viewer = window.pannellum.viewer(viewerRef.current, {
      type: "equirectangular",
      panorama: image,
      autoload: true,
      crossOrigin: "anonymous",
    });

    return () => {
      if (viewer) {
        try {
          viewer.destroy();
        } catch (e) {
          console.error("Error destroying pannellum:", e);
        }
      }
    };
  }, [image]);

  return <div ref={viewerRef} className="w-full h-full" />;
}
