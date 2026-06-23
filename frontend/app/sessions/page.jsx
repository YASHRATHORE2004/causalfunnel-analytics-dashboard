'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { getSessions } from '@/lib/api';
import Loader from '@/components/shared/Loader';
import ErrorMessage from '@/components/shared/ErrorMessage';
import EmptyState from '@/components/shared/EmptyState';
import PageHeader from '@/components/shared/PageHeader';
import { formatDate, formatNumber } from '@/utils/formatters';

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);

        const data = await getSessions(1, 20);

        setSessions(data.sessions || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Sessions"
          description="View and analyze tracked user sessions"
        />
        <Link href="/">
          <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
            ← Dashboard
          </button>
        </Link>
      </div>

      <div className="mt-8">
        {sessions.length === 0 ? (
          <EmptyState message="No sessions recorded yet" />
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full min-w-[700px]">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Session ID
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Events
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Page Views
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Clicks
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Duration (sec)
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Last Seen
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.sessionId}
                    className="border-b transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-900">
                      {session.sessionId.length > 12
                        ? `${session.sessionId.slice(0, 12)}...`
                        : session.sessionId}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatNumber(session.eventCount)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatNumber(session.pageViewCount)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatNumber(session.clickCount)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {Math.round(session.durationSeconds || 0)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(session.lastSeen)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/sessions/${session.sessionId}`}
                        className="rounded bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}