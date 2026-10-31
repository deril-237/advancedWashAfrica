import { useEffect, useState } from "react";

export function useCounterIncrement(
  defaultValue = 0,
  limit = 100,
  duration = 100,
  step = 1,
  startCount = false,
) {
  const [count, setCounter] = useState(defaultValue);

  useEffect(() => {
    const counter = (counter: number) => {
      if (!startCount) {
        return counter;
      }
      if (counter === limit) {
        clearInterval(intervalId);
        return limit;
      }

      return counter + 1;
    };

    const intervalId = setInterval(() => setCounter(counter), duration);

    if (count === limit) {
      return clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [startCount, defaultValue, duration, step, limit]);

  return count;
}

export function useCounterDown(limit = 0, duration = 100) {
  const [count, setCounter] = useState<number>(limit);

  useEffect(() => {
    setCounter(limit);

    if (limit === 0) return;

    const intervalId = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, duration);

    return () => clearInterval(intervalId);
  }, [limit, duration]);

  return count;
}
