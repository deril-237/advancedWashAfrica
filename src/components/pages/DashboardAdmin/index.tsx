import { getInscriptionStatisticsAction } from "@/features/inscriptions";
import { getStudentStatisticsAction } from "@/features/students";
import { getWaveStatisticAction } from "@/features/waves/actions";
import { getAuthenticatedUser } from "@/lib/betterAuth/auth-server";
import { unwrap } from "@/lib/safeAction";
import { FileText, List, UserIcon } from "lucide-react";
import DashboardCard, { DashboardCardProps } from "./DashboardCard";
import { DashboardInscriptionList } from "./DashboardInscriptionList";
import { TopTrainingProgram } from "./TopTrainingProgram";

export async function AdminHome() {
  const session = await getAuthenticatedUser();

  const [studentStat, inscriptionStatistics, waveStatistics] =
    await Promise.all([
      unwrap(getStudentStatisticsAction()),
      unwrap(getInscriptionStatisticsAction()),
      unwrap(getWaveStatisticAction()),
    ]);

  const dashboardCards: DashboardCardProps[] = [
    {
      title: "Inscription",
      subtitle: "Consulter et traiter les inscriptions",
      icon: FileText,
      href: "/admin/inscriptions",
      variant: "warning",
      children: (
        <>
          <div className="">
            <p className="text-4xl font-bold leading-none">
              {inscriptionStatistics.inscriptionSubmitted}
            </p>
            <p className="mt-1 text-white/70">Dossier non traité</p>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">Accepté</p>
              <p className="font-semibold">
                {inscriptionStatistics.inscriptionAccepted}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">Rejeté</p>
              <p className="font-semibold">
                {inscriptionStatistics.inscriptionRejected}
              </p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">Dossier total reçu</p>
              <p className="font-semibold">{inscriptionStatistics.total}</p>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Etudiant",
      subtitle: " Consulter et gérer les étudiants",
      icon: UserIcon,
      href: "/admin/students",
      variant: "success",
      children: (
        <>
          <div className="">
            <p className="text-4xl font-bold leading-none">
              {studentStat.totalStudent}
            </p>
            <p className="mt-1 text-white/70">Étudiants inscrits</p>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">En formation</p>
              <p className="font-semibold">
                {studentStat.totalStudentInTraining}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">Terminés</p>
              <p className="font-semibold">
                {studentStat.totalStudentFinishTraining}
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Vagues",
      subtitle: "Consulter et gerer les vagues de formations",
      icon: List,
      href: "/admin/waves",
      variant: "primary",
      children: (
        <>
          <div className="">
            <p className="text-4xl font-bold leading-none">
              {waveStatistics.nbPending}
            </p>
            <p className="mt-1 text-white/70">Vague en cours</p>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">Ouvert pour inscription</p>
              <p className="font-semibold">{waveStatistics.nbOpen}</p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">Terminés</p>
              <p className="font-semibold">{waveStatistics.nbFinish}</p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-white/70">Total</p>
              <p className="font-semibold">{waveStatistics.total}</p>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* welcome message */}
      <h2 className="text-2xl font-bold">Bonjour {session.user.name}</h2>

      {/* card kpi */}
      <div className="w-full grid md:grid-cols-3   gap-3">
        {dashboardCards.map((props, index) => (
          <div className="w-full md:w-auto" key={index}>
            <DashboardCard
              title={props.title}
              subtitle={props.subtitle}
              href={props.href}
              icon={props.icon}
              variant={props.variant}
            >
              {props.children}
            </DashboardCard>
          </div>
        ))}
      </div>
      {/* list  the last submitted inscription and top trainingProgram*/}
      <div className="mt:10 w-full flex flex-col md:flex-row justify-between gap-8">
        <div className="w-full  md:w-1/2">
          <TopTrainingProgram />
        </div>
        <div className="w-full md:w-1/2">
          <DashboardInscriptionList />
        </div>
      </div>
    </div>
  );
}
