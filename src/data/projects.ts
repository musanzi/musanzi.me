import type { ImageMetadata } from 'astro';
import cinoluImage from '../assets/cinolu.png';
import fikiriImage from '../assets/fikiri.png';
import iscImage from '../assets/ISC2026.jpeg';
import kbmImage from '../assets/kbm.gif';

export interface IProject {
  slug: string;
  name: string;
  summary: string;
  image: ImageMetadata;
  imageAlt: string;
  problem: string;
  solution: string;
  responsibilities: string[];
  highlights: string[];
  links?: {
    label: string;
    url: string;
    type: 'live' | 'github';
  }[];
  metaDescription: string;
}

export const projects: IProject[] = [
  {
    slug: 'fikiri',
    name: 'Fikiri Innovation Platform',
    summary:
      'A UNDP innovation platform that processed more than 400 applications and grew to 7,500 registered accounts.',
    image: fikiriImage,
    imageAlt: 'Conceptual dashboard for the Fikiri innovation platform',
    problem:
      'The United Nations Development Programme launched Fikiri to establish a centralized channel for discovering, evaluating, and promoting innovations submitted by entrepreneurs.',
    solution:
      'Working in a two-developer team, I owned the digital platform from product design and system architecture through development, deployment, and production operations. Fikiri supported the complete journey from application and structured review to shortlisting and publication of winning projects.',
    responsibilities: [
      'Designed the product with UNDP stakeholders and built the entrepreneur-facing Angular application',
      'Owned the shared NestJS API, database design, and system architecture',
      'Deployed and operated the platform on a VPS using Caddy and PM2',
      'Migrated live applications from a hard-coded form to a configurable dynamic-form model'
    ],
    highlights: [
      'More than 400 innovation applications processed',
      'Eight winning projects selected through structured reviews and UNDP approval',
      'Growth from about 1,000 to 7,500 registered accounts',
      'Approximately 6,500 verified registrations attributed to participant referrals'
    ],
    links: [
      { label: 'Visit live site', url: 'https://fikiri.co', type: 'live' },
      { label: 'Web repository', url: 'https://github.com/cinolu-software/fikiri.co', type: 'github' },
      { label: 'API repository', url: 'https://github.com/cinolu-software/api.fikiri.co', type: 'github' }
    ],
    metaDescription:
      'How I built Fikiri for UNDP, processing 400 applications and growing the innovation ecosystem to 7,500 accounts.'
  },
  {
    slug: 'kbm-2026',
    name: 'Katanga Business Meeting 2026',
    summary:
      'Participant support and event-operations automation for the business forum that turns opportunities into partnerships.',
    image: kbmImage,
    imageAlt: 'Katanga Business Meeting 2026 event banner',
    problem:
      'KBM participants needed help accessing Brella, setting up virtual stands, and using its matchmaking tools. The event team also needed a simpler way to move participant data from Brella into its badge-printing workflow.',
    solution:
      'I supported participants throughout their Brella onboarding and event setup, then built a script that fetched participant records from Brella and exported them to CSV, making the data easier for the team to use when printing badges.',
    responsibilities: [
      'Helped participants log in to and navigate the Brella event platform',
      'Assisted exhibitors with setting up their virtual stands',
      "Guided users through Brella's matchmaking features",
      'Automated the extraction of participant data into CSV for badge printing'
    ],
    highlights: [
      'Hands-on participant support for a major business forum',
      'Faster transfer of attendee data from Brella to badge production',
      'Reduced manual work for the event operations team',
      'Better access to virtual stands and business matchmaking'
    ],
    metaDescription:
      'How I supported KBM 2026 participants on Brella and automated attendee-data exports for badge printing.'
  },
  {
    slug: 'innovation-summer-camp-2026',
    name: 'Innovation Summer Camp 2026',
    summary:
      'A beginner-focused learning program introducing web development fundamentals and the responsible use of artificial intelligence.',
    image: iscImage,
    imageAlt: 'Innovation Summer Camp 2026 registration poster',
    problem:
      'Aspiring developers needed an accessible introduction to how the web works while also learning how to use emerging AI tools thoughtfully rather than depending on them without understanding the fundamentals.',
    solution:
      'I taught the foundations of web development and introduced participants to artificial intelligence, with an emphasis on using AI appropriately as a learning and problem-solving tool.',
    responsibilities: [
      'Introduced participants to the fundamental concepts behind web development',
      'Explained core artificial intelligence concepts in accessible language',
      'Demonstrated how AI can support learning and development work',
      'Emphasized responsible use, critical thinking, and verification of AI output'
    ],
    highlights: [
      'Combined foundational coding education with practical AI literacy',
      'Made technical concepts approachable for beginner learners',
      'Positioned AI as an assistive tool rather than a substitute for understanding',
      'Promoted responsible and critical use of generated output'
    ],
    metaDescription: 'How I taught web development fundamentals and responsible AI use at Innovation Summer Camp 2026.'
  },
  {
    slug: 'cinolu-onestop',
    name: 'CINOLU OneStop',
    summary:
      'A centralized platform used by CINOLU to manage programs and connect 2,800 registered entrepreneurs with opportunities.',
    image: cinoluImage,
    imageAlt: 'Conceptual dashboard for the CINOLU OneStop business platform',
    problem:
      'Entrepreneurs had to use disconnected tools to discover opportunities, register for programs, follow events, and access project resources. That fragmentation made the experience difficult to navigate and added operational overhead for the team managing each initiative.',
    solution:
      'I collaborated with a UI/UX designer and delivered a unified platform that gives entrepreneurs one place to participate while giving CINOLU staff an administration dashboard for creating programs and managing participation.',
    responsibilities: [
      'Owned the technical delivery from architecture through production operations',
      'Designed the database and developed the NestJS backend API',
      'Built the Angular client and administration applications',
      'Containerized the applications with Docker and deployed them to a VPS'
    ],
    highlights: [
      '2,800 entrepreneurs registered on the platform',
      '10 programs administered through OneStop',
      'One staff dashboard for creating programs and managing participation',
      'A unified experience for discovering and joining opportunities'
    ],
    links: [
      { label: 'Visit live site', url: 'https://cinolu.org', type: 'live' },
      { label: 'Web repository', url: 'https://github.com/musanzi/cinolu.org', type: 'github' },
      { label: 'API repository', url: 'https://github.com/musanzi/api.cinolu.org', type: 'github' }
    ],
    metaDescription: 'How I built CINOLU OneStop, a platform serving 2,800 entrepreneurs and supporting 10 programs.'
  }
];
