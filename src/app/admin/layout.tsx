import { ModalContentType } from "@/components/molecules/modal/ModalRoot";
import { MessagePopupModal } from "@/components/molecules/modal/MessagePopupModal";
import { CreateWaveForm, UpdateWaveForm } from "@/features/waves";
import {
  FormSecondInscription,
  FormUpdateStudentInfo,
} from "@/features/students";
import { RejectInscriptionForm } from "@/features/inscriptions";
import { ModuleForm } from "@/features/modules";
import { PreRequestForm } from "@/features/preRequests";
import { CarrerOpportunityForm } from "@/features/carrerOpportunies";
import {
  AddTrainingForm,
  UpdateTrainingForm,
  AddProgramInTrainingForm,
  UpdateTrainingProgramForm,
} from "@/features/trainings";
import { AuthGuard } from "@/components/guards/AuthGuard";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";

const modalContent: ModalContentType = {
  // program: ProgramForm,
  createWave: CreateWaveForm,
  messagePopup: MessagePopupModal,
  updateWave: UpdateWaveForm,
  secondInscription: FormSecondInscription,
  updateStudentInfo: FormUpdateStudentInfo,
  formModule: ModuleForm,
  formPreRequest: PreRequestForm,
  formCarrerOpportunity: CarrerOpportunityForm,
  updateTraining: UpdateTrainingForm,
  addTraining: AddTrainingForm,
  addProgramInTraining: AddProgramInTrainingForm,
  changePassword: ChangePasswordForm,
  rejectInscription: RejectInscriptionForm,
  updateTrainingProgram: UpdateTrainingProgramForm,
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <AdminPageLayout modalContent={modalContent}>{children}</AdminPageLayout>
    </AuthGuard>
  );
}
