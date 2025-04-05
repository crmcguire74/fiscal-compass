import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ScientificCalculator from "@/components/calculators/tools/ScientificCalculator";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/ui/logo";

const ScientificCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const pageContent = (
    <>
      <div
        className={`container mx-auto ${isMobile ? "px-0" : "px-4"} ${
          isMobile ? "py-0" : "py-8"
        }`}
      >
        {!isMobile && (
          <Card className="w-full max-w-4xl mx-auto border-0 sm:border shadow-none sm:shadow mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Scientific Calculator
              </CardTitle>
              <CardDescription className="text-center">
                Perform complex mathematical calculations including
                trigonometric, logarithmic, and exponential functions.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Calculator */}
        <div
          className={`max-w-4xl mx-auto ${
            isMobile ? "w-full h-[calc(100vh-4rem)] overflow-hidden" : ""
          }`}
        >
          <ScientificCalculator />
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50">
          <div className="h-8">
            <Logo />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/calculators")}
            aria-label="Return to calculators"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Content */}
        <div className="pt-16">{pageContent}</div>
      </div>
    );
  }

  return <Layout>{pageContent}</Layout>;
};

export default ScientificCalculatorPage;
