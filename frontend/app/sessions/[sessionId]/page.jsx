'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSessionById } from '@/lib/api';
import Loader from '@/components/shared/Loader';
import ErrorMessage from '@/components/shared/ErrorMessage';
import EmptyState from '@/components/shared/EmptyState';
import PageHeader from '@/components/shared/PageHeader';
import { formatDate, formatNumber } from '@/utils/formatters';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = Array.isArray(params.sessionId)
  ? params.sessionId[0]
  : params.sessionId;
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        setLoading(true);
        const data = await getSessionById(sessionId);
        setSession(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <EmptyState message="Session not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader 
          title="Session Details" 
          description="Detailed view of a tracked user session"
        />
        <Link
            href="/sessions"
            className="rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
            >
            ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Session ID</h3>
          <p className="text-lg font-mono text-gray-900 mt-2 overflow-hidden truncate break-all">
            {session.sessionId}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">First Seen</h3>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {formatDate(session.firstSeen)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Last Seen</h3>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {formatDate(session.lastSeen)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Duration (sec)</h3>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {Math.round(session.durationSeconds || 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-600 text-sm font-medium">Event Count</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatNumber(session.eventCount)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-600 text-sm font-medium">Page Views</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatNumber(session.pageViewCount)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h3 className="text-gray-600 text-sm font-medium">Clicks</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatNumber(session.clickCount)}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Timeline</h2>

        {!session.events || session.events.length === 0 ? (
          <EmptyState message="No events recorded for this session" />
        ) : (
          <div className="space-y-4">
            {session.events.map((event, idx) => (
              <div
  key={`${event.timestamp}-${idx}`}
  className={`rounded-lg bg-white p-6 shadow border-l-4 ${
    event.eventType === 'page_view'
      ? 'border-blue-500'
      : 'border-green-500'
  }`}
>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded text-white text-xs font-bold ${
                        event.eventType === 'page_view' 
                          ? 'bg-blue-500' 
                          : 'bg-green-500'
                      }`}>
                        {event.eventType === 'page_view' ? 'PAGE_VIEW' : 'CLICK'}
                      </span>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.timestamp)}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-gray-900 break-words">
                        <span className="font-semibold">Page:</span> {event.pageUrl}
                      </p>
                    </div>

                    {event.eventType === 'click' && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Click Position:</span> X: {event.clickX}, Y: {event.clickY}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
