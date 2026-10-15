import { PageHeader } from '@/components/layout/PageHeader';
import { NotificationCenter } from '@/features/notifications/NotificationCenter';
export const metadata = { title: 'Notifications' };
export default function Page() { return <div className="space-y-6"><PageHeader title="Notifications and activity" lead="Orders, payments, stock, deliveries, verification and alerts in one place." status="in-development" /><NotificationCenter /></div>; }
