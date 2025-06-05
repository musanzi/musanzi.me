import { IExperience } from '../types/experience.interface';

export const experiences: IExperience[] = [
  {
    position: 'Frontend Developer',
    company: 'ZX Connect',
    location: 'Lubumbashi, DR Congo',
    description:
      'Developed and maintained web applications using React and Next.js, focusing on performance and user experience. Collaborated with designers to implement responsive designs and ensure cross-browser compatibility.',
    websiteUrl: 'https://www.linkedin.com/company/zx-connect-sarl/',
    duration: {
      from: 'November 2020',
      to: 'September 2020'
    },
    tools: ['typescript', 'react', 'nextjs', 'firebase', 'tailwindcss', 'git', 'github']
  },
  {
    position: 'Lead Fullstack Developer',
    company: "Centre d'innovation de Lubumbashi",
    location: 'Lubumbashi, DR Congo',
    description:
      'Led the development of a web application for managing local businesses, utilizing Angular and NestJS. Implemented RESTful APIs and integrated with a MariaDB database. Focused on performance optimization and security best practices.',
    websiteUrl: 'https://cinolu.org',
    duration: {
      from: 'November 2023',
      to: 'Present'
    },
    tools: ['typescript', 'angular', 'nestjs', 'mariadb', 'tailwindcss', 'git', 'github', 'vps']
  }
];
