export function formatDate(date) {
  if (!date) return '-';

  return new Date(date).toLocaleString();
}

export function formatDuration(seconds) {
  return `${Math.round((seconds || 0) / 60)} min`;
}

export function formatNumber(num) {
  return Number(num || 0).toLocaleString();
}