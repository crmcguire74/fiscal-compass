import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, PiggyBank, Home as HomeIcon, CreditCard, Search, ArrowRight, Book, CarFront } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CALCULATOR_CATEGORIES } from '@/lib/constants';
import Logo from '@/components/ui/logo';

const Home = () => {
  const navigate = useNavigate();

  // Featured calculators (a subset of all categories)
  const featuredCategories = [...CALCULATOR_CATEGORIES.slice(0, 5), {
    id: 'education',
    name: 'Education Planning',
    description: 'Plan for future education costs with savings strategies and loan management tools',
    icon: Book
  }];

  return <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-16 md:py-24">
        <div style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)'
      }} className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] bg-blue-950"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Changed items-center to items-start for mobile left-alignment */}
              <div className="flex flex-col items-start mb-6"> 
                <Logo variant="white" size="lg" />
                <h2 className="text-xl md:text-2xl font-bold font-heading mt-2">Financial Tools For Everyone</h2>
              </div>
              {/* Added whitespace-nowrap spans and block to second line for mobile alignment */}
              <h1 className="font-bold font-heading leading-tight animate-fade-in">
                <span className="whitespace-nowrap text-[1.7rem] md:text-4xl block">Free Financial Calculators </span>
                <span className="text-finance-accent text-yellow-500 text-[2.1rem] md:text-[2.8rem] whitespace-nowrap block">No Sign Up Required</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-md animate-fade-in" style={{
              animationDelay: '100ms'
            }}>
                Make better financial decisions with our suite of easy-to-use calculators that respect your privacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{
              animationDelay: '200ms'
            }}>
                <Button size="lg" onClick={() => navigate('/calculators')} className="bg-white text-finance-primary hover:bg-white hover:bg-yellow-500 hover:text-blue-950 hover:border-yellow-500 transition-all">
                  Try a Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/about')} className="border-white text-gray bg-blue-950 hover:bg-yellow-500 hover:text-blue-950 hover:border-yellow-500 transition-all">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center relative">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 shadow-xl w-full max-w-md">
                <div className="text-lg font-semibold mb-3">Compound Interest Calculator</div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs opacity-75 mb-1">Initial Investment</div>
                    <div className="bg-white/10 rounded p-2 text-sm">$10,000</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 mb-1">Monthly Contribution</div>
                    <div className="bg-white/10 rounded p-2 text-sm">$500</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 mb-1">Annual Interest Rate</div>
                    <div className="bg-white/10 rounded p-2 text-sm">7%</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 mb-1">Time Period</div>
                    <div className="bg-white/10 rounded p-2 text-sm">20 years</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75 mb-1">Final Balance</div>
                    <div className="bg-white/5 rounded p-2 text-lg font-bold text-finance-accent">$336,458</div>
                  </div>
                </div>
                <div className="mt-4 w-full h-24 bg-white/5 rounded flex items-end p-2">
                  <div className="flex-1 h-[20%] bg-white/30 rounded-t"></div>
                  <div className="flex-1 h-[40%] bg-white/30 rounded-t"></div>
                  <div className="flex-1 h-[60%] bg-white/30 rounded-t"></div>
                  <div className="flex-1 h-[80%] bg-white/30 rounded-t"></div>
                  <div className="flex-1 h-full bg-finance-accent rounded-t"></div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-finance-accent/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-finance-secondary/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-heading text-finance-primary mb-4">Why Use Our Calculators?</h2>
            <p className="text-lg text-muted-foreground">
              Tools designed with your financial journey and privacy in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Registration Required</h3>
              <p className="text-muted-foreground">
                Use all our calculators without creating an account or sharing any personal information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-finance-secondary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Persistence</h3>
              <p className="text-muted-foreground">
                Save your calculator inputs locally in your browser to easily revisit and update your calculations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-finance-accent/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-finance-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Results</h3>
              <p className="text-muted-foreground">
                Interactive charts and graphs help you visualize and understand your financial projections.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Calculator Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold font-heading text-finance-primary mb-4">Explore Our Calculators</h2>
            <p className="text-lg text-muted-foreground">
              From retirement planning to mortgage payments, we have tools for all your financial decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map(category => <div key={category.id} className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-finance-primary/10 flex items-center justify-center mb-4">
                    {category.id === 'home-mortgage' && <HomeIcon className="h-6 w-6 text-finance-primary" />}
                    {category.id === 'auto' && <CarFront className="h-6 w-6 text-finance-primary" />}
                    {category.id === 'retirement' && <PiggyBank className="h-6 w-6 text-finance-primary" />}
                    {category.id === 'investment' && <TrendingUp className="h-6 w-6 text-finance-primary" />}
                    {category.id === 'debt' && <CreditCard className="h-6 w-6 text-finance-primary" />}
                    {category.id === 'tax' && <Calculator className="h-6 w-6 text-finance-primary" />}
                    {category.id === 'education' && <Book className="h-6 w-6 text-finance-primary" />}
                    {category.id === 'insurance' && <Search className="h-6 w-6 text-finance-primary" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <Button variant="outline" className="group-hover:bg-finance-primary group-hover:text-white transition-colors" onClick={() => navigate(`/calculators/${category.id}`)}>
                    Explore Calculators
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>)}
          </div>
          
          <div className="text-center mt-10">
            <Button variant="default" size="lg" onClick={() => navigate('/calculators')} className="bg-finance-primary hover:bg-finance-primary/90">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonial/Security Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <div className="flex items-center mb-6">
                  {[1, 2, 3, 4, 5].map(star => <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>)}
                </div>
                <blockquote className="text-xl font-medium italic text-gray-900 mb-6">
                  "I've been using these calculators for my retirement planning and they're so much easier than other tools I've tried. No need to create an account or worry about my data being collected."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-finance-primary text-white flex items-center justify-center font-bold">
                    JD
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold">Jamie D.</p>
                    <p className="text-xs text-muted-foreground">Early Retirement Planner</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-4">Your Data Stays Private</h3>
                <p className="text-muted-foreground mb-6">
                  We believe your financial information should remain yours. That's why our calculators:
                </p>
                <ul className="space-y-3">
                  {["Never require email or personal information", "Store data locally in your browser only", "Don't track or analyze your financial inputs", "Allow completely anonymous usage", "Give you full control to delete saved data"].map((item, index) => <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{item}</span>
                    </li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-finance-primary text-white py-16 bg-blue-950">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">Ready to Plan Your Financial Future?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            No registration, no email required. Just free, powerful calculators to help you make informed decisions.
          </p>
          <Button size="lg" onClick={() => navigate('/calculators/investment/compound-interest')} className="bg-white text-finance-primary hover:bg-gray-100">
            Try Our Most Popular Calculator
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>;
};
export default Home;
