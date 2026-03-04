import { useEffect, useRef, useState } from "react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import type { ResumeData } from "@shared/schema";

/**
 * Renders a perfectly-scaled, lazy-loaded thumbnail of a resume template.
 * Uses ResizeObserver to compute the exact scale so the thumbnail
 * always matches the full preview 1:1.
 * Uses IntersectionObserver so off-screen templates don't render until needed.
 */
export function TemplateThumbnail({
  data,
  templateId,
  className = "",
}: {
  data: ResumeData;
  templateId: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Start with 0 so we don't render until ResizeObserver gives us the real width
  const [containerWidth, setContainerWidth] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Measure width precisely
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.round(entry.contentRect.width) || 180);
    });
    ro.observe(el);

    // Lazy-load: only render when near the viewport
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // US Letter: 816px × 1056px at 96dpi
  const RESUME_W = 816;
  const RESUME_H = 1056;
  const scale = containerWidth > 0 ? containerWidth / RESUME_W : 0;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        // Aspect ratio matches US Letter — container height = width × (11/8.5)
        aspectRatio: `${RESUME_W} / ${RESUME_H}`,
        overflow: "hidden",
        background: "white",
      }}
    >
      {scale > 0 && inView && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: RESUME_W,
            height: RESUME_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <ResumePreview data={data} templateId={templateId} />
        </div>
      )}
    </div>
  );
}
