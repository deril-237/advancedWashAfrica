import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { TitlePage } from "@/components/atoms/TitlePage";
import { FileText, PlusIcon } from "lucide-react";
import { getQueryClient } from "@/lib/tanstackQueryClient";
import {
  InscriptionListWithFilter,
  getInscriptionListAction,
  inscriptionKeys,
  InscriptionStatisticsStatistics,
} from "@/features/inscriptions";
import Link from "next/link";

export default async function InscriptionsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: inscriptionKeys.list({ page: 1 }, {}),
    queryFn: async () => {
      const result = await getInscriptionListAction({}, {});
      if (result.serverError) throw new Error(result.serverError.global);
      console.log(result.data);
      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between">
          <TitlePage
            icon={<FileText />}
            title="Gestion des Inscriptions"
            description="Consulter et valider les demandes d'inscription"
          />
          <Link href={"/admin/inscriptions/create"} className="btn btn-primary">
            <PlusIcon size={20} />
            Inscrire
          </Link>
        </div>
        <InscriptionStatisticsStatistics />
        <div className="mt-4">
          <InscriptionListWithFilter />
        </div>
      </div>
    </HydrationBoundary>
  );
}
