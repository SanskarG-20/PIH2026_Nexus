import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { ClerkAvailableProvider } from "./hooks/useClerkAvailable";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";
import "./styles/global.css";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerkReady =
  !!CLERK_PUBLISHABLE_KEY &&
  CLERK_PUBLISHABLE_KEY !== "pk_test_REPLACE_WITH_YOUR_KEY";

if (!clerkReady) {
  console.warn(
    "[MargDarshak] Missing or placeholder VITE_CLERK_PUBLISHABLE_KEY — auth features disabled. Add your real key to client/.env"
  );
}

function Providers({ children }) {
  const inner = (
    <ClerkAvailableProvider available={clerkReady}>
      <BrowserRouter>{children}</BrowserRouter>
    </ClerkAvailableProvider>
  );

  if (clerkReady) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        {inner}
      </ClerkProvider>
    );
  }

  return inner;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
