import { useCounterDown } from "@/hooks/useCounter";
import {
  createContext,
  FunctionComponent,
  JSX,
  useContext,
  useState,
  useEffect,
} from "react";

export type Count = {
  /**
   * in seconde
   */
  count: number | null;
  current: number | null;
  setCount: (count: number) => void;
};

const CountContext = createContext<Count>({
  count: null,
  current: null,
  setCount: () => {},
});

export const CounterProvider: FunctionComponent<{
  count?: number;
  children: JSX.Element;
}> = ({ children, count: defaultCount = null }) => {
  useEffect(() => {
    setCount(defaultCount);
  }, [defaultCount]);

  const [count, setCount] = useState(defaultCount);

  const counter = useCounterDown(count ?? 0, 1000);

  const context = { count, current: counter, setCount };
  return <CountContext value={context}>{children}</CountContext>;
};

export function useContextCounter() {
  return useContext(CountContext);
}
