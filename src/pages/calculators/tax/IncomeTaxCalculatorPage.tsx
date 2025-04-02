
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';

const IncomeTaxCalculatorPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Show a toast notification and redirect to the NotFound page
    toast({
      title: "Calculator Coming Soon",
      description: "Our Income Tax Calculator is still under development. Check back soon!",
      variant: "default"
    });
    
    // Redirect after 1.5 seconds
    const timer = setTimeout(() => {
      navigate('/calculators/tax');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    </Layout>
  );
};

export default IncomeTaxCalculatorPage;
