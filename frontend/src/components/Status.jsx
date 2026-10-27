import React from "react";

// Shows one of: loading, error (with Retry), or an empty message.
const Status = ({ loading, error, empty, onRetry, loadingText = "Loading…", emptyText }) => {
  if (loading) {
    return (
      <p role="status" className="mt-6 text-center text-gray-600 dark:text-gray-300">
        {loadingText}
      </p>
    );
  }
  if (error) {
    return (
      <div role="alert" className="mt-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 focus-visible:ring-2 focus-visible:ring-orange-400 outline-none"
          >
            Retry
          </button>
        )}
      </div>
    );
  }
  if (empty && emptyText) {
    return (
      <p role="status" className="mt-6 text-center text-gray-600 dark:text-gray-300">
        {emptyText}
      </p>
    );
  }
  return null;
};

export default Status;
