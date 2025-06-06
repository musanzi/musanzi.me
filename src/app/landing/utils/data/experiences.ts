import { IExperience } from '../types/experience.interface';

export const experiences: IExperience[] = [
  {
    position: 'Frontend Developer',
    company: 'ZX Connect',
    location: 'Lubumbashi, DR Congo',
    description:
      'Built responsive and performant user interfaces using Next.js and React. Collaborated with designers to implement modern UI/UX designs and ensured cross-device compatibility.',
    websiteUrl: 'https://www.linkedin.com/company/zx-connect-sarl/',
    duration: {
      from: 'November 2020',
      to: 'September 2021',
    },
    tools: ['typescript', 'react', 'nextjs', 'tailwindcss', 'git', 'github'],
  },
  {
    position: 'Lead Software Developer',
    company: "Centre d'innovation de Lubumbashi",
    location: 'Lubumbashi, DR Congo',
    description:
      'Led fullstack development of scalable web applications using Angular and NestJS. Designed secure authentication systems, dynamic forms, user workflows for entrepreneurial programs and others apps for the community.',
    websiteUrl: 'https://cinolu.org',
    duration: {
      from: 'November 2023',
      to: 'Present',
    },
    tools: ['typescript', 'angular', 'nestjs', 'mariadb', 'tailwindcss', 'git', 'github'],
  },
];
