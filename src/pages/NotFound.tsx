
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft, Home } from "lucide-react";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-20">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-sm border">
          <div className="w-20 h-20 bg-finance-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calculator className="h-10 w-10 text-finance-primary" />
          </div>
          <h1 className="text-6xl font-bold text-finance-primary">404</h1>
          <p className="text-2xl font-medium text-gray-700 mt-2 mb-4">Page Not Found</p>
          <p className="text-gray-500 mb-8">
            Sorry, we couldn't find the calculator or page you were looking for. It might have been moved or doesn't exist.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to="/calculators/investment">
                <Calculator className="mr-2 h-4 w-4" />
                Browse Calculators
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
