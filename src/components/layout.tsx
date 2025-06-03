import { Button } from "@/components/ui/button";
import { Outlet, Link } from "@tanstack/react-router";

export function RootLayout() {
  return (
    <div className="min-h-svh">
      <nav className="border-b p-4">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/table">Table</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/calls">Calls</Link>
          </Button>
        </div>
      </nav>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}