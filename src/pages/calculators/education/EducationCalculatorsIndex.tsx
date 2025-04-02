
import { ArrowRight, Book, ChevronRight, Calculator, Info } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const EDUCATION_CALCULATORS = [
  {
    id: 'college-savings',
    name: 'College Savings Calculator',
    description: 'Plan for future education costs with inflation adjustments and various saving strategies',
    icon: Book,
    featured: true,
    status: 'active',
    complexity: 'beginner',
  },
  {
    id: 'student-loan-repayment',
    name: 'Student Loan Repayment Calculator',
    description: 'Compare different repayment plans and strategies for your student loans',
    icon: Calculator,
    featured: false,
    status: 'coming-soon',
    complexity: 'intermediate',
  },
  {
    id: 'education-roi',
    name: 'Education ROI Calculator',
    description: 'Calculate the return on investment for different degrees and institutions',
    icon: Calculator,
    featured: false,
    status: 'coming-soon',
    complexity: 'advanced',
  },
  {
    id: 'financial-aid',
    name: 'Financial Aid Calculator',
    description: 'Estimate potential financial aid eligibility and scholarship opportunities',
    icon: Calculator,
    featured: false,
    status: 'coming-soon',
    complexity: 'intermediate',
  },
];

const EducationCalculatorsIndex = () => {
  // Filter calculators by status and complexity
  const activeCalculators = EDUCATION_CALCULATORS.filter(calc => calc.status === 'active');
  const beginnerCalculators = EDUCATION_CALCULATORS.filter(calc => calc.complexity === 'beginner');
  const intermediateCalculators = EDUCATION_CALCULATORS.filter(calc => calc.complexity === 'intermediate');
  const advancedCalculators = EDUCATION_CALCULATORS.filter(calc => calc.complexity === 'advanced');

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center text-sm mb-3 text-white/80">
              <Link to="/calculators" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/calculators" className="hover:text-white">Calculators</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Education</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Education Planning Calculators</h1>
            <p className="text-xl text-white/90">
              Tools to help you plan and save for education expenses, from college to continuing education
            </p>
          </div>
        </div>
      </div>
      
      {/* Calculators List */}
      <div className="container py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Available Calculators</h2>
          <p className="text-muted-foreground">Our collection of education planning tools</p>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Calculators</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EDUCATION_CALCULATORS.map((calculator) => (
                <CalculatorCard key={calculator.id} calculator={calculator} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="beginner" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beginnerCalculators.map((calculator) => (
                <CalculatorCard key={calculator.id} calculator={calculator} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="intermediate" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {intermediateCalculators.map((calculator) => (
                <CalculatorCard key={calculator.id} calculator={calculator} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedCalculators.map((calculator) => (
                <CalculatorCard key={calculator.id} calculator={calculator} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* More Coming Soon Section */}
        <div className="mt-16 text-center bg-white p-8 rounded-lg border shadow-sm">
          <div className="inline-block bg-blue-50 px-6 py-3 rounded-full text-sm font-medium text-blue-700 mb-4">
            More calculators are being developed
          </div>
          <h2 className="text-2xl font-semibold mb-2">Don't See What You Need?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            We're constantly adding new education planning calculators to help with your financial decisions.
            Check back soon or let us know what calculators you'd like to see.
          </p>
          <Link to="/contact">
            <Button variant="outline">
              Suggest a Calculator
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Help Section */}
      <div className="bg-white py-12 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">How to Use Our Education Calculators</h2>
            <div className="bg-white rounded-lg p-6 border">
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <p className="font-medium">Choose the right calculator for your education needs</p>
                  <p className="text-muted-foreground">Select from our specialized tools based on what you're trying to calculate or analyze.</p>
                </li>
                <li>
                  <p className="font-medium">Enter your financial information and education goals</p>
                  <p className="text-muted-foreground">Input accurate data for the most relevant results. Don't worry - all data stays on your device.</p>
                </li>
                <li>
                  <p className="font-medium">Review the results and visualizations</p>
                  <p className="text-muted-foreground">Analyze charts, graphs, and detailed breakdowns to understand your education finance projections.</p>
                </li>
                <li>
                  <p className="font-medium">Save your results for future reference</p>
                  <p className="text-muted-foreground">Download your results as CSV or save them locally in your browser for future reference.</p>
                </li>
                <li>
                  <p className="font-medium">Adjust inputs to see different scenarios</p>
                  <p className="text-muted-foreground">Try different values to compare outcomes and make better decisions about education financing.</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Extracted CalculatorCard component for cleaner code
const CalculatorCard = ({ calculator }) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden transition-all bg-white ${
        calculator.status === 'active' 
          ? 'hover:shadow-md hover:border-blue-200' 
          : 'opacity-80'
      }`}
    >
      <div className="p-6">
        <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-4">
          <calculator.icon className="h-6 w-6 text-finance-primary" />
        </div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {calculator.name}
            {calculator.featured && (
              <span className="bg-finance-accent/20 text-finance-accent text-xs px-2 py-0.5 rounded-full">
                Popular
              </span>
            )}
          </h3>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>{calculator.name}</DrawerTitle>
                  <DrawerDescription>{calculator.description}</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="space-y-4">
                    <div className="grid gap-1">
                      <h4 className="text-sm font-medium">What this calculator does:</h4>
                      <p className="text-sm text-muted-foreground">
                        {calculator.description} It helps you make informed decisions about education financing.
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <h4 className="text-sm font-medium">Difficulty level:</h4>
                      <div className="text-sm">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          calculator.complexity === 'beginner' ? 'bg-green-100 text-green-800' :
                          calculator.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {calculator.complexity.charAt(0).toUpperCase() + calculator.complexity.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  {calculator.status === 'active' ? (
                    <Link to={`/calculators/education/${calculator.id}`} className="w-full">
                      <Button className="w-full">Use Calculator</Button>
                    </Link>
                  ) : (
                    <Button disabled>Coming Soon</Button>
                  )}
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <p className="text-muted-foreground mb-6">
          {calculator.description}
        </p>
        {calculator.status === 'active' ? (
          <Link to={`/calculators/education/${calculator.id}`}>
            <Button>
              Use Calculator
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            Coming Soon
          </Button>
        )}
      </div>
    </div>
  );
};

export default EducationCalculatorsIndex;
