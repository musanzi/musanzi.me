import { IExperience } from '../types/experience.interface';

export const experiences: IExperience[] = [
  {
    position: 'Frontend Developer',
    company: 'ZX Connect',
    location: 'Lubumbashi, DR Congo',
    description: 'Description 1',
    websiteUrl: 'https://www.linkedin.com/company/zx-connect-sarl/',
    duration: {
      from: 'November 2020',
      to: 'September 2020'
    },
    tools: ['typescript', 'react', 'nextjs', 'firebase', 'tailwindcss', 'git', 'github']
  },
  {
    position: 'Fullstack Developer',
    company: "Centre d'innovation de Lubumbashi",
    location: 'Lubumbashi, DR Congo',
    description: 'Description 1',
    websiteUrl: 'https://cinolu.org',
    duration: {
      from: 'November 2023',
      to: 'Present'
    },
    tools: ['typescript', 'angular', 'nestjs', 'mariadb', 'tailwindcss', 'git', 'github', 'vps']
  }
];
