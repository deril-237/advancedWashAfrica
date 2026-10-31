import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export function makeClient() {
  const client = new QueryClient();

  return client;
}

export const getQueryClient = cache(makeClient);
