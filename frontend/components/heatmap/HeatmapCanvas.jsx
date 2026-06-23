'use client';

export default function HeatmapCanvas({ points = [] }) {
  if (!points.length) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-lg border border-gray-300 bg-gray-100">
        <p className="text-gray-500">No heatmap data available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="relative mx-auto h-[500px] w-full max-w-full rounded-lg border border-gray-300 bg-gray-100 overflow-hidden"
      >
        {points.map((point) => {
          if (
            point.clickX == null ||
            point.clickY == null ||
            typeof point.count !== 'number'
          ) {
            return null;
          }

          const size = Math.min(
            Math.max(8 + point.count * 2, 10),
            40
          );

          return (
            <div
              key={`${point.clickX}-${point.clickY}`}
              className="absolute rounded-full bg-red-500 opacity-60 transition hover:opacity-90"
              style={{
                left: `${Math.max(point.clickX, 0)}px`,
                top: `${Math.max(point.clickY, 0)}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: 'translate(-50%, -50%)',
              }}
              title={`X: ${point.clickX}, Y: ${point.clickY}, Clicks: ${point.count}`}
            />
          );
        })}
      </div>
    </div>
  );
}