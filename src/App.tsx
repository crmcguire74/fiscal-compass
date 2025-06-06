import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { pageview } from "./utils/analytics";
import { HelmetProvider } from "react-helmet-async"; // Reverting to named import
import ScrollToTop from "./components/shared/ScrollToTop";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import CalculatorsIndex from "./pages/calculators/CalculatorsIndex";
import CompoundInterestPage from "./pages/calculators/investment/CompoundInterestPage";
import InvestmentCalculatorsIndex from "./pages/calculators/investment/InvestmentCalculatorsIndex";
import SavingsCalculatorPage from "./pages/calculators/investment/SavingsCalculatorPage";
import MortgageCalculatorsIndex from "./pages/calculators/mortgage/MortgageCalculatorsIndex";
import MortgagePaymentPage from "./pages/calculators/mortgage/MortgagePaymentPage";
import HomeEquityLoanPage from "./pages/calculators/mortgage/HomeEquityLoanPage";
import HelocPage from "./pages/calculators/mortgage/HelocPage";
import RetirementCalculatorsIndex from "./pages/calculators/retirement/RetirementCalculatorsIndex";
import RetirementSavingsPage from "./pages/calculators/retirement/RetirementSavingsPage";
import EarlyIraWithdrawalPage from "./pages/calculators/retirement/EarlyIraWithdrawalPage";
import EducationCalculatorsIndex from "./pages/calculators/education/EducationCalculatorsIndex";
import CollegeSavingsPage from "./pages/calculators/education/CollegeSavingsPage";
import DebtCalculatorsIndex from "./pages/calculators/debt/DebtCalculatorsIndex";
import DtiCalculatorPage from "./pages/calculators/debt/DtiCalculatorPage";
import MortgageDtiCalculatorPage from "./pages/calculators/mortgage/DtiCalculatorPage";
import HealthCalculatorsIndex from "./pages/calculators/health/HealthCalculatorsIndex";
import BmiCalculatorPage from "./pages/calculators/health/BmiCalculatorPage";
import BodyFatCalculatorPage from "./pages/calculators/health/BodyFatCalculatorPage";
import CalorieCalculatorPage from "./pages/calculators/health/CalorieCalculatorPage";
import MacroCalculatorPage from "./pages/calculators/health/MacroCalculatorPage";
import ProteinCalculatorPage from "./pages/calculators/health/ProteinCalculatorPage";
import TaxCalculatorsIndex from "./pages/calculators/tax/TaxCalculatorsIndex";
import IncomeTaxCalculatorPage from "./pages/calculators/tax/IncomeTaxCalculatorPage";
import TakeHomePaySalariedPage from "./pages/calculators/tax/TakeHomePaySalariedPage"; // Renamed import
import TakeHomePayHourlyPage from "./pages/calculators/tax/TakeHomePayHourlyPage"; // Added import
import BonusTaxCalculatorPage from "./pages/calculators/tax/BonusTaxCalculatorPage";
import TaxBracketCalculatorPage from "./pages/calculators/tax/TaxBracketCalculatorPage";
import FreelanceRateCalculatorPage from "./pages/calculators/tax/FreelanceRateCalculatorPage"; // Added import
import HomeEquityCalculatorPage from "./pages/calculators/real-estate/HomeEquityCalculatorPage";
import BusinessCalculatorsIndex from "./pages/calculators/business/BusinessCalculatorsIndex";
import BreakEvenAnalysisPage from "./pages/calculators/business/BreakEvenAnalysisPage";
import ProfitMarginCalculatorPage from "./pages/calculators/business/ProfitMarginCalculatorPage";
import RoiCalculatorPage from "./pages/calculators/business/RoiCalculatorPage";
import BusinessValuationPage from "./pages/calculators/business/BusinessValuationPage";
import InsuranceCalculatorsIndex from "./pages/calculators/insurance/InsuranceCalculatorsIndex";
import AutoInsurancePage from "./pages/calculators/insurance/AutoInsurancePage";
import LifeInsuranceNeedsPage from "./pages/calculators/insurance/LifeInsuranceNeedsPage";
import BlogIndex from "./pages/blog/BlogIndex";
import BlogPostPage from "./pages/blog/BlogPostPage";
import FeaturedArticlesPage from "./pages/blog/FeaturedArticlesPage";
import RelatedArticlesPage from "./pages/blog/RelatedArticlesPage";
import About from "./pages/about/About";
import LifeEventsCalculatorsIndex from "./pages/calculators/life-events/LifeEventsCalculatorsIndex";
import WeddingBudgetPage from "./pages/calculators/life-events/WeddingBudgetPage";
import BabyCostPage from "./pages/calculators/life-events/BabyCostPage";
import DivorceCalculatorPage from "./pages/calculators/life-events/DivorceCalculatorPage";
import DebtPayoffCalculatorPage from "./pages/calculators/debt/DebtPayoffCalculatorPage";
import ToolsCalculatorsIndex from "./pages/calculators/tools/ToolsCalculatorsIndex";
import CurrencyConverterPage from "./pages/calculators/tools/CurrencyConverterPage";
import MeasurementConverterPage from "./pages/calculators/tools/MeasurementConverterPage";
import TimeCalculatorPage from "./pages/calculators/tools/TimeCalculatorPage";
import ScientificCalculatorPage from "./pages/calculators/tools/ScientificCalculatorPage";
import ValueTimePage from "./pages/calculators/tools/ValueTimePage";
import InflationPage from "./pages/calculators/tools/InflationPage"; // Added import
import AutoLoanPage from "./pages/calculators/auto/AutoLoanPage";
import AutoLeasePage from "./pages/calculators/auto/AutoLeasePage";
import GasMaintenancePage from "./pages/calculators/auto/GasMaintenancePage";
import AutoCalculatorsIndex from "./pages/calculators/auto/AutoCalculatorsIndex";
import RentVsBuyPage from "./pages/calculators/mortgage/RentVsBuyPage";
import RealEstateCalculatorsIndex from "./pages/calculators/real-estate/RealEstateCalculatorsIndex";
import CostToClosePage from "./pages/calculators/mortgage/CostToClosePage";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import Disclaimer from "./pages/legal/Disclaimer";

