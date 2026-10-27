import { NextResponse, type NextRequest } from 'next/server';
import { contentText } from '@/lib/server/content-admin';

export const dynamic = 'force-dynamic';
/** CSV downloads: /admin/content/export?what=subscribers  or  ?what=registrations&id=<event id>. The backend decides who may download. */
export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams; const what = u.get('what'); const id = u.get('id') ?? '';
  const path = what === 'subscribers' ? '/subscribers.csv' : what === 'registrations' && /^[0-9a-f-]{36}$/i.test(id) ? `/events/${id}/registrations.csv` : null;
  if (!path) return new NextResponse('Not found', { status: 404 });
  try {
    const r = await contentText(path);
    return new NextResponse(r.body, { headers: { 'Content-Type': r.type, 'Content-Disposition': `attachment; filename="${what}.csv"`, 'Cache-Control': 'no-store' } });
  } catch { return new NextResponse('Not allowed or unavailable', { status: 403 }); }
}
