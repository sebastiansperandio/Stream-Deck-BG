'use client';

// Lightweight analytics tracking utility
// Generates a random session_id per page load and sends events to /api/track

const SESSION_ID = typeof crypto !== 'undefined'
  ? crypto.randomUUID()
  : Math.random().toString(36).substring(2);

/**
 * Track an analytics event. Fire-and-forget — never blocks the UI.
 * @param eventName - The name of the event (e.g., 'page_view', 'model_selected')
 * @param eventData - Optional extra data to attach to the event
 */
export function trackEvent(eventName: string, eventData?: Record<string, unknown>): void {
  const payload = JSON.stringify({
    session_id: SESSION_ID,
    event_name: eventName,
    event_data: eventData || {},
  });

  // Prefer sendBeacon for reliability (works even during page unload)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/track', blob);
  } else if (typeof fetch !== 'undefined') {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    }).catch(() => {
      // Silently ignore tracking failures — never affect user experience
    });
  }
}