const queryClient = new QueryClient();

// Analytics wrapper component
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <BrowserRouter>
            <AnalyticsWrapper>
              <ScrollToTop />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                {/* Main Calculators Index */}
                <Route path="/calculators" element={<CalculatorsIndex />} />
                {/* Investment Calculator Routes */}
                <Route
                  path="/calculators/investment"
                  element={<InvestmentCalculatorsIndex />}
                />
                <Route
                  path="/calculators/investment/compound-interest"
                  element={<CompoundInterestPage />}
                />
                <Route
                  path="/calculators/investment/savings-calculator"
                  element={<SavingsCalculatorPage />}
                />
                {/* Mortgage Calculator Routes */}
                <Route
                  path="/calculators/mortgage"
                  element={<MortgageCalculatorsIndex />}
                />
                <Route
                  path="/calculators/mortgage/mortgage-payment"
                  element={<MortgagePaymentPage />}
                />
                <Route
                  path="/calculators/mortgage/home-equity-loan"
                  element={<HomeEquityLoanPage />}
                />
                <Route
                  path="/calculators/mortgage/heloc"
                  element={<HelocPage />}
                />
                <Route
                  path="/calculators/mortgage/dti-calculator"
                  element={<MortgageDtiCalculatorPage />}
                />
                <Route
                  path="/calculators/home-mortgage"
                  element={<MortgageCalculatorsIndex />}
                />{" "}
                {/* Redirect for old URL format */}
                {/* Retirement Calculator Routes */}
                <Route
                  path="/calculators/retirement"
                  element={<RetirementCalculatorsIndex />}
                />
                <Route
                  path="/calculators/retirement/retirement-savings"
                  element={<RetirementSavingsPage />}
                />
                <Route
                  path="/calculators/retirement/early-ira-withdrawal"
                  element={<EarlyIraWithdrawalPage />}
                />
                {/* Education Calculator Routes */}
                <Route
                  path="/calculators/education"
                  element={<EducationCalculatorsIndex />}
                />
                <Route
                  path="/calculators/education/college-savings"
                  element={<CollegeSavingsPage />}
                />
                {/* Health Calculator Routes */}
                <Route
                  path="/calculators/health"
                  element={<HealthCalculatorsIndex />}
                />
                <Route
                  path="/calculators/health/bmi-calculator"
                  element={<BmiCalculatorPage />}
                />
                <Route
                  path="/calculators/health/body-fat-calculator"
                  element={<BodyFatCalculatorPage />}
                />
                <Route
                  path="/calculators/health/calorie-calculator"
                  element={<CalorieCalculatorPage />}
                />
                <Route
                  path="/calculators/health/macro-calculator"
                  element={<MacroCalculatorPage />}
                />
                <Route
                  path="/calculators/health/protein-calculator"
                  element={<ProteinCalculatorPage />}
                />
                {/* Tax Calculator Routes */}
                <Route
                  path="/calculators/tax"
                  element={<TaxCalculatorsIndex />}
                />
                <Route
                  path="/calculators/tax/income-tax-calculator"
                  element={<IncomeTaxCalculatorPage />}
                />
                <Route
                  path="/calculators/tax/take-home-pay-salaried" // Updated path
                  element={<TakeHomePaySalariedPage />} // Updated element
                />
                <Route
                  path="/calculators/tax/take-home-pay-hourly" // Added route
                  element={<TakeHomePayHourlyPage />}
                />
                <Route
                  path="/calculators/tax/bonus-tax-calculator"
                  element={<BonusTaxCalculatorPage />}
                />
                <Route
                  path="/calculators/tax/tax-bracket-calculator"
                  element={<TaxBracketCalculatorPage />}
                />
                <Route
                  path="/calculators/tax/freelance-rate-calculator" // Added route
                  element={<FreelanceRateCalculatorPage />}
                />
                {/* Real Estate Calculator Routes */}
                <Route
                  path="/calculators/real-estate"
                  element={<RealEstateCalculatorsIndex />}
                />
                <Route
                  path="/calculators/real-estate/home-equity-calculator"
                  element={<HomeEquityCalculatorPage />}
                />
                {/* Mortgage Calculator Routes */}
                <Route
                  path="/calculators/mortgage/rent-vs-buy"
                  element={<RentVsBuyPage />}
                />
                <Route
                  path="/calculators/mortgage/cost-to-close"
                  element={<CostToClosePage />}
                />
                {/* Debt Management Calculator Routes */}
                <Route
                  path="/calculators/debt"
                  element={<DebtCalculatorsIndex />}
                />
                <Route
                  path="/calculators/debt/dti-calculator"
                  element={<DtiCalculatorPage />}
                />
                <Route
                  path="/calculators/debt/payoff-calculator"
                  element={<DebtPayoffCalculatorPage />}
                />
                {/* Business Calculator Routes */}
                <Route
                  path="/calculators/business"
                  element={<BusinessCalculatorsIndex />}
                />
                <Route
                  path="/calculators/business/break-even-analysis"
                  element={<BreakEvenAnalysisPage />}
                />
                <Route
                  path="/calculators/business/profit-margin-calculator"
                  element={<ProfitMarginCalculatorPage />}
                />
                <Route
                  path="/calculators/business/roi-calculator"
                  element={<RoiCalculatorPage />}
                />
                <Route
                  path="/calculators/business/business-valuation"
                  element={<BusinessValuationPage />}
                />
                {/* Insurance Calculator Routes */}
                <Route
                  path="/calculators/insurance"
                  element={<InsuranceCalculatorsIndex />}
                />
                <Route
                  path="/calculators/insurance/auto-insurance"
                  element={<AutoInsurancePage />}
                />
                <Route
                  path="/calculators/insurance/life-insurance-needs"
                  element={<LifeInsuranceNeedsPage />}
                />
                {/* Life Events Calculator Routes */}
                <Route
                  path="/calculators/life-events"
                  element={<LifeEventsCalculatorsIndex />}
                />
                <Route
                  path="/calculators/life-events/wedding-budget"
                  element={<WeddingBudgetPage />}
                />
                <Route
                  path="/calculators/life-events/baby-costs"
                  element={<BabyCostPage />}
                />
                <Route
                  path="/calculators/life-events/divorce-calculator"
                  element={<DivorceCalculatorPage />}
                />
                {/* Auto Calculator Routes */}
                <Route
                  path="/calculators/auto"
                  element={<AutoCalculatorsIndex />}
                />
                <Route
                  path="/calculators/auto/auto-loan"
                  element={<AutoLoanPage />}
                />
                <Route
                  path="/calculators/auto/auto-lease"
                  element={<AutoLeasePage />}
                />
                <Route
                  path="/calculators/auto/gas-maintenance"
                  element={<GasMaintenancePage />}
                />
                {/* Blog Routes */}
                <Route path="/blog" element={<BlogIndex />} />
                <Route
                  path="/blog/featured"
                  element={<FeaturedArticlesPage />}
                />
                <Route
                  path="/blog/related/:type/:value"
                  element={<RelatedArticlesPage />}
                />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                {/* Tools Calculator Routes */}
                <Route
                  path="/calculators/tools"
                  element={<ToolsCalculatorsIndex />}
                />
                <Route
                  path="/calculators/tools/currency-converter"
                  element={<CurrencyConverterPage />}
                />
                <Route
                  path="/calculators/tools/measurement-converter"
                  element={<MeasurementConverterPage />}
                />
                <Route
                  path="/calculators/tools/time-calculator"
                  element={<TimeCalculatorPage />}
                />
                <Route
                  path="/calculators/tools/scientific-calculator"
                  element={<ScientificCalculatorPage />}
                />
                <Route
                  path="/calculators/tools/value-of-time"
                  element={<ValueTimePage />}
                />
                <Route
                  path="/calculators/tools/inflation"
                  element={<InflationPage />}
                />
                {/* Legal Routes */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsWrapper>
          </BrowserRouter>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
