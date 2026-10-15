// Add each person's real title and a short bio when confirmed; both are optional and shown only if set.
export interface TeamMember { name: string; role?: string; bio?: string; photo: string }
export const team: TeamMember[] = [
  { name: 'Donatien', photo: '/images/team/donatien.jpg' },
  { name: 'Patrice', photo: '/images/team/patrice.jpg' },
  { name: 'Pascal', photo: '/images/team/pascal.jpg' },
];
