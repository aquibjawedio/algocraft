import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";

const company = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const social = [
  { name: "Twitter", href: "https://twitter.com/aquibjawedio", icon: Twitter },
  { name: "GitHub", href: "https://github.com/aquibjawedio", icon: Github },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/aquibjawedio",
    icon: Linkedin,
  },
];

const Footer = () => {
  return (
    <footer className="w-full px-6 py-10 bg-background border-t border-border text-muted-foreground">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">AlgoCraft</h3>
          <p className="text-sm">Craft your DSA skills smartly.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-12">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="hover:text-primary transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Social
            </h4>
            <ul className="space-y-2 text-sm">
              {social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-8 border-t border-border text-xs text-center">
        © {new Date().getFullYear()} AlgoCraft. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
