
import { useState, useEffect } from 'react';
import { Scale, Info, Save } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'bmi-calculator';

// Default values
const BMI_DEFAULTS = {
  height: 170, // cm
  weight: 70, // kg
  heightFeet: 5,
  heightInches: 7,
  weightLbs: 154,
  system: 'metric',
};

const BmiCalculator = () => {
  const { toast } = useToast();
  
  // Imperial units
  const [heightFeet, setHeightFeet] = useState(BMI_DEFAULTS.heightFeet);
  const [heightInches, setHeightInches] = useState(BMI_DEFAULTS.heightInches);
  const [weightLbs, setWeightLbs] = useState(BMI_DEFAULTS.weightLbs);
  
  // Metric units
  const [height, setHeight] = useState(BMI_DEFAULTS.height);
  const [weight, setWeight] = useState(BMI_DEFAULTS.weight);
  
  // Shared state
  const [system, setSystem] = useState<'metric' | 'imperial'>(BMI_DEFAULTS.system as 'metric' | 'imperial');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [dataStored, setDataStored] = useState(false);

  // Load saved data on initial render
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setHeight(savedData.height || BMI_DEFAULTS.height);
      setWeight(savedData.weight || BMI_DEFAULTS.weight);
      setHeightFeet(savedData.heightFeet || BMI_DEFAULTS.heightFeet);
      setHeightInches(savedData.heightInches || BMI_DEFAULTS.heightInches);
      setWeightLbs(savedData.weightLbs || BMI_DEFAULTS.weightLbs);
      setSystem(savedData.system || BMI_DEFAULTS.system);
      setDataStored(true);
      
      // Calculate BMI with saved data
      calculateBmi();
    } else {
      // Calculate BMI with default data
      calculateBmi();
    }
  }, []);
  
  // Calculate BMI
  const calculateBmi = () => {
    let calculatedBmi: number;
    
    if (system === 'metric') {
      // Metric formula: weight (kg) / (height (m))²
      const heightInMeters = height / 100;
      calculatedBmi = weight / (heightInMeters * heightInMeters);
    } else {
      // Imperial formula: (weight (lbs) * 703) / (height (inches))²
      const totalHeightInches = (heightFeet * 12) + heightInches;
      calculatedBmi = (weightLbs * 703) / (totalHeightInches * totalHeightInches);
    }
    
    setBmi(Math.round(calculatedBmi * 10) / 10);
    setBmiCategory(getBmiCategory(calculatedBmi));
  };
  
  // Get BMI category
  const getBmiCategory = (bmiValue: number): string => {
    if (bmiValue < 18.5) {
      return 'Underweight';
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      return 'Normal weight';
    } else if (bmiValue >= 25 && bmiValue < 30) {
      return 'Overweight';
    } else {
      return 'Obesity';
    }
  };
  
  // Get category color for display
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Underweight':
        return 'text-blue-600';
      case 'Normal weight':
        return 'text-green-600';
      case 'Overweight':
        return 'text-orange-600';
      case 'Obesity':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Save calculator data
  const handleSaveData = () => {
    const dataToSave = {
      height,
      weight,
      heightFeet,
      heightInches,
      weightLbs,
      system,
      timestamp: Date.now()
    };
    
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);
    
    toast({
      title: "Data Saved",
      description: "Your BMI calculator data has been saved locally.",
    });
  };
  
  // Convert between measurement systems
  const handleSystemChange = (newSystem: 'metric' | 'imperial') => {
    setSystem(newSystem);
    
    if (newSystem === 'metric' && system === 'imperial') {
      // Convert imperial to metric
      const totalHeightInches = (heightFeet * 12) + heightInches;
      const newHeightCm = Math.round(totalHeightInches * 2.54);
      const newWeightKg = Math.round(weightLbs / 2.20462);
      
      setHeight(newHeightCm);
      setWeight(newWeightKg);
    } else if (newSystem === 'imperial' && system === 'metric') {
      // Convert metric to imperial
      const totalHeightInches = Math.round(height / 2.54);
      const newHeightFeet = Math.floor(totalHeightInches / 12);
      const newHeightInches = totalHeightInches % 12;
      const newWeightLbs = Math.round(weight * 2.20462);
      
      setHeightFeet(newHeightFeet);
      setHeightInches(newHeightInches);
      setWeightLbs(newWeightLbs);
    }
    
    // Recalculate BMI after system change and state updates
    setTimeout(calculateBmi, 0);
  };
  
  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Scale className="h-6 w-6" />
              BMI Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Calculate your Body Mass Index (BMI) to assess your weight relative to your height
            </CardDescription>
          </div>
          {dataStored && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              Data Saved Locally
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Measurement System</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">Choose between metric (cm/kg) or imperial (ft/in/lbs) measurements.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Tabs 
                defaultValue={system} 
                className="w-full" 
                onValueChange={(value) => handleSystemChange(value as 'metric' | 'imperial')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metric">Metric (cm/kg)</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial (ft/in/lbs)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metric" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min={50}
                      max={250}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      min={10}
                      max={500}
                      className="w-full"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="imperial" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="height-imperial">Height</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="height-feet" className="text-xs text-muted-foreground">Feet</Label>
                        <Input
                          id="height-feet"
                          type="number"
                          value={heightFeet}
                          onChange={(e) => setHeightFeet(Number(e.target.value))}
                          min={1}
                          max={8}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height-inches" className="text-xs text-muted-foreground">Inches</Label>
                        <Input
                          id="height-inches"
                          type="number"
                          value={heightInches}
                          onChange={(e) => setHeightInches(Number(e.target.value))}
                          min={0}
                          max={11}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                    <Input
                      id="weight-lbs"
                      type="number"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Number(e.target.value))}
                      min={20}
                      max={1000}
                      className="w-full"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <Button 
              onClick={calculateBmi}
              className="w-full mt-6"
            >
              Calculate BMI
            </Button>
            
            <div className="pt-2 pb-4">
              <Button 
                className="w-full text-white font-medium" 
                onClick={handleSaveData}
                variant="outline"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Data Locally
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Data is saved in your browser only. No information is sent to our servers.
              </p>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            {bmi !== null && (
              <div className="calculator-panel border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-6">Your BMI Results</h3>
                
                <div className="text-center space-y-2 mb-8">
                  <div className="text-5xl font-bold text-finance-primary">{bmi}</div>
                  <div className={`text-xl font-medium ${getCategoryColor(bmiCategory)}`}>{bmiCategory}</div>
                </div>
                
                <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden mb-6">
                  <div className="absolute inset-0 flex">
                    <div className="bg-blue-500 flex-1" title="Underweight"></div>
                    <div className="bg-green-500 flex-1" title="Normal weight"></div>
                    <div className="bg-orange-500 flex-1" title="Overweight"></div>
                    <div className="bg-red-500 flex-1" title="Obesity"></div>
                  </div>
                  
                  <div 
                    className="absolute top-0 h-full w-1 bg-black" 
                    style={{ 
                      left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%`,
                      transform: 'translateX(-50%)'
                    }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-4 text-center text-xs mb-8">
                  <div className="text-blue-600">
                    <p className="font-medium">Underweight</p>
                    <p>Below 18.5</p>
                  </div>
                  <div className="text-green-600">
                    <p className="font-medium">Normal</p>
                    <p>18.5 - 24.9</p>
                  </div>
                  <div className="text-orange-600">
                    <p className="font-medium">Overweight</p>
                    <p>25 - 29.9</p>
                  </div>
                  <div className="text-red-600">
                    <p className="font-medium">Obesity</p>
                    <p>30 & Above</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border text-sm">
                  <h4 className="font-medium mb-2">What does this mean?</h4>
                  <p className="text-muted-foreground mb-3">
                    BMI is a screening tool that can indicate whether you may be underweight, at a healthy weight, overweight, or have obesity.
                  </p>
                  <p className="text-muted-foreground">
                    BMI is not a diagnostic tool. Factors such as muscle mass, body composition, age, and sex can influence BMI results. Consult a healthcare provider for a complete health assessment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 p-6">
        <div className="w-full text-sm text-muted-foreground">
          <h3 className="font-medium text-foreground mb-2">About BMI</h3>
          <p className="mb-2">
            Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women. 
            It provides a quick assessment of whether your weight might be putting you at risk for health problems.
          </p>
          <p>
            Remember that BMI is just one factor in determining health. Other factors like waist circumference, blood pressure, 
            cholesterol levels, and blood sugar levels should be considered for a complete health assessment.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BmiCalculator;
