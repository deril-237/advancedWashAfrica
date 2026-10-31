"use client";

import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { makeClient } from "@/lib/tanstackQueryClient";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const client = makeClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
