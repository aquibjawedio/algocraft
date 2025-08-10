import { Link } from "react-router-dom";

const links = [
  { name: "Problems", path: "/problems" },
  { name: "DSA Sheets", path: "/sheets" },
  { name: "Contests", path: "/contests" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Resources", path: "/resources" },
  { name: "Blogs", path: "/blogs" },
];

const Navbar = () => {
  return (
    <nav className="z-10 relative w-full flex items-center justify-between px-6 py-4 bg-card/5 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-8">
        <div className="text-lg font-semibold tracking-wide">AlgoCraft</div>
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
      <div className="flex items-center gap-6 text-sm font-medium">
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
      </div>
    </nav>
  );
};

export default Navbar;
