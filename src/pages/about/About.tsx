
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Calculator, Users, Shield, BookOpen, Briefcase, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">About Financial Insight Hub</h1>
            <p className="text-xl text-white/90 mb-6">
              Empowering you to make smarter financial decisions with practical tools and knowledge
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              We believe financial education should be accessible to everyone. Our mission is to provide free, easy-to-use 
              calculators and educational resources that help individuals make informed financial decisions at every stage of life.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-finance-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Accuracy & Transparency</h3>
              <p className="text-muted-foreground">
                Our calculators use industry-standard formulas and assumptions. We clearly explain our methodology 
                and are transparent about limitations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-finance-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Education First</h3>
              <p className="text-muted-foreground">
                We're focused on building financial literacy, not selling products. Our resources explain concepts
                in simple terms without financial jargon.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-finance-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Accessible to All</h3>
              <p className="text-muted-foreground">
                Financial tools should be available to everyone regardless of background or resources. We make complex 
                financial calculations simple and free.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-finance-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Practical Solutions</h3>
              <p className="text-muted-foreground">
                Our tools focus on real-world applications. We help you calculate mortgage payments, plan retirement 
                savings, and manage investments with confidence.
              </p>
            </div>
          </div>
        </div>
        
        {/* Team Section - Updated with Christopher's profile */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">Meet the Founder</h2>
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg mb-6">
              <AvatarImage src="/lovable-uploads/61f9246e-544a-4f54-a156-a5374baed0c1.png" alt="Christopher R McGuire" />
              <AvatarFallback>CRM</AvatarFallback>
            </Avatar>
            <a href="https://www.paguire.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            <h3 className="text-xl font-medium">Christopher R McGuire</h3>
            </a>
            <p className="text-sm text-finance-primary mb-2">
              
                Senior Vice President of Software Engineering at <a href="https://www.mesirow.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Mesirow</a>
            </p>
            <div className="mt-4 text-muted-foreground text-left">
              <p className="mb-3">
                A seasoned Senior Vice President of Software Engineering at Mesirow with over two decades in 
                financial services. An empathetic leader who thrives on innovation and user-centric design.
              </p>
              <p className="mb-3">
                Driven by a ceaseless passion to learn, he transforms challenges into growth opportunities. 
                A proud father and advocate for personal accountability and transparency in the workplace.
              </p>
            </div>
          </div>
        </div>
        
        {/* Why Use Our Calculators */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Use Our Calculators</h2>
          <div className="bg-white p-8 rounded-lg border">
            <ul className="space-y-4">
              <li className="flex items-start">
                <Calculator className="h-5 w-5 text-finance-primary mr-3 mt-1 flex-shrink-0" />
                <p><span className="font-medium">Comprehensive Tools:</span> From basic budgeting to advanced investment projections, our calculators cover a wide range of financial needs.</p>
              </li>
              <li className="flex items-start">
                <Shield className="h-5 w-5 text-finance-primary mr-3 mt-1 flex-shrink-0" />
                <p><span className="font-medium">Privacy Focused:</span> Your data never leaves your device. We respect your privacy and don't track your financial information.</p>
              </li>
              <li className="flex items-start">
                <Heart className="h-5 w-5 text-finance-primary mr-3 mt-1 flex-shrink-0" />
                <p><span className="font-medium">Free Forever:</span> All of our calculators and educational resources are completely free to use, with no hidden fees or premium tiers.</p>
              </li>
              <li className="flex items-start">
                <BookOpen className="h-5 w-5 text-finance-primary mr-3 mt-1 flex-shrink-0" />
                <p><span className="font-medium">Educational Resources:</span> Beyond calculations, we provide context and explanations to help you understand financial concepts.</p>
              </li>
            </ul>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-finance-primary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Start Your Financial Journey Today</h2>
            <p className="text-muted-foreground mb-6">
              Explore our calculators and resources to take control of your financial future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/calculators/investment">Investment Calculators</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/blog">Financial Articles</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
