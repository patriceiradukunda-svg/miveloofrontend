export interface StaffModule { id: string; title: string; desc: string; features: string[] }
const rows: [string, string, string, string[]][] = [
 ['careers/applications', 'Applications', 'Review applications submitted through the public careers pages.', ['Inbox of new applications per job post', 'Pipeline: new, screening, interview, offer, rejected', 'Reviewer notes and scoring']],
 ['careers/candidates', 'Candidates', 'Everyone who has applied, across all job posts.', ['Candidate profiles and history', 'Talent pool and tags', 'Duplicate detection']],
 ['careers/interviews', 'Interviews', 'Schedule and track interviews.', ['Interview calendar', 'Panel and feedback forms', 'Decision records']],
 ['careers/ideas', 'Idea submissions', 'Ideas sent through the public careers idea form.', ['Submitted ideas inbox', 'Triage and reply', 'Convert to a role or project']],
 ['hr', 'HR', 'Staff directory and people operations.', ['Staff directory', 'Onboarding checklists', 'Leave and records']],
 ['content', 'Content', 'Blog, news, events and media in one place.', ['Content calendar', 'Drafts awaiting review', 'Published items']],
 ['content/blog', 'Blog', 'Write, edit and publish blog posts.', ['Drafts, review and publish workflow', 'Categories and authors', 'Scheduling']],
 ['content/news', 'News', 'Manage news and announcements shown on the public Updates pages.', ['Create and edit news items', 'Approval before publishing', 'Archive']],
 ['content/events', 'Events', 'Manage events shown on the public Updates pages.', ['Create events with date, place and registration link', 'Publish and unpublish', 'Past events archive']],
 ['content/media', 'Media library', 'Images and files used in content.', ['Upload and organise media', 'Alt text and credits', 'Usage tracking']],
 ['verification', 'Verification', 'Review school, supplier and cooperative verification requests.', ['Pending queue', 'Document review', 'Approve, reject or request more information']],
 ['moderation', 'Marketplace moderation', 'Review listings and reports on the marketplace.', ['Listing approval queue', 'Reported listings', 'Moderation log']],
 ['access', 'Roles and access', 'Manage staff positions and who can reach which pages.', ['Position directory', 'Assign and change positions', 'Access change history']],
 ['customer-success', 'Customer success', 'Onboarding and health of schools, suppliers and cooperatives.', ['Onboarding progress', 'Accounts at risk', 'Follow-up tasks']],
 ['finance', 'Finance', 'Platform revenue, payouts and reconciliation.', ['Revenue overview', 'Payouts and fees', 'Reconciliation']],
 ['reports', 'Reports and impact', 'Impact and operational reporting.', ['Scheduled reports', 'Impact indicators', 'Exports']],
 ['partnerships', 'Partnerships', 'Partner organisations and agreements.', ['Partner directory', 'Agreements and renewals', 'Joint initiatives']],
 ['seo', 'SEO and website', 'Search visibility and site settings.', ['Page titles and descriptions', 'Redirects and sitemap', 'Search performance']],
 ['data-governance', 'Data governance and privacy', 'Data access, retention and privacy requests.', ['Data catalogue', 'Privacy requests', 'Retention rules']],
 ['tech-ops', 'Technical operations', 'Platform health and deployments.', ['Service status', 'Deployments', 'Incidents']],
 ['integrations', 'Integrations', 'Connections to payment, messaging and data providers.', ['Connected services', 'Webhooks and keys status', 'Sync logs']],
 ['audit', 'Audit log', 'Who did what, and when.', ['Searchable audit trail', 'Filter by person, action and date', 'Export']],
];
export const staffModules: StaffModule[] = rows.map(([id, title, desc, features]) => ({ id, title, desc, features }));
export function staffModule(id: string): StaffModule {
  return staffModules.find((m) => m.id === id) ?? { id, title: id, desc: '', features: [] };
}
