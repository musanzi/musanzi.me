import { Layers, Monitor, Wrench, LucideIconData } from 'lucide-angular';

interface IService {
  icon: LucideIconData;
  title: string;
  description: string;
}

export const SERVICES: IService[] = [
  {
    icon: Layers,
    title: 'Fullstack Development',
    description: 'Expertise in both frontend and backend development using Angular & NestJS.',
  },
  {
    icon: Monitor,
    title: 'Frontend Development',
    description: 'Crafting responsive and user-friendly interfaces with modern Angular.',
  },
  {
    icon: Wrench,
    title: 'Backend Development',
    description: 'Building robust and scalable server-side APIs with NestJS.',
  },
];
