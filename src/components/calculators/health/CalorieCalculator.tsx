
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group" // Added ToggleGroup
import { Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Conversion constants (same as BodyFatCalculator)
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;
const CM_TO_IN = 0.393701;
const IN_TO_CM = 1 / CM_TO_IN;

const CalorieCalculator = () => {
  const [activeTab, setActiveTab] = useState('harris');
  const [gender, setGender] = useState('female');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric'); // Added unit system state
  const [results, setResults] = useState<null | {
    bmr: number;
    maintenance: number;
    mildLoss: number;
    moderateLoss: number;
    extremeLoss: number;
    mildGain: number;
    moderateGain: number;
  }>(null);

  const calculateCalories = () => {
    if (!age || !weight || !height) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    const ageNum = parseInt(age);
    // Convert inputs to metric for calculation
    const weightNum = unitSystem === 'imperial' ? parseFloat(weight) * LBS_TO_KG : parseFloat(weight);
    const heightNum = unitSystem === 'imperial' ? parseFloat(height) * IN_TO_CM : parseFloat(height);

    if (ageNum < 15 || ageNum > 80) {
      toast({
        title: "Invalid age",
        description: "Please enter an age between 15 and 80.",
        variant: "destructive",
      });
      return;
    }

    // Calculate BMR based on formula
    let bmr = 0;

    if (activeTab === 'harris') {
      // Harris-Benedict Equation
      if (gender === 'male') {
        bmr = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
      } else {
        bmr = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
      }
    } else {
      // Mifflin-St Jeor Equation
      if (gender === 'male') {
        bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
      } else {
        bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
      }
    }

    // Calculate maintenance calories based on activity level
    let activityMultiplier = 1.2; // Sedentary
    if (activityLevel === 'light') {
      activityMultiplier = 1.375;
    } else if (activityLevel === 'moderate') {
      activityMultiplier = 1.55;
    } else if (activityLevel === 'active') {
      activityMultiplier = 1.725;
    } else if (activityLevel === 'veryActive') {
      activityMultiplier = 1.9;
    }

    const maintenance = Math.round(bmr * activityMultiplier);

    setResults({
      bmr: Math.round(bmr),
      maintenance,
      mildLoss: Math.round(maintenance - 250),
      moderateLoss: Math.round(maintenance - 500),
      extremeLoss: Math.round(maintenance - 1000),
      mildGain: Math.round(maintenance + 250),
      moderateGain: Math.round(maintenance + 500),
    });
  };

  const resetCalculator = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setActivityLevel('sedentary');
    setResults(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Daily Calorie Calculator</CardTitle>
        <CardDescription>
          Estimate your daily calorie needs based on your physical characteristics and activity level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="harris">Harris-Benedict</TabsTrigger>
            <TabsTrigger value="mifflin">Mifflin-St Jeor</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
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

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-1/2">
                <Label htmlFor="age">Age (years)</Label>
                <Input 
                  id="age"
                  type="number" 
                  min="15"
                  max="80"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <Label htmlFor="weight">Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</Label>
                <Input 
                  id="weight"
                  type="number" 
                  min="20"
                  max="300"
                  step="0.1"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <Label htmlFor="height">Height ({unitSystem === 'metric' ? 'cm' : 'in'})</Label>
                <Input 
                  id="height"
                  type="number" 
                  min="100"
                  max="250"
                  placeholder="Enter height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="activity">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="veryActive">Very Active (hard exercise daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={resetCalculator}>
                Reset
              </Button>
              <Button onClick={calculateCalories}>
                Calculate
              </Button>
            </div>
          </div>
        </Tabs>
        
        {results && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Your Estimated Calorie Needs</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Basal Metabolic Rate (BMR)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{results.bmr} calories/day</p>
                    <p className="text-sm text-muted-foreground">Calories your body needs at complete rest</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Maintenance Calories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{results.maintenance} calories/day</p>
                    <p className="text-sm text-muted-foreground">Calories to maintain your current weight</p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Weight Loss Plans</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Card className="bg-green-50">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Mild Weight Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold">{results.mildLoss} calories/day</p>
                      <p className="text-xs text-muted-foreground">~0.25 kg/week</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Moderate Weight Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold">{results.moderateLoss} calories/day</p>
                      <p className="text-xs text-muted-foreground">~0.5 kg/week</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Extreme Weight Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold">{results.extremeLoss} calories/day</p>
                      <p className="text-xs text-muted-foreground">~1 kg/week</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Weight Gain Plans</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card className="bg-amber-50">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Mild Weight Gain</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold">{results.mildGain} calories/day</p>
                      <p className="text-xs text-muted-foreground">~0.25 kg/week</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Moderate Weight Gain</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold">{results.moderateGain} calories/day</p>
                      <p className="text-xs text-muted-foreground">~0.5 kg/week</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalorieCalculator;
