import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div>
      <h1>Welcome to Your App!</h1>
      <p>This is a minimal deployment test.</p>
    </div>
  );
}
