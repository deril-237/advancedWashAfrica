import { PrismaClient } from "@/lib/generated/prisma/client";
import "dotenv/config";

export type RequiredLevelInput = {
  order: number;
  label: string;
};

export type OpportunityInput = {
  label: string;
};

export type ModuleInput = {
  position: number;
  name: string;
  description: string;
};

export interface TrainingInput {
  name: string;
  description: string;
  objective: string;
  modules: ModuleInput[];
  requiredLevel: RequiredLevelInput[];
  opportunities: OpportunityInput[];
}

// Mock trainings to insert
const trainingsData: TrainingInput[] = [
  {
    name: "Water Technician, Hygiene and Sanitation (WASH)",
    description:
      "3 Months short certified professional training program focused on WASH projects, water treatment, and sanitation infrastructure.",
    objective:
      "Provide practical skills for WASH management, water testing, treatment techniques, and latrine/kiosk construction.",
    modules: [
      {
        position: 1,
        name: "Water quality test",
        description: "Water quality testing concepts and practical application",
      },
      {
        position: 2,
        name: "Water treatment techniques",
        description: "Standard and practical water treatment methods",
      },
      {
        position: 3,
        name: "Construction of improved latrines",
        description: "Design and construction of sanitation facilities",
      },
      {
        position: 4,
        name: "Design of water kiosks",
        description:
          "Architecture and technical design of communal water kiosks",
      },
      {
        position: 5,
        name: "WASH project management (beginner level)",
        description: "Fundamentals of running humanitarian WASH projects",
      },
    ],
    requiredLevel: [
      { order: 1, label: "BEPC/CAP or equivalent" },
      { order: 2, label: "Knowing how to read and write French" },
      { order: 3, label: "Motivation for fieldwork" },
    ],
    opportunities: [
      { label: "Technician WASH in NGOs/humanitarian projects" },
      { label: "Hygiene and health facilitator" },
      { label: "Contractor (latrines, kiosks, water services)" },
    ],
  },
  {
    name: "Water Supply System Technician",
    description:
      "3 Months short certified professional training program focusing on water supply systems design, installation, and maintenance.",
    objective:
      "Equip trainees with practical capabilities to build gravity systems, solar supply systems, and rainwater harvesting facilities.",
    modules: [
      {
        position: 1,
        name: "Community gravity systems",
        description:
          "Planning and installation of gravity water supply systems",
      },
      {
        position: 2,
        name: "Solar water supply systems",
        description: "Pumping systems powered by solar energy",
      },
      {
        position: 3,
        name: "Simple source systems",
        description: "Protection and tapping of natural springs",
      },
      {
        position: 4,
        name: "Rainwater harvesting and storage",
        description: "Techniques for collection and storage of rainwater",
      },
    ],
    requiredLevel: [
      { order: 1, label: "Minimum BEPC" },
      { order: 2, label: "Basic concepts in recommended mathematics" },
    ],
    opportunities: [
      { label: "Hydraulic Systems Installer" },
      { label: "Technician in NGOs/projects rural" },
      { label: "Provider of Drinking water Solutions" },
      { label: "Self-employment (system installation)" },
    ],
  },
  {
    name: "Drilling and Hydrogeology Technician",
    description:
      "3 Months short certified professional training program in geophysical studies and drilling techniques.",
    objective:
      "Master techniques in applied hydrogeology, ground drilling, and pump testing.",
    modules: [
      {
        position: 1,
        name: "Geophysical studies",
        description: "Groundwater prospecting and geophysical survey methods",
      },
      {
        position: 2,
        name: "Applied Hydrogeology",
        description: "Fundamentals of groundwater dynamics and aquifers",
      },
      {
        position: 3,
        name: "Drilling techniques",
        description: "Operational methods and equipment for borehole drilling",
      },
      {
        position: 4,
        name: "Practical tests of pumps",
        description: "Testing pump discharge, yield, and system performance",
      },
    ],
    requiredLevel: [
      { order: 1, label: "Scientific Baccalaureate level recommended" },
      { order: 2, label: "Good physical condition" },
    ],
    opportunities: [
      { label: "Drilling Technician" },
      { label: "Assistant hydrogeologist" },
      { label: "Field agent in water projects" },
      { label: "Drilling company" },
    ],
  },
  {
    name: "Laboratory Technician – Water Analysis",
    description:
      "3 Months short certified professional training program on chemical and biological analysis of water quality.",
    objective:
      "Train laboratory technicians capable of evaluating water quality standards and chemical/microbiological properties.",
    modules: [
      {
        position: 1,
        name: "Physico-chemical analysis of water",
        description:
          "Laboratory testing of chemical and physical water properties",
      },
      {
        position: 2,
        name: "Microbiological analysis",
        description: "Identification and testing of waterborne micro-organisms",
      },
      {
        position: 3,
        name: "Drinking water quality standards",
        description:
          "Compliance with national and international drinking water norms",
      },
    ],
    requiredLevel: [
      { order: 1, label: "Scientific Baccalaureate level recommended" },
      { order: 2, label: "Basic concepts in chemistry/biology" },
    ],
    opportunities: [
      { label: "Laboratory Technician" },
      { label: "Quality control agent" },
      { label: "Employed in processing plants" },
      { label: "NGOs / water and health projects" },
    ],
  },
  {
    name: "Biomedical Waste Management Technician",
    description:
      "3 Months short certified professional training program in medical waste handling and hospital hygiene.",
    objective:
      "Prepare health and environmental safety specialists to manage hospital waste and treatment areas.",
    modules: [
      {
        position: 1,
        name: "Hospital waste management",
        description:
          "Safe segregation, storage, and handling of hazardous medical waste",
      },
      {
        position: 2,
        name: "Design of treatment areas",
        description:
          "Layout and technical specifications for waste treatment facilities",
      },
      {
        position: 3,
        name: "Safety and environmental hygiene",
        description:
          "Occupational safety protocols and environmental health standards",
      },
    ],
    requiredLevel: [
      { order: 1, label: "Minimum BEPC" },
      { order: 2, label: "Sense of responsibility and hygiene" },
    ],
    opportunities: [
      { label: "Hospital Hygiene Agent" },
      { label: "Medical waste manager" },
      { label: "Public health NGO" },
      { label: "Junior Environmental Consultant" },
    ],
  },
  {
    name: "Hydraulic Modeling Technician",
    description:
      "3 Months short certified professional training program in computerized hydraulic networks and simulation software.",
    objective:
      "Train assistants and technical designers to model and simulate water distribution networks using EPANET.",
    modules: [
      {
        position: 1,
        name: "Introduction to hydraulic networks",
        description: "Principles of pressurized flow and network design",
      },
      {
        position: 2,
        name: "Using the software EPANET",
        description: "Hands-on usage and network modeling in EPANET",
      },
      {
        position: 3,
        name: "Simulation of water systems",
        description:
          "Dynamic simulation and troubleshooting of distribution networks",
      },
    ],
    requiredLevel: [
      { order: 1, label: "Scientific Baccalaureate level recommended" },
      { order: 2, label: "Basic computer skills" },
    ],
    opportunities: [
      { label: "Assistant Hydraulic Engineer" },
      { label: "Design office technician" },
      { label: "Junior hydraulics consultant" },
    ],
  },
];

