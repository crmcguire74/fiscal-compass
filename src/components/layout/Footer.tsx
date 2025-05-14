import { Link } from "react-router-dom";
import { useActiveRoute } from "@/hooks/use-active-route";
import { CALCULATOR_CATEGORIES } from "@/lib/constants";
import Logo from "@/components/ui/logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isActive } = useActiveRoute();

  // Custom styles for active links with a subtle underline effect
  const activeStyles =
    "text-finance-primary relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-finance-primary/40 after:to-finance-primary/10";

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link
              to="/calculators"
              className="flex items-center gap-2 font-heading text-xl font-bold text-finance-primary"
            >
              <Logo size="sm" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Comprehensive financial planning tools that respect your privacy
              and help you make informed decisions.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-sm mb-4">Calculators</h3>
            <ul className="space-y-3">
              {CALCULATOR_CATEGORIES.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/calculators/${category.id}`}
                    className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${
                      isActive(`/calculators/${category.id}`)
                        ? activeStyles
                        : ""
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-sm mb-4">More Calculators</h3>
            <ul className="space-y-3">
              {CALCULATOR_CATEGORIES.slice(5, 10).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/calculators/${category.id}`}
                    className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${
                      isActive(`/calculators/${category.id}`)
                        ? activeStyles
                        : ""
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${
                    isActive("/about") ? activeStyles : ""
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${
                    isActive("/blog") ? activeStyles : ""
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${
                    isActive("/privacy") ? activeStyles : ""
                  }`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${
                    isActive("/terms") ? activeStyles : ""
                  }`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${
                    isActive("/disclaimer") ? activeStyles : ""
                  }`}
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`text-sm text-muted-foreground hover:text-primary transition-colors relative ${
                    isActive("/contact") ? activeStyles : ""
                  }`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Fiscal Compass. All rights reserved.
              <br />
              <span className="text-xs">
                As an Amazon Associate and affiliate of other programs, we may
                earn from qualifying purchases.
              </span>
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className={`text-xs text-muted-foreground hover:text-primary transition-colors relative ${
                  isActive("/privacy") ? activeStyles : ""
                }`}
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className={`text-xs text-muted-foreground hover:text-primary transition-colors relative ${
                  isActive("/terms") ? activeStyles : ""
                }`}
              >
                Terms
              </Link>
              <Link
                to="/disclaimer"
                className={`text-xs text-muted-foreground hover:text-primary transition-colors relative ${
                  isActive("/disclaimer") ? activeStyles : ""
                }`}
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
