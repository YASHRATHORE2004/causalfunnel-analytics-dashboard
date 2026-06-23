'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { getStats } from '@/lib/api';
import Loader from '@/components/shared/Loader';
import ErrorMessage from '@/components/shared/ErrorMessage';
import EmptyState from '@/components/shared/EmptyState';
import PageHeader from '@/components/shared/PageHeader';
import { formatNumber } from '@/utils/formatters';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const data = await getStats();

        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      <PageHeader
        title="Analytics Dashboard"
        description="Real-time event tracking and analytics overview"
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/sessions"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700 sm:w-auto"
        >
          View Sessions
        </Link>

        <Link
          href="/heatmap"
          className="w-full rounded-lg bg-gray-800 px-4 py-2 text-center font-medium text-white transition hover:bg-gray-900 sm:w-auto"
        >
          View Heatmap
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-600">
            Total Events
          </h3>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatNumber(stats?.totalEvents || 0)}
          </p>
        </div>

        <div className="rounded-lg border-l-4 border-green-500 bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-600">
            Total Sessions
          </h3>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatNumber(stats?.totalSessions || 0)}
          </p>
        </div>

        <div className="rounded-lg border-l-4 border-yellow-500 bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-600">
            Total Page Views
          </h3>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatNumber(stats?.totalPageViews || 0)}
          </p>
        </div>

        <div className="rounded-lg border-l-4 border-red-500 bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-600">
            Total Clicks
          </h3>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatNumber(stats?.totalClicks || 0)}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Top Pages
        </h2>

        {!stats?.topPages || stats.topPages.length === 0 ? (
          <EmptyState message="No page data available yet" />
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Page URL
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Page Views
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Clicks
                  </th>
                </tr>
              </thead>

              <tbody>
                {stats.topPages.map((page, idx) => (
                  <tr
                    key={idx}
                    className="border-b transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/heatmap?pageUrl=${encodeURIComponent(
                          page.pageUrl
                        )}`}
                        className="text-blue-600 hover:underline"
                      >
                        {page.pageUrl}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatNumber(page.pageViewCount)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatNumber(page.clickCount)}
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