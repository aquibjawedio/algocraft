import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useAuthStore } from "@/stores/authStore";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Problems", path: "/problems" },
  { name: "Blogs", path: "/blogs" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="z-10 relative w-full flex items-center justify-between px-6 py-4 bg-card/5 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-12">
        <div className="text-lg font-semibold tracking-wide">
          <Link to="/" className="text-primary hover:text-primary/80">
            AlgoCraft
          </Link>
        </div>

        <div className="items-center gap-8 hidden md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-primary transition text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm font-medium">
        {isAuthenticated ? (
          <ProfileDropdown />
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth/login" className="hover:text-primary transition">
              Login
            </Link>
            <Link to="/auth/register">
              <div className="px-4 py-1.5 border border-primary text-primary rounded-full hover:bg-primary/10 transition">
                Create Account
              </div>
            </Link>
          </div>
        )}

        <button
          className="md:hidden flex items-center text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-background backdrop-blur-lg border-b border-border flex flex-col items-center p-6 space-y-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-primary transition text-sm font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {!isAuthenticated && (
            <div className="flex flex-col gap-3 w-full">
              <Link
                to="/auth/login"
                className="hover:text-primary transition w-full"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-1.5 border border-primary text-primary rounded-full hover:bg-primary/10 transition text-center">
                  Create Account
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
