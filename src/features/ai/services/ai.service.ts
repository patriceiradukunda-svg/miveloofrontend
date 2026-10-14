import { api, hasBackend } from '@/lib/api-client';
export interface AIReply { text: string; assumptions?: string[]; confidence?: 'low' | 'medium' | 'high' }
export async function askAssistant(question: string): Promise<AIReply> {
  if (hasBackend) return api<AIReply>('/ai/chat', { method: 'POST', body: JSON.stringify({ question }) });
  // No backend: never fabricate. Say so.
  return { text: 'The AI assistant is still in development and no data source is connected, so I cannot answer this reliably. I will not guess prices, quantities or statistics.', confidence: 'low' };
}
