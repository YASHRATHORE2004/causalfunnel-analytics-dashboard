export default function EmptyState({ message }) {
  return (
  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
    <p className="text-lg font-medium text-gray-600">
      {message}
    </p>
  </div>
);
}
