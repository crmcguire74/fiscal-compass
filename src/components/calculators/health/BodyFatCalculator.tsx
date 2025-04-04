
import { useState, useEffect } from 'react';
import { Activity, Save, Info } from 'lucide-react';
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group" // Added ToggleGroup
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'body-fat-calculator';

// Default values
const DEFAULTS = {
  gender: 'male',
  age: 30,
  weight: 70, // kg
  height: 170, // cm
  neck: 36, // cm
  waist: 85, // cm
  hip: 90, // cm (only for females)
  method: 'navy',
  unitSystem: 'metric', // Added unit system default
};

// Conversion constants
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;
const CM_TO_IN = 0.393701;
const IN_TO_CM = 1 / CM_TO_IN;

const BodyFatCalculator = () => {
  const { toast } = useToast();
  
  const [gender, setGender] = useState<'male' | 'female'>(DEFAULTS.gender as 'male' | 'female');
  const [age, setAge] = useState(DEFAULTS.age);
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [height, setHeight] = useState(DEFAULTS.height);
  const [neck, setNeck] = useState(DEFAULTS.neck);
  const [waist, setWaist] = useState(DEFAULTS.waist);
  const [hip, setHip] = useState(DEFAULTS.hip);
  const [method, setMethod] = useState<'navy' | 'bmi'>(DEFAULTS.method as 'navy' | 'bmi');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>(DEFAULTS.unitSystem as 'metric' | 'imperial'); // Added unit system state
  
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [leanMass, setLeanMass] = useState<number | null>(null);
  const [fatMass, setFatMass] = useState<number | null>(null);
  const [dataStored, setDataStored] = useState(false);

  // Load saved data on initial render
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setGender(savedData.gender || DEFAULTS.gender);
      setAge(savedData.age || DEFAULTS.age);
      setWeight(savedData.weight || DEFAULTS.weight);
      setHeight(savedData.height || DEFAULTS.height);
      setNeck(savedData.neck || DEFAULTS.neck);
      setWaist(savedData.waist || DEFAULTS.waist);
      setHip(savedData.hip || DEFAULTS.hip);
      setMethod(savedData.method || DEFAULTS.method);
      setUnitSystem(savedData.unitSystem || DEFAULTS.unitSystem); // Load unit system
      setDataStored(true);
    }
  }, []);

  // Recalculate when inputs or unit system change
  useEffect(() => {
    calculateBodyFat();
  }, [gender, age, weight, height, neck, waist, hip, method, unitSystem]); // Added unitSystem dependency
  
  // Calculate body fat percentage
  const calculateBodyFat = () => {
    // Convert inputs to metric if necessary
    const weightInKg = unitSystem === 'imperial' ? weight * LBS_TO_KG : weight;
    const heightInCm = unitSystem === 'imperial' ? height * IN_TO_CM : height;
    const neckInCm = unitSystem === 'imperial' ? neck * IN_TO_CM : neck;
    const waistInCm = unitSystem === 'imperial' ? waist * IN_TO_CM : waist;
    const hipInCm = unitSystem === 'imperial' ? hip * IN_TO_CM : hip;

    // Validate converted inputs
    if (heightInCm <= 0 || weightInKg <= 0 || (method === 'navy' && (neckInCm <= 0 || waistInCm <= 0 || (gender === 'female' && hipInCm <= 0)))) {
      setBodyFat(null);
      setCategory('');
      setLeanMass(null);
      setFatMass(null);
      return;
    }

    let bodyFatPercentage: number;
    
    if (method === 'navy') {
      // Navy method formula (uses metric units)
      if (gender === 'male') {
        if (waistInCm <= neckInCm) { // Avoid log10(non-positive)
           setBodyFat(null); // Or set to a default low value?
           return;
        }
        const logWaistNeck = Math.log10(waistInCm - neckInCm);
        const logHeight = Math.log10(heightInCm);
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;
      } else {
         if (waistInCm + hipInCm <= neckInCm) { // Avoid log10(non-positive)
           setBodyFat(null);
           return;
         }
        const logMeasurement = Math.log10(waistInCm + hipInCm - neckInCm);
        const logHeight = Math.log10(heightInCm);
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * logMeasurement + 0.22100 * logHeight) - 450;
      }
    } else {
      // BMI method (uses metric units)
      const bmi = weightInKg / ((heightInCm / 100) * (heightInCm / 100));
      if (gender === 'male') {
        bodyFatPercentage = (1.20 * bmi) + (0.23 * age) - 16.2;
      } else {
        bodyFatPercentage = (1.20 * bmi) + (0.23 * age) - 5.4;
      }
    }
    
    // Ensure the result is reasonable (between 3-50%)
    bodyFatPercentage = Math.max(3, Math.min(50, bodyFatPercentage));
    
    setBodyFat(Math.round(bodyFatPercentage * 10) / 10);
    setCategory(getBodyFatCategory(gender, bodyFatPercentage));
    
    // Calculate lean mass and fat mass using weight in KG
    const fatMassCalc = (bodyFatPercentage / 100) * weightInKg;
    const leanMassCalc = weightInKg - fatMassCalc;
    
    // Display mass in the selected unit system
    setFatMass(unitSystem === 'imperial' ? Math.round(fatMassCalc * KG_TO_LBS * 10) / 10 : Math.round(fatMassCalc * 10) / 10);
    setLeanMass(unitSystem === 'imperial' ? Math.round(leanMassCalc * KG_TO_LBS * 10) / 10 : Math.round(leanMassCalc * 10) / 10);
  };
  
  // Get body fat category
  const getBodyFatCategory = (gender: 'male' | 'female', bodyFatPercentage: number): string => {
    if (gender === 'male') {
      if (bodyFatPercentage < 6) return 'Essential Fat';
      if (bodyFatPercentage >= 6 && bodyFatPercentage < 14) return 'Athletic';
      if (bodyFatPercentage >= 14 && bodyFatPercentage < 18) return 'Fitness';
      if (bodyFatPercentage >= 18 && bodyFatPercentage < 25) return 'Average';
      return 'Obese';
    } else {
      if (bodyFatPercentage < 14) return 'Essential Fat';
      if (bodyFatPercentage >= 14 && bodyFatPercentage < 21) return 'Athletic';
      if (bodyFatPercentage >= 21 && bodyFatPercentage < 25) return 'Fitness';
      if (bodyFatPercentage >= 25 && bodyFatPercentage < 32) return 'Average';
      return 'Obese';
    }
  };
  
  // Get category color for display
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Essential Fat':
        return 'text-blue-600';
      case 'Athletic':
        return 'text-green-600';
      case 'Fitness':
        return 'text-emerald-600';
      case 'Average':
        return 'text-yellow-600';
      case 'Obese':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Save calculator data
  const handleSaveData = () => {
    const dataToSave = {
      gender,
      age,
      weight,
      height,
      neck,
      waist,
      hip,
      method,
      unitSystem, // Save unit system
      timestamp: Date.now()
    };
    
    saveCalculatorData(CALCULATOR_ID, dataToSave);
    setDataStored(true);
    
    toast({
      title: "Data Saved",
      description: "Your body fat calculator data has been saved locally.",
    });
  };
  
  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Body Fat Percentage Calculator
            </CardTitle>
            <CardDescription className="text-gray-100 mt-2">
              Estimate your body fat percentage and lean mass using different methods
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
             {/* Unit System Toggle */}
             <div className="space-y-2">
               <Label>Unit System</Label>
               <ToggleGroup 
                 type="single" 
                 defaultValue={unitSystem} 
                 onValueChange={(value) => { if (value) setUnitSystem(value as 'metric' | 'imperial')}}
                 className="grid grid-cols-2"
               >
                 <ToggleGroupItem value="metric" aria-label="Metric units">
                   Metric (kg, cm)
                 </ToggleGroupItem>
                 <ToggleGroupItem value="imperial" aria-label="Imperial units">
                   Imperial (lbs, in)
                 </ToggleGroupItem>
               </ToggleGroup>
             </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Calculation Method</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80 text-xs">Navy method is more accurate and uses body circumference measurements. BMI method is simpler but less accurate.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Tabs 
                defaultValue={method} 
                className="w-full" 
                onValueChange={(value) => setMethod(value as 'navy' | 'bmi')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="navy">Navy Method</TabsTrigger>
                  <TabsTrigger value="bmi">BMI Method</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-4">
              <Label className="text-base font-medium">Gender</Label>
              <RadioGroup 
                value={gender} 
                onValueChange={(value) => setGender(value as 'male' | 'female')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={15}
                  max={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min={30}
                  max={250}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height ({unitSystem === 'metric' ? 'cm' : 'in'})</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={100}
                max={250}
              />
            </div>
            
            {method === 'navy' && (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="neck">Neck Circumference ({unitSystem === 'metric' ? 'cm' : 'in'})</Label>
                  <Input
                    id="neck"
                    type="number"
                    value={neck}
                    onChange={(e) => setNeck(Number(e.target.value))}
                    min={20}
                    max={80}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waist">Waist Circumference ({unitSystem === 'metric' ? 'cm' : 'in'})</Label>
                  <Input
                    id="waist"
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(Number(e.target.value))}
                    min={40}
                    max={200}
                  />
                </div>
                
                {gender === 'female' && (
                  <div className="space-y-2">
                    <Label htmlFor="hip">Hip Circumference ({unitSystem === 'metric' ? 'cm' : 'in'})</Label>
                    <Input
                      id="hip"
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(Number(e.target.value))}
                      min={50}
                      max={200}
                    />
                  </div>
                )}
              </div>
            )}
            
            <Button 
              onClick={calculateBodyFat}
              className="w-full mt-6"
            >
              Calculate Body Fat Percentage
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
            {bodyFat !== null && (
              <div className="calculator-panel border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-6">Your Body Composition Results</h3>
                
                <div className="text-center space-y-2 mb-8">
                  <div className="text-5xl font-bold text-finance-primary">{bodyFat}%</div>
                  <div className={`text-xl font-medium ${getCategoryColor(category)}`}>{category}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Fat Mass</p>
                    <p className="text-2xl font-semibold">{fatMass} {unitSystem === 'metric' ? 'kg' : 'lbs'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Lean Mass</p>
                    <p className="text-2xl font-semibold">{leanMass} {unitSystem === 'metric' ? 'kg' : 'lbs'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border text-sm">
                  <h4 className="font-medium mb-2">What does this mean?</h4>
                  <p className="text-muted-foreground mb-3">
                    Body fat percentage is the amount of fat mass in relation to your total body weight. 
                    It's considered a more accurate indicator of fitness than BMI because it distinguishes 
                    between fat and lean tissue.
                  </p>
                  <p className="text-muted-foreground">
                    The {method === 'navy' ? 'Navy' : 'BMI'} method provides an estimate, but for the most accurate 
                    measurement, consider professional methods like DEXA scans or hydrostatic weighing.
                  </p>
                </div>
              </div>
            )}
            
            {!bodyFat && (
              <div className="calculator-panel border rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-medium mb-4">Body Fat Percentage Categories</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Men</TableHead>
                      <TableHead>Women</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-blue-600">Essential Fat</TableCell>
                      <TableCell>2-5%</TableCell>
                      <TableCell>10-13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-green-600">Athletic</TableCell>
                      <TableCell>6-13%</TableCell>
                      <TableCell>14-20%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-emerald-600">Fitness</TableCell>
                      <TableCell>14-17%</TableCell>
                      <TableCell>21-24%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-yellow-600">Average</TableCell>
                      <TableCell>18-24%</TableCell>
                      <TableCell>25-31%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-600">Obese</TableCell>
                      <TableCell>25% or more</TableCell>
                      <TableCell>32% or more</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 p-6">
        <div className="w-full text-sm text-muted-foreground">
          <h3 className="font-medium text-foreground mb-2">About Body Fat Percentage</h3>
          <p className="mb-2">
            Body fat percentage is a key indicator of fitness and health. Some fat is essential for bodily functions, 
            but excess fat can lead to health problems. Body composition is influenced by diet, exercise, age, and genetics.
          </p>
          <p>
            For most people, gradual improvements through consistent exercise and a balanced diet are more 
            sustainable than rapid fat loss. Consult with a healthcare professional before making significant 
            changes to your diet or exercise routine.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BodyFatCalculator;
