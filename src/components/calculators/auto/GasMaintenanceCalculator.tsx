import React, { useState, useEffect } from 'react';
import { Fuel, Wrench, Calculator, Save, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/utils/calculatorUtils';
import { saveCalculatorData, getCalculatorData } from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

const CALCULATOR_ID = 'gas-maintenance-calculator';

const DEFAULTS = {
  distance: 12000, // miles per year
  fuelEfficiency: 25, // MPG
  gasPrice: 3.50, // per gallon
  oilChangeCost: 50,
  oilChangeFrequency: 5000, // miles
  tireRotationCost: 20,
  tireRotationFrequency: 7500, // miles
  otherMaintenanceCost: 200, // per year
};

const GasMaintenanceCalculator = () => {
  const { toast } = useToast();
  const [distance, setDistance] = useState(DEFAULTS.distance);
  const [fuelEfficiency, setFuelEfficiency] = useState(DEFAULTS.fuelEfficiency);
  const [gasPrice, setGasPrice] = useState(DEFAULTS.gasPrice);
  const [oilChangeCost, setOilChangeCost] = useState(DEFAULTS.oilChangeCost);
  const [oilChangeFrequency, setOilChangeFrequency] = useState(DEFAULTS.oilChangeFrequency);
  const [tireRotationCost, setTireRotationCost] = useState(DEFAULTS.tireRotationCost);
  const [tireRotationFrequency, setTireRotationFrequency] = useState(DEFAULTS.tireRotationFrequency);
  const [otherMaintenanceCost, setOtherMaintenanceCost] = useState(DEFAULTS.otherMaintenanceCost);

  const [results, setResults] = useState<any>(null);
  const [dataStored, setDataStored] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedData = getCalculatorData(CALCULATOR_ID);
    if (savedData) {
      setDistance(savedData.distance ?? DEFAULTS.distance);
      setFuelEfficiency(savedData.fuelEfficiency ?? DEFAULTS.fuelEfficiency);
      setGasPrice(savedData.gasPrice ?? DEFAULTS.gasPrice);
      setOilChangeCost(savedData.oilChangeCost ?? DEFAULTS.oilChangeCost);
      setOilChangeFrequency(savedData.oilChangeFrequency ?? DEFAULTS.oilChangeFrequency);
      setTireRotationCost(savedData.tireRotationCost ?? DEFAULTS.tireRotationCost);
      setTireRotationFrequency(savedData.tireRotationFrequency ?? DEFAULTS.tireRotationFrequency);
      setOtherMaintenanceCost(savedData.otherMaintenanceCost ?? DEFAULTS.otherMaintenanceCost);
      setDataStored(true);
    }
  }, []);

  // Calculate costs
  useEffect(() => {
    calculateCosts();
  }, [
    distance, fuelEfficiency, gasPrice, oilChangeCost, oilChangeFrequency,
    tireRotationCost, tireRotationFrequency, otherMaintenanceCost
  ]);

  const calculateCosts = () => {
    const gallonsPerYear = distance / fuelEfficiency;
    const annualGasCost = gallonsPerYear * gasPrice;

    const oilChangesPerYear = distance / oilChangeFrequency;
    const annualOilChangeCost = oilChangesPerYear * oilChangeCost;

    const tireRotationsPerYear = distance / tireRotationFrequency;
    const annualTireRotationCost = tireRotationsPerYear * tireRotationCost;

    const totalAnnualMaintenance = annualOilChangeCost + annualTireRotationCost + otherMaintenanceCost;
    const totalAnnualCost = annualGasCost + totalAnnualMaintenance;

    setResults({
      annualGasCost,
      annualOilChangeCost,
      annualTireRotationCost,
      otherMaintenanceCost,
      totalAnnualMaintenance,
      totalAnnualCost,
      monthlyGasCost: annualGasCost / 12,
      monthlyMaintenanceCost: totalAnnualMaintenance / 12,
      totalMonthlyCost: totalAnnualCost / 12,
    });
  };

  // Save data
  const handleSaveData = () => {
     const dataToSave = {
       distance,
       fuelEfficiency,
       gasPrice,
       oilChangeCost,
       oilChangeFrequency,
       tireRotationCost,
       tireRotationFrequency,
       otherMaintenanceCost,
       timestamp: Date.now()
     };
     saveCalculatorData(CALCULATOR_ID, dataToSave);
     setDataStored(true);
     toast({
       title: "Data Saved",
       description: "Your gas & maintenance inputs have been saved locally.",
     });
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-primary/80 text-white">
         <div className="flex justify-between items-center">
           <div>
             <CardTitle className="text-2xl flex items-center gap-2">
               <Fuel className="h-6 w-6" /> <Wrench className="h-6 w-6" />
               Gas & Maintenance Calculator
             </CardTitle>
             <CardDescription className="text-gray-100 mt-2">
               Estimate your annual and monthly vehicle running costs.
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
            <div className="space-y-2">
              <Label htmlFor="distance">Annual Distance Driven (miles)</Label>
              <Input id="distance" type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} min={0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="fuelEfficiency">Fuel Efficiency (MPG)</Label>
                 <Input id="fuelEfficiency" type="number" value={fuelEfficiency} onChange={(e) => setFuelEfficiency(Number(e.target.value))} min={1} />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="gasPrice">Gas Price ($ per gallon)</Label>
                 <Input id="gasPrice" type="number" value={gasPrice} onChange={(e) => setGasPrice(Number(e.target.value))} min={0} step={0.01} />
               </div>
            </div>

            <div className="space-y-4 border-t pt-4">
               <h3 className="text-sm font-medium">Maintenance Costs</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oilChangeCost">Oil Change Cost ($)</Label>
                    <Input id="oilChangeCost" type="number" value={oilChangeCost} onChange={(e) => setOilChangeCost(Number(e.target.value))} min={0} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oilChangeFrequency">Oil Change Frequency (miles)</Label>
                    <Input id="oilChangeFrequency" type="number" value={oilChangeFrequency} onChange={(e) => setOilChangeFrequency(Number(e.target.value))} min={1000} />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tireRotationCost">Tire Rotation Cost ($)</Label>
                    <Input id="tireRotationCost" type="number" value={tireRotationCost} onChange={(e) => setTireRotationCost(Number(e.target.value))} min={0} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tireRotationFrequency">Tire Rotation Frequency (miles)</Label>
                    <Input id="tireRotationFrequency" type="number" value={tireRotationFrequency} onChange={(e) => setTireRotationFrequency(Number(e.target.value))} min={1000} />
                  </div>
               </div>
                <div className="space-y-2">
                  <Label htmlFor="otherMaintenanceCost">Other Annual Maintenance ($)</Label>
                  <Input id="otherMaintenanceCost" type="number" value={otherMaintenanceCost} onChange={(e) => setOtherMaintenanceCost(Number(e.target.value))} min={0} />
                   <p className="text-xs text-muted-foreground">Estimate for brakes, tires, fluids, etc.</p>
                </div>
            </div>
             
             <Button className="w-full" onClick={handleSaveData}>
               <Save className="w-4 h-4 mr-2" /> Save Inputs
             </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <div className="calculator-panel border rounded-lg p-6 space-y-4">
                 <h3 className="text-lg font-medium mb-4 text-center">Estimated Running Costs</h3>
                 
                 <div className="text-center">
                   <p className="text-sm text-muted-foreground">Total Estimated Monthly Cost</p>
                   <p className="text-4xl font-bold text-finance-primary">{formatCurrency(results.totalMonthlyCost)}</p>
                 </div>
                 <div className="text-center mb-4">
                   <p className="text-sm text-muted-foreground">Total Estimated Annual Cost: {formatCurrency(results.totalAnnualCost)}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Annual Gas Cost</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.annualGasCost)}</p>
                    </div>
                     <div className="text-center bg-gray-50 p-3 rounded">
                       <p className="text-xs text-muted-foreground">Annual Maintenance</p>
                       <p className="text-lg font-semibold">{formatCurrency(results.totalAnnualMaintenance)}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-2 text-sm pt-4 border-t">
                    <h4 className="font-medium">Maintenance Breakdown (Annual Est.):</h4>
                    <div className="flex justify-between"><span>Oil Changes:</span> <span>{formatCurrency(results.annualOilChangeCost)}</span></div>
                    <div className="flex justify-between"><span>Tire Rotations:</span> <span>{formatCurrency(results.annualTireRotationCost)}</span></div>
                    <div className="flex justify-between"><span>Other Costs:</span> <span>{formatCurrency(results.otherMaintenanceCost)}</span></div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GasMaintenanceCalculator;
