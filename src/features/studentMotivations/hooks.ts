"use client";

import { useQuery } from "@tanstack/react-query";
import { motivationOptionsKey } from "./queryKeys";
import { getMotivationOptionsAction } from "./actions";
import { unwrap } from "@/lib/safeAction";

export function useGetMotivationOptionsList() {
  return useQuery({
    queryKey: motivationOptionsKey.all,
    queryFn: async () => {
      const result = await unwrap(getMotivationOptionsAction());

      return result;
    },
  });
}
