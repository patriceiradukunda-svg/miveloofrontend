import { permanentRedirect } from 'next/navigation';
/** Insights is the blog. Kept as an alias so the planned /blog URL never shows a duplicate or empty page. */
export default function BlogPage() { permanentRedirect('/insights'); }
