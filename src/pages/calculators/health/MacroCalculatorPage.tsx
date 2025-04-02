
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Salad, Carrot, Beef, Scale } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const MacroCalculatorPage = () => {
  // User inputs
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(170); // cm
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  
  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    return Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);
  };
  
  // Calculate calorie targets based on goal
  const calculateCalories = () => {
    const tdee = calculateTDEE();
    const goalAdjustments = {
      lose: tdee - 500,
      maintain: tdee,
      gain: tdee + 500
    };
    
    return goalAdjustments[goal as keyof typeof goalAdjustments];
  };
  
  // Calculate macros based on target calories
  const calculateMacros = () => {
    const calories = calculateCalories();
    let proteinPercentage, carbPercentage, fatPercentage;
    
    // Different macro ratios based on goal
    if (goal === 'lose') {
      proteinPercentage = 0.40; // 40%
      carbPercentage = 0.30; // 30%
      fatPercentage = 0.30; // 30%
    } else if (goal === 'maintain') {
      proteinPercentage = 0.30; // 30%
      carbPercentage = 0.40; // 40%
      fatPercentage = 0.30; // 30%
    } else { // gain
      proteinPercentage = 0.30; // 30%
      carbPercentage = 0.45; // 45%
      fatPercentage = 0.25; // 25%
    }
    
    // 1g protein = 4 calories, 1g carb = 4 calories, 1g fat = 9 calories
    const proteinGrams = Math.round((calories * proteinPercentage) / 4);
    const carbGrams = Math.round((calories * carbPercentage) / 4);
    const fatGrams = Math.round((calories * fatPercentage) / 9);
    
    return {
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      calories
    };
  };
  
  const macros = calculateMacros();
  
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
              <Link to="/calculators/health" className="hover:text-white">Health</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Macro Calculator</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Macronutrient Calculator</h1>
            <p className="text-xl text-white/90">
              Determine your ideal protein, carbs, and fat intake based on your goals
            </p>
          </div>
        </div>
      </div>
      
      {/* Calculator Section */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <Card className="p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="goals">Goals & Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <RadioGroup
                        id="gender"
                        value={gender}
                        onValueChange={setGender}
                        className="flex gap-4 mt-2"
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
                    
                    <div>
                      <Label htmlFor="age">Age (years)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider 
                          id="age"
                          value={[age]} 
                          onValueChange={(value) => setAge(value[0])}
                          min={18}
                          max={80}
                          step={1}
                          className="flex-1"
                        />
                        <Input 
                          type="number" 
                          value={age} 
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider 
                          id="weight"
                          value={[weight]} 
                          onValueChange={(value) => setWeight(value[0])}
                          min={40}
                          max={150}
                          step={1}
                          className="flex-1"
                        />
                        <Input 
                          type="number" 
                          value={weight} 
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider 
                          id="height"
                          value={[height]} 
                          onValueChange={(value) => setHeight(value[0])}
                          min={140}
                          max={220}
                          step={1}
                          className="flex-1"
                        />
                        <Input 
                          type="number" 
                          value={height} 
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="goals" className="space-y-6">
                  <div>
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroup
                          id="activityLevel"
                          value={activityLevel}
                          onValueChange={setActivityLevel}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sedentary" id="sedentary" />
                            <Label htmlFor="sedentary" className="text-sm font-medium">Sedentary (little or no exercise)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light" className="text-sm font-medium">Light (exercise 1-3 days/week)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="moderate" id="moderate" />
                            <Label htmlFor="moderate" className="text-sm font-medium">Moderate (exercise 3-5 days/week)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="active" id="active" />
                            <Label htmlFor="active" className="text-sm font-medium">Active (exercise 6-7 days/week)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="veryActive" id="veryActive" />
                            <Label htmlFor="veryActive" className="text-sm font-medium">Very Active (hard exercise daily)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="goal">Goal</Label>
                    <RadioGroup
                      id="goal"
                      value={goal}
                      onValueChange={setGoal}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lose" id="lose" />
                        <Label htmlFor="lose" className="text-sm font-medium">Lose Weight</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maintain" id="maintain" />
                        <Label htmlFor="maintain" className="text-sm font-medium">Maintain Weight</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gain" id="gain" />
                        <Label htmlFor="gain" className="text-sm font-medium">Gain Weight/Muscle</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
            
            <div className="mt-6">
              <Card className="p-6 bg-blue-50/50">
                <h3 className="text-lg font-medium mb-4">How Macros Work</h3>
                <p className="text-muted-foreground mb-4">
                  Macronutrients (macros) are the three main nutrients your body needs in large amounts:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Beef className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Protein (4 calories per gram)</p>
                      <p className="text-sm text-muted-foreground">Essential for building and repairing muscle tissue</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Carrot className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Carbohydrates (4 calories per gram)</p>
                      <p className="text-sm text-muted-foreground">Your body's preferred energy source</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Salad className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Fat (9 calories per gram)</p>
                      <p className="text-sm text-muted-foreground">Important for hormone production and nutrient absorption</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <Card className="p-6 border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Your Results</h3>
                <Scale className="h-5 w-5 text-finance-primary" />
              </div>
              
              <div className="space-y-6">
                <div className="p-5 bg-finance-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Daily Calorie Target</p>
                  <p className="text-3xl font-bold text-finance-primary">{macros.calories} calories</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on your {goal === 'lose' ? 'weight loss' : goal === 'gain' ? 'weight gain' : 'maintenance'} goal</p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Recommended Daily Macros</h4>
                  
                  <div className="p-4 bg-red-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Beef className="h-4 w-4 text-red-500" /> Protein
                      </p>
                      <p className="text-sm text-muted-foreground">{Math.round(macros.protein * 4)} calories</p>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{macros.protein}g</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Carrot className="h-4 w-4 text-orange-500" /> Carbs
                      </p>
                      <p className="text-sm text-muted-foreground">{Math.round(macros.carbs * 4)} calories</p>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{macros.carbs}g</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Salad className="h-4 w-4 text-green-500" /> Fat
                      </p>
                      <p className="text-sm text-muted-foreground">{Math.round(macros.fat * 9)} calories</p>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{macros.fat}g</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-muted-foreground">
                  <p className="mb-2">Macro ratio based on your goals:</p>
                  <div className="flex gap-2">
                    <div className="h-2 bg-red-500 rounded-full" style={{ width: `${goal === 'lose' ? 40 : 30}%` }}></div>
                    <div className="h-2 bg-orange-500 rounded-full" style={{ width: `${goal === 'lose' ? 30 : goal === 'maintain' ? 40 : 45}%` }}></div>
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: `${goal === 'gain' ? 25 : 30}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span>Protein {goal === 'lose' ? '40%' : '30%'}</span>
                    <span>Carbs {goal === 'lose' ? '30%' : goal === 'maintain' ? '40%' : '45%'}</span>
                    <span>Fat {goal === 'gain' ? '25%' : '30%'}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/calculators/health">
                  <Button variant="outline" className="w-full">
                    Explore More Health Calculators
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Explanation Section */}
      <div className="bg-white py-12 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Adjusting Your Macros</h2>
            <div className="bg-white rounded-lg p-6 border space-y-4">
              <p>
                The recommended macronutrient ratios above are good starting points, but everyone's body is different. You may need to adjust your macros based on your individual response.
              </p>
              
              <div className="space-y-4 mt-4">
                <h3 className="font-medium">Tips for Different Goals:</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-red-600">For Weight Loss:</p>
                  <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                    <li>Higher protein intake helps preserve muscle mass during calorie restriction</li>
                    <li>Moderate carbs provide energy for workouts</li>
                    <li>Moderate fat intake helps with hormone function and satiety</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-600">For Maintenance:</p>
                  <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                    <li>Balanced macros with slightly higher carbs for energy</li>
                    <li>Adequate protein for recovery and muscle maintenance</li>
                    <li>Sufficient fat for hormone production</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-green-600">For Muscle Gain:</p>
                  <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                    <li>Higher carbs to fuel intense workouts and support recovery</li>
                    <li>Adequate protein for muscle building (aim for 1.6-2.2g per kg of bodyweight)</li>
                    <li>Sufficient fat to support hormone production</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 px-4 py-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                <p><strong>Note:</strong> This calculator provides estimates based on general formulas. For personalized nutrition advice, consult with a registered dietitian or nutritionist.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MacroCalculatorPage;
