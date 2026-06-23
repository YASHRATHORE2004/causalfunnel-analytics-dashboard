(function () {
  const STORAGE_KEY = 'analytics_session_id';
  const ACTIVITY_KEY = 'analytics_last_activity';
  const API_URL = 'http://localhost:5000/api/events';
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  function generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }

  function getStoredSessionId() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function getLastActivity() {
    const stored = localStorage.getItem(ACTIVITY_KEY);
    const timestamp = stored ? Number(stored) : NaN;
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  function setSessionId(sessionId) {
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  function setLastActivity(timestamp) {
    localStorage.setItem(ACTIVITY_KEY, String(timestamp));
  }

  function isSessionExpired(lastActivity) {
    if (!lastActivity) {
      return true;
    }

    return Date.now() - lastActivity >= SESSION_TIMEOUT;
  }

  function createOrRenewSession() {
    const existingSessionId = getStoredSessionId();
    const lastActivity = getLastActivity();

    if (!existingSessionId || isSessionExpired(lastActivity)) {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      return newSessionId;
    }

    return existingSessionId;
  }

  function updateActivity() {
    setLastActivity(Date.now());
  }

  function sendEvent(payload) {
    try {
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch((error) => {
        console.error('Analytics send failed:', error);
      });
    } catch (error) {
      console.error('Analytics send failed:', error);

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          API_URL,
          new Blob([JSON.stringify(payload)], {
            type: 'application/json',
          })
        );
      }
    }
  }

  function trackPageView(sessionId) {
    updateActivity();
    sendEvent({
      sessionId,
      eventType: 'page_view',
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      clickX: null,
      clickY: null,
    });
  }

  function trackClick(sessionId, event) {
    updateActivity();
    sendEvent({
      sessionId,
      eventType: 'click',
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      clickX: event.clientX,
      clickY: event.clientY,
    });
  }

  const sessionId = createOrRenewSession();

  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    trackPageView(sessionId);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      trackPageView(sessionId);
    });
  }

  document.addEventListener('click', (event) => {
    trackClick(sessionId, event);
  });
})();