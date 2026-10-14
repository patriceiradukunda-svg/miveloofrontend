import { PageHeader } from '@/components/layout/PageHeader';
import { AIChat } from '@/features/ai/components/AIChat';
export const metadata = { title: 'AI assistant' };
export default function Page() { return <div className="space-y-6"><PageHeader title="AI assistant" lead="Ask questions about the data your role may see." status="in-development" /><AIChat /></div>; }
