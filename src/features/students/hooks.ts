import { PaginationParams } from "@/lib/pagination";
import { unwrap } from "@/lib/safeAction";
import { useQuery } from "@tanstack/react-query";
import { getStudentListAction, getStudentStatisticsAction } from "./actions";
import { studentKeys } from "./queryKeys";
import { FilterStudent } from "./types";

export function useGetStudentList(
  page: PaginationParams["page"],
  filter: FilterStudent,
) {
  return useQuery({
    queryFn: async () => {
      const result = await unwrap(getStudentListAction({ page }, filter));
      return result;
    },
    queryKey: studentKeys.list({ page }, filter),
  });
}

export function useGetStudentStatistics() {
  return useQuery({
    queryKey: studentKeys.statistics,
    queryFn: () => unwrap(getStudentStatisticsAction()),
  });
}
