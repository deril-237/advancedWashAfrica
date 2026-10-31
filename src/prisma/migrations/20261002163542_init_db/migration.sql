-- CreateEnum
CREATE TYPE "WaveStatus" AS ENUM ('PENDING', 'FINISHED', 'OPEN');

-- CreateEnum
CREATE TYPE "InscriptionStatus" AS ENUM ('SUBMITTED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ModalityOption" AS ENUM ('ON_LINE', 'OFF_LINE');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('CLOUDINARY');

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "imageId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_program" (
    "id" TEXT NOT NULL,
    "training_id" TEXT NOT NULL,
    "program_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "training_program_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_requests" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "training_program_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrer_opportunities" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "training_program_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrer_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waves" (
    "id" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "quota" INTEGER NOT NULL,
    "status" "WaveStatus" NOT NULL,
    "price" INTEGER NOT NULL,
    "training_program_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "num_cni_passport" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "birth_place" TEXT NOT NULL,
    "residence" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "diploma_file_id" TEXT NOT NULL,
    "cni_passort_file_id" TEXT NOT NULL,
    "photo_file_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_motivations" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "option_motivations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_motivations" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "optionId" TEXT,
    "textResponse" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_motivations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "waveId" TEXT NOT NULL,
    "status" "InscriptionStatus" NOT NULL,
    "modality" "ModalityOption" NOT NULL,
    "reasonRejected" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_assests" (
    "id" TEXT NOT NULL,
    "provider" "StorageProvider" NOT NULL,
    "key" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_assests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opt_codes" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opt_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programs_duration_key" ON "programs"("duration");

-- CreateIndex
CREATE UNIQUE INDEX "trainings_name_key" ON "trainings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "training_program_training_id_program_id_key" ON "training_program"("training_id", "program_id");

-- CreateIndex
CREATE UNIQUE INDEX "modules_training_program_id_position_key" ON "modules"("training_program_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "pre_requests_training_program_id_order_key" ON "pre_requests"("training_program_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "carrer_opportunities_training_program_id_label_key" ON "carrer_opportunities"("training_program_id", "label");

-- CreateIndex
CREATE UNIQUE INDEX "students_num_cni_passport_key" ON "students"("num_cni_passport");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_phone_key" ON "students"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "option_motivations_order_key" ON "option_motivations"("order");

-- CreateIndex
CREATE UNIQUE INDEX "student_motivations_studentId_optionId_key" ON "student_motivations"("studentId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_studentId_waveId_key" ON "inscriptions"("studentId", "waveId");

-- CreateIndex
CREATE UNIQUE INDEX "file_assests_key_key" ON "file_assests"("key");

-- CreateIndex
CREATE UNIQUE INDEX "file_assests_key_provider_key" ON "file_assests"("key", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "file_assests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_program" ADD CONSTRAINT "training_program_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_program" ADD CONSTRAINT "training_program_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_requests" ADD CONSTRAINT "pre_requests_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrer_opportunities" ADD CONSTRAINT "carrer_opportunities_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_training_program_id_fkey" FOREIGN KEY ("training_program_id") REFERENCES "training_program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_diploma_file_id_fkey" FOREIGN KEY ("diploma_file_id") REFERENCES "file_assests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_photo_file_id_fkey" FOREIGN KEY ("photo_file_id") REFERENCES "file_assests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_cni_passort_file_id_fkey" FOREIGN KEY ("cni_passort_file_id") REFERENCES "file_assests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_motivations" ADD CONSTRAINT "student_motivations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_motivations" ADD CONSTRAINT "student_motivations_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "option_motivations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_waveId_fkey" FOREIGN KEY ("waveId") REFERENCES "waves"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
