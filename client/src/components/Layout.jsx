import Navbar from "./Navbar";
import { useLocation } from "wouter";

export default function Layout({ children }) {
  const [location] = useLocation();
  const isLoginPage = location === "/";

  return (
    <div className="min-h-screen bg-background font-sans">
      {!isLoginPage && <Navbar />}
      <main className={!isLoginPage ? "container mx-auto px-4 py-8" : ""}>
        {children}
      </main>
    </div>
  );
}
