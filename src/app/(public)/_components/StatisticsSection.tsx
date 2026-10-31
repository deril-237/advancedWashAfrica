"use client";

import { useCounterIncrement } from "@/hooks/useCounter";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  Award,
  GraduationCap,
  Handshake,
  Percent,
  LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type StatisticsElementProps = {
  limit: number;
  icon: LucideIcon;
  title: string;
  suffix?: string;
  duration?: number;
  startCount?: boolean;
};

const statisticsElements: StatisticsElementProps[] = [
  {
    limit: 15,
    icon: Award,
    title: "Experts trained",
    suffix: "+",
    duration: 50,
  },

  {
    limit: 100,
    icon: GraduationCap,
    title: "Graduates",
    suffix: "+",
    duration: 30,
  },

  {
    limit: 20,
    icon: Handshake,
    title: "Partners",
    suffix: "+",
    duration: 100,
  },

  {
    limit: 95,
    icon: Percent,
    title: "Professional Insertion",
    suffix: "%",
    duration: 30,
  },
];

export function StatisticsElement({
  limit,
  icon: Icon,
  title,
  suffix = "",
  duration = 100,
  startCount = false,
}: StatisticsElementProps) {
  const count = useCounterIncrement(0, limit, duration, 1, startCount);

  return (
    <div className="group flex flex-col items-center gap-2 text-center">
      {/* Icon */}

      <div className="flex size-14 items-center justify-center rounded-full bg-base-100/10  transition">
        <Icon size={28} className="text-secondary" />
      </div>

      {/* Number */}

      <div className="flex items-center text-4xl font-black text-secondary">
        {count}

        <span>{suffix}</span>
      </div>

      {/* Label */}

      <p className="max-w-37.5 text-sm font-medium text-base-100/80">{title}</p>
    </div>
  );
}

export function StatisticsSection() {
  const elementRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(elementRef, {
    threshold: 0.5,
  });

  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (!startCount && isIntersecting) {
      setStartCount(true);
    }
  }, [isIntersecting, startCount]);

  console.log("startCount", startCount);
  return (
    <section
      className={`bg-primary py-12 ${startCount ? "fade-out" : "opacity-0"}`}
      ref={elementRef}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 md:grid-cols-4 min-h-14">
        {statisticsElements.map((stat, index) => {
          const props = {
            ...stat,
            startCount: startCount,
          };
          return <StatisticsElement {...props} key={index} />;
        })}
      </div>
    </section>
  );
}