export async function addTrainingAndProgramSeed(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    const program = await tx.program.upsert({
      where: { duration: 3 },
      update: {},
      create: { duration: 3 },
    });

    for (const training of trainingsData) {
      const savedTraining = await tx.training.upsert({
        where: { name: training.name },
        update: {
          description: training.description,
          objective: training.objective,
        },
        create: {
          name: training.name,
          description: training.description,
          objective: training.objective,
        },
      });

      const trainingProgram = await tx.trainingProgram.upsert({
        where: {
          trainingId_programId: {
            trainingId: savedTraining.id,
            programId: program.id,
          },
        },
        update: { price: 10000 },
        create: {
          price: 10000,
          training: { connect: { id: savedTraining.id } },
          program: { connect: { id: program.id } },
        },
      });

      await tx.module.deleteMany({
        where: { trainingProgramId: trainingProgram.id },
      });
      await tx.module.createMany({
        data: training.modules.map((module) => ({
          name: module.name,
          position: module.position,
          description: module.description,
          trainingProgramId: trainingProgram.id,
        })),
      });

      await tx.preRequest.deleteMany({
        where: { trainingProgramId: trainingProgram.id },
      });
      await tx.preRequest.createMany({
        data: training.requiredLevel.map((level) => ({
          label: level.label,
          order: level.order,
          trainingProgramId: trainingProgram.id,
        })),
      });

      await tx.carrerOpportunity.deleteMany({
        where: { trainingProgramId: trainingProgram.id },
      });
      await tx.carrerOpportunity.createMany({
        data: training.opportunities.map((opportunity) => ({
          label: opportunity.label,
          trainingProgramId: trainingProgram.id,
        })),
      });
    }
  });
}
