import { EmptyState } from '@/components/ui/empty-state';

export function NotificationCenter() {
  return (
    <div className="space-y-8">
      <section aria-label="Activity" className="space-y-4">
        <h2 className="text-2xl font-semibold">Activity</h2>
        <EmptyState
          title="No notifications available"
          body="Notifications will appear here when real activity is connected to the notification service."
        />
      </section>
      <section aria-labelledby="pref-t" className="space-y-2">
        <h2 id="pref-t" className="text-2xl font-semibold">
          Notification preferences
        </h2>
        <p className="text-sm text-ink-soft" role="status">
          Notification preferences cannot be saved yet because the preference
          service is not connected.
        </p>
      </section>
    </div>
  );
}
