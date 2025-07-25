interface IExperience {
  position: string;
  company: string;
  description: string;
  location: string;
  websiteUrl: string;
  duration: {
    from: string;
    to: string;
  };
  tools: string[];
}

export const EXPERIENCES: IExperience[] = [
  {
    position: 'Frontend Developer',
    company: 'ZX Connect',
    location: 'Lubumbashi, DR Congo',
    description: 'Built responsive and performant user interfaces using Next.js and React.',
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
    description: 'Lead Fullstack Web developer, building and maintaining web applications using Angular and NestJS.',
    websiteUrl: 'https://cinolu.org',
    duration: {
      from: 'November 2023',
      to: 'Present',
    },
    tools: ['typescript', 'angular', 'nestjs', 'mariadb', 'tailwindcss', 'git', 'github'],
  },
];
