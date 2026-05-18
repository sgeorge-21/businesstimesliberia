import { useEffect, useState } from "react";

type Orientation = "portrait" | "landscape";

/**
 * useOrientation - returns 'portrait' | 'landscape'
 * Safe for SSR (guards window) and uses matchMedia change events.
 */
export default function useOrientation(): Orientation {
  const getCurrent = (): Orientation =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(orientation: portrait)").matches
      ? "portrait"
      : "landscape";

  const [orientation, setOrientation] = useState<Orientation>(() =>
    typeof window !== "undefined" ? getCurrent() : "portrait"
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function")
      return;

    const mq = window.matchMedia("(orientation: portrait)");
    const handler = (e: MediaQueryListEvent) => setOrientation(e.matches ? "portrait" : "landscape");

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
    } else if (typeof (mq as any).addListener === "function") {
      (mq as any).addListener(handler);
    }

    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", handler);
      } else if (typeof (mq as any).removeListener === "function") {
        (mq as any).removeListener(handler);
      }
    };
  }, []);

  return orientation;
}
