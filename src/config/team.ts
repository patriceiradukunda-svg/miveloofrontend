export interface Qualification {
  credential: string;
  contribution: string;
}

export interface Responsibility {
  title: string; // the leadership title this work belongs to
  scope: string;
}

export interface TeamMember {
  name: string;
  role?: string;
  bio?: string;
  qualifications?: Qualification[];
  responsibilities?: Responsibility[];
  photo: string;
}

export const team: TeamMember[] = [
  {
    name: 'Patrice IRADUKUNDA',
    role: 'Founder / CEO / CFO / CLCO / CMO',
    bio: 'Patrice founded Miveloo and leads its direction. As the data scientist behind Miveloo’s models, he applies his data and statistics background to company strategy, finances, legal oversight and growth.',
    qualifications: [
      {
        credential: 'Master’s in Data Science',
        contribution: 'Builds the data science models behind Miveloo’s food-system intelligence, and turns data into insight for strategy, growth plans and marketing decisions.',
      },
      {
        credential: 'Bachelor’s in Statistics',
        contribution: 'Grounds financial management and performance tracking in sound statistical analysis.',
      },
    ],
    responsibilities: [
      { title: 'Founder / CEO', scope: 'Leads the company vision and strategy, and oversees operations.' },
      { title: 'CFO', scope: 'Leads financial management.' },
      { title: 'CLCO', scope: 'Leads legal and corporate oversight.' },
      { title: 'CMO', scope: 'Leads marketing, brand positioning, partnerships, growth strategy and customer acquisition.' },
    ],
    photo: '/images/team/patrice.jpg',
  },
  {
    name: 'Pascal DUKUNDANE',
    role: 'Co-Founder / CTO / COO / CCO',
    bio: 'Pascal co-founded Miveloo and leads the technology behind it. He applies his software development training to the platform, daily operations and the customer experience.',
    qualifications: [
      {
        credential: 'Bachelor’s in Software Development',
        contribution: 'Builds and maintains the Miveloo platform, integrating Patrice’s models into it, from software and AI features to the infrastructure behind it, and shapes how users experience it.',
      },
    ],
    responsibilities: [
      { title: 'Co-Founder / CTO', scope: 'Leads technology strategy, software development, AI and platform engineering, technical infrastructure and product implementation.' },
      { title: 'COO', scope: 'Coordinates daily operations.' },
      { title: 'CCO', scope: 'Leads customer support, customer relationships, user experience and customer success.' },
    ],
    photo: '/images/team/pascal.jpg',
  },
];
