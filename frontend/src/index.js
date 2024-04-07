// Import React for creating components and rendering them
import React from "react";

// Import ReactDOM for interacting with the DOM (Document Object Model)
import ReactDOM from "react-dom/client";

// Import global CSS styles for the application
import "./index.css";

// Import the main App component
import App from "./App";

// Target the root element in the HTML document with the ID 'root'
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component within a React.StrictMode environment
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
