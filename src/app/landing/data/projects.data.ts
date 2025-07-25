interface IProject {
  title: string;
  description: string;
  img: string;
  websiteUrl: string;
}

export const PROJECTS: IProject[] = [
  {
    title: 'Fikiri',
    description:
      'The fikiri platform aims to identify, map and experiment with innovative solutions to accelerate the achievement of the Sustainable Development Goals (SDGs). Through a structured three-phase process, The platform offers a framework for collaboration and exploration for solution providers, experts and committed institutions.',
    websiteUrl: 'https://fikiri.co',
    img: 'images/fikiri.png',
  },
  {
    title: 'Cinolu One Stop',
    description:
      'One Stop innovation platform to join a community of experts and enthusiasts to turn your ideas into reality. Together, build a better future.',
    websiteUrl: 'https://cinolu.org',
    img: 'images/cinolu.png',
  },
  {
    title: 'Oies Services',
    description:
      'A landing page for a service company, showcasing their offerings and contact information. Built with Angular and Tailwind CSS',
    websiteUrl: 'https://oies-services.vercel.app',
    img: 'images/oies.png',
  },
  {
    title: 'Com360 Agency',
    description:
      'A landing page for a digital marketing agency, highlighting their services and portfolio. Developed using Angular and Tailwind CSS',
    websiteUrl: 'https://com360.vercel.app',
    img: 'images/com360.png',
  },
];
