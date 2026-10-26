import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="mt-16 text-center">
    <h1 className="text-5xl font-semibold">Page not found</h1>
    <p className="mt-4 text-gray-600 dark:text-gray-300">
      That page doesn&apos;t exist.
    </p>
    <Link
      to="/"
      className="mt-6 inline-block px-6 py-3 rounded-full bg-orange-300 text-gray-900 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
    >
      Back to home
    </Link>
  </main>
);

export default NotFoundPage;
