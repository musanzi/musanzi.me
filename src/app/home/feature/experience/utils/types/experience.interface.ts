export interface IExperience {
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
