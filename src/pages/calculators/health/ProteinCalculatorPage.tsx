
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProteinCalculatorPage = () => {
  const [weight, setWeight] = useState('70');
  const [heightCm, setHeightCm] = useState('175');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goalType, setGoalType] = useState('maintain');
  const [unit, setUnit] = useState('metric');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightLbs, setWeightLbs] = useState('154');
  const [bodyFatPercentage, setBodyFatPercentage] = useState('15');
  const [showResults, setShowResults] = useState(false);
  const [proteinNeeds, setProteinNeeds] = useState({
    minimum: 0,
    moderate: 0,
    high: 0,
    grams: {
      minimum: 0,
      moderate: 0,
      high: 0,
    }
  });
  
  const calculateProtein = () => {
    let weightKg = 0;
    
    if (unit === 'metric') {
      weightKg = parseFloat(weight);
    } else {
      weightKg = parseFloat(weightLbs) * 0.45359237;
    }
    
    // Basic protein calculations (g/kg of body weight)
    let minimumRatio = 0.8; // RDA minimum
    let moderateRatio = 1.6; // Average active person
    let highRatio = 2.2; // Athletic/muscle building
    
    // Adjust based on goals
    if (goalType === 'lose') {
      minimumRatio = 1.2;  // Higher protein for weight loss to preserve muscle
      moderateRatio = 1.8;
      highRatio = 2.4;
    } else if (goalType === 'gain') {
      minimumRatio = 1.6;  // Higher protein for muscle gain
      moderateRatio = 2.0;
      highRatio = 2.8;
    }
    
    // Adjust based on activity level
    if (activityLevel === 'sedentary') {
      minimumRatio *= 0.9;
      moderateRatio *= 0.9;
      highRatio *= 0.9;
    } else if (activityLevel === 'very_active') {
      minimumRatio *= 1.1;
      moderateRatio *= 1.1;
      highRatio *= 1.1;
    } else if (activityLevel === 'extremely_active') {
      minimumRatio *= 1.2;
      moderateRatio *= 1.2;
      highRatio *= 1.2;
    }
    
    // Calculate protein needs
    const minimum = Math.round(weightKg * minimumRatio * 10) / 10;
    const moderate = Math.round(weightKg * moderateRatio * 10) / 10;
    const high = Math.round(weightKg * highRatio * 10) / 10;
    
    setProteinNeeds({
      minimum: minimum,
      moderate: moderate,
      high: high,
      grams: {
        minimum: Math.round(minimum),
        moderate: Math.round(moderate),
        high: Math.round(high),
      }
    });
    
    setShowResults(true);
  };
  
  const resetCalculator = () => {
    setWeight('70');
    setHeightCm('175');
    setAge('30');
    setGender('male');
    setActivityLevel('moderate');
    setGoalType('maintain');
    setUnit('metric');
    setHeightFt('5');
    setHeightIn('9');
    setWeightLbs('154');
    setBodyFatPercentage('15');
    setShowResults(false);
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Protein Intake Calculator</h1>
          <p className="text-muted-foreground mb-8 text-center">
            Calculate your recommended daily protein intake based on your body metrics and goals.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Protein Calculator</CardTitle>
              <CardDescription>
                Fill in your details to determine your protein requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="metric" value={unit} onValueChange={setUnit}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metric">Metric (kg/cm)</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial (lb/ft)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metric" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="70"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        placeholder="175"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="imperial" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weightLbs">Weight (lbs)</Label>
                      <Input
                        id="weightLbs"
                        type="number"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(e.target.value)}
                        placeholder="154"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (ft & in)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          placeholder="5"
                        />
                        <Input
                          type="number"
                          value={heightIn}
                          onChange={(e) => setHeightIn(e.target.value)}
                          placeholder="9"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex">
                    <div className="flex items-center space-x-2 mr-4">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (athlete/physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Goal</Label>
                <Select value={goalType} onValueChange={setGoalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Build Muscle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button onClick={calculateProtein} className="flex-1">Calculate Protein Needs</Button>
                <Button variant="outline" onClick={resetCalculator} className="flex-1">Reset</Button>
              </div>
              
              {showResults && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Your Daily Protein Requirements</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="block mb-2">Protein Needs Range</Label>
                      <div className="bg-background p-4 rounded-md">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-sm text-muted-foreground">Minimum</div>
                            <div className="text-2xl font-bold">{proteinNeeds.grams.minimum}g</div>
                            <div className="text-xs text-muted-foreground">({proteinNeeds.minimum} g/kg)</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Moderate</div>
                            <div className="text-2xl font-bold">{proteinNeeds.grams.moderate}g</div>
                            <div className="text-xs text-muted-foreground">({proteinNeeds.moderate} g/kg)</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">High</div>
                            <div className="text-2xl font-bold">{proteinNeeds.grams.high}g</div>
                            <div className="text-xs text-muted-foreground">({proteinNeeds.high} g/kg)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-background p-4 rounded-md">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Recommendation Based on Your Goal
                      </h4>
                      {goalType === 'lose' && (
                        <p className="text-sm">For weight loss, we recommend the moderate to high range to preserve muscle mass while in a caloric deficit. Aim for {proteinNeeds.grams.moderate}g-{proteinNeeds.grams.high}g daily.</p>
                      )}
                      {goalType === 'maintain' && (
                        <p className="text-sm">For weight maintenance, the moderate range of {proteinNeeds.grams.moderate}g daily should be sufficient for most people.</p>
                      )}
                      {goalType === 'gain' && (
                        <p className="text-sm">For muscle building, aim for the higher end of the range ({proteinNeeds.grams.high}g daily) to support muscle protein synthesis and recovery.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Protein Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Protein is essential for building and repairing tissues, making enzymes and hormones, and supporting overall health. Your protein needs vary based on several factors:</p>
                
                <div className="space-y-2">
                  <h3 className="font-medium">General Guidelines:</h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Minimum: 0.8g per kg of body weight (RDA minimum)</li>
                    <li>Moderate: 1.2-1.8g per kg of body weight (active individuals)</li>
                    <li>High: 1.8-2.5g per kg of body weight (athletes, muscle building)</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Factors That Increase Protein Needs:</h3>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Intense physical training, especially resistance training</li>
                    <li>Weight loss diets (to preserve lean muscle mass)</li>
                    <li>Recovery from injury or surgery</li>
                    <li>Growth periods (adolescence, pregnancy)</li>
                    <li>Aging (to prevent sarcopenia)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProteinCalculatorPage;
