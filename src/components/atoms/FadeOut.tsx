"use client";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect, useRef, useState } from "react";

export function FadeOut({ children }: { children: React.ReactNode }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(elementRef, {
    threshold: 0.5,
  });

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!animated && isIntersecting) {
      setAnimated(true);
    }
  }, [isIntersecting, animated]);

  return (
    <div className={animated ? "fade-out" : "opacity-0"} ref={elementRef}>
      {children}
    </div>
  );
}
