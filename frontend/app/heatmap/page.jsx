'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getHeatmap } from '@/lib/api';
import HeatmapCanvas from '@/components/heatmap/HeatmapCanvas';
import Loader from '@/components/shared/Loader';
import ErrorMessage from '@/components/shared/ErrorMessage';
import EmptyState from '@/components/shared/EmptyState';
import PageHeader from '@/components/shared/PageHeader';
import { formatNumber } from '@/utils/formatters';

export default function HeatmapPage() {
  const [pageUrl, setPageUrl] = useState('');
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  const handleLoadHeatmap = async () => {
    const trimmedUrl = pageUrl.trim();
    if (!trimmedUrl) {
      setError('Page URL is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHeatmap(null);
      const data = await getHeatmap(trimmedUrl);
      setHeatmap(data);
    } catch (err) {
      setError(err?.message || 'Unable to load heatmap');
      setHeatmap(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlFromParams = searchParams.get('pageUrl')?.trim() || '';
    if (!urlFromParams) {
      return;
    }

    setPageUrl(urlFromParams);

    const loadFromParams = async () => {
      try {
        setLoading(true);
        setError(null);
        setHeatmap(null);
        const data = await getHeatmap(urlFromParams);
        setHeatmap(data);
      } catch (err) {
        setError(err?.message || 'Unable to load heatmap');
        setHeatmap(null);
      } finally {
        setLoading(false);
      }
    };

    loadFromParams();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader 
        title="Heatmap" 
        description="Click analytics visualization"
      />

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Page URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            type="text"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLoadHeatmap();
              }
            }}
            placeholder="Enter the URL you want to analyze"
            className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLoadHeatmap}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load Heatmap'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <ErrorMessage message={error} />
        </div>
      )}

      {loading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}

      {heatmap && (
        <>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-gray-600 text-sm font-medium">Page URL</h3>
  <p className="mt-2 break-all font-mono text-lg font-semibold text-gray-900">
    {heatmap.pageUrl}
  </p>
</div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <h3 className="text-gray-600 text-sm font-medium">Total Clicks</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(heatmap.clickCount)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Click Heatmap</h2>
            <div className="bg-white rounded-lg shadow p-6">
              {heatmap.heatmapPoints && heatmap.heatmapPoints.length > 0 ? (
                <HeatmapCanvas points={heatmap.heatmapPoints} />
              ) : (
                <EmptyState message="No click data available for this page" />
              )}
            </div>
          </div>

          {heatmap.heatmapPoints && heatmap.heatmapPoints.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Click Points</h2>
              <div className="overflow-x-auto rounded-lg bg-white shadow">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        X
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Y
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmap.heatmapPoints.map((point, idx) => (
                      <tr key={`${point.clickX}-${point.clickY}`} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {point.clickX}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {point.clickY}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatNumber(point.count)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !error && !heatmap && (
        <div className="mt-8">
          <EmptyState message="Enter a page URL and click 'Load Heatmap' to view analytics" />
        </div>
      )}
    </div>
  );
}
