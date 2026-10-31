import { TitlePage } from "@/components/atoms/TitlePage";
import { GraduationCapIcon } from "lucide-react";
import { getQueryClient } from "@/lib/tanstackQueryClient";
import { studentKeys } from "@/features/students";
import {
  getStudentListAction,
  getStudentStatisticsAction,
  StudentStatistics,
  StudentListWithFilter,
} from "@/features/students";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { unwrap } from "@/lib/safeAction";

export default function StudentListPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: studentKeys.list({ page: 1 }, {}),
    queryFn: async () => {
      const result = await getStudentListAction({}, {});

      if (result.serverError) {
        throw new Error(
          result.serverError.global ??
            "Erreur est survenue pendant le chargement des donnée",
        );
      }

      return result.data;
    },
  });

  queryClient.prefetchQuery({
    queryKey: studentKeys.statistics,
    queryFn: () => unwrap(getStudentStatisticsAction()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4">
        <TitlePage
          icon={<GraduationCapIcon />}
          title="Gestion des étudiants inscrits"
          description="Consulter gerer la liste des etudiants inscrits ici"
        />
        <StudentStatistics />
        <StudentListWithFilter />
      </div>
    </HydrationBoundary>
  );
}
