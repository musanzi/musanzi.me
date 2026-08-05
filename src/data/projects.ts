import type { ImageMetadata } from "astro";
import cinoluImage from "../assets/cinolu.png";
import fikiriImage from "../assets/fikiri.png";

export interface Project {
  slug: string;
  name: string;
  summary: string;
  image: ImageMetadata;
  imageAlt: string;
  problem: string;
  solution: string;
  responsibilities: string[];
  technologies: string[];
  highlights: string[];
  metaDescription: string;
}

export const projects: Project[] = [
  {
    slug: "cinolu-onestop",
    name: "CINOLU OneStop",
    summary:
      "A centralized platform connecting entrepreneurs with programs, events, projects, opportunities, and business communities.",
    image: cinoluImage,
    imageAlt: "Conceptual dashboard for the CINOLU OneStop business platform",
    problem:
      "Entrepreneurs had to use disconnected tools to discover opportunities, register for programs, follow events, and access project resources. That fragmentation made the experience difficult to navigate and added operational overhead for the team managing each initiative.",
    solution:
      "I designed and developed a unified web platform with separate public, administration, and API applications. The system gives entrepreneurs one place to participate while giving the organization a structured back office for managing its programs and content.",
    responsibilities: [
      "Designed the overall system architecture",
      "Developed the NestJS backend API",
      "Built the Angular client and administration applications",
      "Implemented authentication, authorization, and session management",
      "Set up Docker-based development and production environments",
      "Configured GitHub Actions CI/CD and VPS deployment",
    ],
    technologies: [
      "Angular",
      "Angular Material",
      "NestJS",
      "Nx",
      "TypeScript",
      "PostgreSQL",
      "TypeORM",
      "Docker",
      "GitHub Actions",
      "PM2",
    ],
    highlights: [
      "Nx monorepo containing separate client and administration applications",
      "CQRS-based modular backend architecture",
      "Programs, sub-programs, events, and projects management",
      "Automated deployment of three independent applications",
    ],
    metaDescription:
      "A case study of CINOLU OneStop, a centralized platform for entrepreneurs, programs, events, and opportunities.",
  },
  {
    slug: "fikiri",
    name: "Fikiri Innovation Platform",
    summary:
      "An innovation platform created to collect, evaluate, and promote solutions submitted by entrepreneurs and innovators.",
    image: fikiriImage,
    imageAlt: "Conceptual dashboard for the Fikiri innovation platform",
    problem:
      "The program needed a scalable digital system for managing a large number of participants, submissions, and selected projects. It also needed to remain dependable throughout an active innovation program with real users and evolving operational needs.",
    solution:
      "I contributed to building, deploying, and maintaining the platform used throughout the innovation program. Product improvements were guided by usage feedback and close collaboration with the teams operating the program.",
    responsibilities: [
      "Developed and maintained application features",
      "Supported platform deployment and production operations",
      "Improved reliability based on real user feedback",
      "Collaborated with program and operational teams",
    ],
    technologies: ["Angular", "NestJS", "TypeScript", "SQL", "Docker", "VPS"],
    highlights: [
      "More than 1,000 initial users",
      "More than 400 submitted solutions",
      "Supported the selection of eight winning projects",
      "Platform later grew to approximately 7,000 active users",
    ],
    metaDescription:
      "A case study of the Fikiri platform for collecting, evaluating, and promoting innovative solutions.",
  },
];
