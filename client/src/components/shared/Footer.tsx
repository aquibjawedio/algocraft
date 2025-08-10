import { Link } from "react-router-dom";

const product = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Roadmap", href: "/roadmap" },
  { name: "Changelog", href: "/changelog" },
];

const company = [
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
];

const legal = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "Security", href: "/security" },
];

const social = [
  { name: "Twitter", href: "https://twitter.com/aquibjawedio" },
  { name: "GitHub", href: "https://github.com/aquibjawedio" },
  { name: "LinkedIn", href: "https://linkedin.com/in/aquibjawedio" },
  { name: "YouTube", href: "https://youtube.com/@aquibjawedio" },
];

const Footer = () => {
  return (
    <footer className="w-full px-6 py-12 bg-background border-t border-border text-muted-foreground">
      <div className="w-full flex flex-col gap-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand Info */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              AlgoCraft
            </h3>
            <p className="text-sm">Craft your DSA skills smartly.</p>
          </div>

          {/* Link Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 flex-1">
            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Product
              </h4>
              <ul className="space-y-2 text-sm">
                {product.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-primary transition cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                {company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-primary transition cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                {legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-primary transition cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
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
                      className="hover:text-primary transition cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="pt-4 text-xs text-center text-muted-foreground border-t border-border">
          © {new Date().getFullYear()} AlgoCraft. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
