
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Check, Car, Shield } from 'lucide-react';

const AutoInsuranceCalculator = () => {
  // Vehicle information
  const [vehicleValue, setVehicleValue] = useState(20000);
  const [vehicleAge, setVehicleAge] = useState(3);
  const [vehicleType, setVehicleType] = useState('sedan');
  
  // Driver information
  const [age, setAge] = useState(35);
  const [drivingRecord, setDrivingRecord] = useState('clean');
  const [annualMileage, setAnnualMileage] = useState(12000);
  
  // Coverage options
  const [coverage, setCoverage] = useState({
    liability: true,
    collision: true,
    comprehensive: true,
    uninsured: true,
    medicalPayments: true,
    roadside: false,
    rentalReimbursement: false
  });
  
  // Coverage limits
  const [limits, setLimits] = useState({
    bodilyInjury: '100/300',
    propertyDamage: '50',
    collisionDeductible: '500',
    comprehensiveDeductible: '500',
    uninsuredMotorist: '100/300',
    medicalPayments: '5'
  });
  
  // Results
  const [estimatedPremium, setEstimatedPremium] = useState({
    liability: 0,
    collision: 0,
    comprehensive: 0,
    uninsured: 0,
    medicalPayments: 0,
    roadside: 0,
    rentalReimbursement: 0,
    total: 0,
    monthly: 0
  });
  
  // Calculate premium whenever inputs change
  const calculatePremium = () => {
    // Base rates (these would normally come from an insurance rating algorithm)
    const baseRates = {
      liability: 500,
      collision: 300,
      comprehensive: 200,
      uninsured: 100,
      medicalPayments: 50,
      roadside: 30,
      rentalReimbursement: 40
    };
    
    // Age factor (higher for young and elderly drivers)
    let ageFactor = 1;
    if (age < 25) ageFactor = 1.5;
    else if (age > 65) ageFactor = 1.2;
    
    // Driving record factor
    let recordFactor = 1;
    if (drivingRecord === 'minor') recordFactor = 1.25;
    else if (drivingRecord === 'major') recordFactor = 1.75;
    else if (drivingRecord === 'multiple') recordFactor = 2.5;
    
    // Vehicle age factor (newer vehicles cost more to insure)
    const vehicleAgeFactor = Math.max(0.8, 1 - (vehicleAge * 0.02));
    
    // Vehicle type factor
    let vehicleTypeFactor = 1;
    if (vehicleType === 'luxury') vehicleTypeFactor = 1.4;
    else if (vehicleType === 'sports') vehicleTypeFactor = 1.6;
    else if (vehicleType === 'suv') vehicleTypeFactor = 1.2;
    else if (vehicleType === 'truck') vehicleTypeFactor = 1.15;
    
    // Mileage factor (higher mileage = higher risk)
    const mileageFactor = 0.9 + (annualMileage / 15000) * 0.2;
    
    // Coverage limit factors
    const liabilityLimitFactor = limits.bodilyInjury === '250/500' ? 1.3 : 
                                limits.bodilyInjury === '100/300' ? 1.1 : 1;
    
    const propertyLimitFactor = limits.propertyDamage === '100' ? 1.2 : 
                               limits.propertyDamage === '50' ? 1.1 : 1;
    
    const collisionDeductibleFactor = limits.collisionDeductible === '1000' ? 0.85 : 
                                     limits.collisionDeductible === '500' ? 1 : 1.15;
    
    const compDeductibleFactor = limits.comprehensiveDeductible === '1000' ? 0.85 : 
                               limits.comprehensiveDeductible === '500' ? 1 : 1.15;
    
    // Calculate individual coverages
    const liabilityCost = coverage.liability ? baseRates.liability * ageFactor * recordFactor * mileageFactor * liabilityLimitFactor * propertyLimitFactor : 0;
    
    const collisionCost = coverage.collision ? baseRates.collision * vehicleTypeFactor * vehicleAgeFactor * recordFactor * collisionDeductibleFactor * (vehicleValue / 20000) : 0;
    
    const comprehensiveCost = coverage.comprehensive ? baseRates.comprehensive * vehicleTypeFactor * vehicleAgeFactor * compDeductibleFactor * (vehicleValue / 20000) : 0;
    
    const uninsuredCost = coverage.uninsured ? baseRates.uninsured * ageFactor * mileageFactor : 0;
    
    const medicalCost = coverage.medicalPayments ? baseRates.medicalPayments * (limits.medicalPayments === '10' ? 1.2 : 1) : 0;
    
    const roadsideCost = coverage.roadside ? baseRates.roadside : 0;
    
    const rentalCost = coverage.rentalReimbursement ? baseRates.rentalReimbursement : 0;
    
    // Calculate total
    const totalAnnual = liabilityCost + collisionCost + comprehensiveCost + uninsuredCost + medicalCost + roadsideCost + rentalCost;
    const monthly = totalAnnual / 12;
    
    setEstimatedPremium({
      liability: Math.round(liabilityCost),
      collision: Math.round(collisionCost),
      comprehensive: Math.round(comprehensiveCost),
      uninsured: Math.round(uninsuredCost),
      medicalPayments: Math.round(medicalCost),
      roadside: Math.round(roadsideCost),
      rentalReimbursement: Math.round(rentalCost),
      total: Math.round(totalAnnual),
      monthly: Math.round(monthly)
    });
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle coverage toggle
  const handleCoverageToggle = (coverageType) => {
    setCoverage({
      ...coverage,
      [coverageType]: !coverage[coverageType]
    });
  };
  
  // Handle limit change
  const handleLimitChange = (limitType, value) => {
    setLimits({
      ...limits,
      [limitType]: value
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="vehicle" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehicle">Vehicle Information</TabsTrigger>
          <TabsTrigger value="driver">Driver Information</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicle" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Vehicle Details</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-value">Vehicle Value</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="vehicle-value"
                    type="number"
                    value={vehicleValue}
                    onChange={(e) => setVehicleValue(Number(e.target.value))}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle-age">Vehicle Age (Years): {vehicleAge}</Label>
                <Slider
                  id="vehicle-age"
                  value={[vehicleAge]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(value) => setVehicleAge(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle-type">Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger id="vehicle-type">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV/Crossover</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="luxury">Luxury Vehicle</SelectItem>
                    <SelectItem value="sports">Sports Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="driver" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Driver Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driver-age">Driver Age: {age}</Label>
                <Slider
                  id="driver-age"
                  value={[age]}
                  min={16}
                  max={85}
                  step={1}
                  onValueChange={(value) => setAge(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driving-record">Driving Record (Last 3 Years)</Label>
                <Select value={drivingRecord} onValueChange={setDrivingRecord}>
                  <SelectTrigger id="driving-record">
                    <SelectValue placeholder="Select driving record" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">Clean (No Violations)</SelectItem>
                    <SelectItem value="minor">Minor Violations (1-2 Tickets)</SelectItem>
                    <SelectItem value="major">Major Violation (1 Accident or DUI)</SelectItem>
                    <SelectItem value="multiple">Multiple Major Violations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="annual-mileage">Annual Mileage: {annualMileage.toLocaleString()}</Label>
                <Slider
                  id="annual-mileage"
                  value={[annualMileage]}
                  min={1000}
                  max={30000}
                  step={1000}
                  onValueChange={(value) => setAnnualMileage(value[0])}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="coverage" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Required Coverages</h3>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    <Label htmlFor="liability" className="text-base font-medium">Liability Insurance</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Covers damages you cause to others</p>
                </div>
                <Switch
                  id="liability"
                  checked={coverage.liability}
                  onCheckedChange={() => handleCoverageToggle('liability')}
                  disabled={true} // Liability is typically required
                />
              </div>
              
              {coverage.liability && (
                <div className="ml-6 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bodily-injury">Bodily Injury Limits</Label>
                    <Select 
                      value={limits.bodilyInjury} 
                      onValueChange={(value) => handleLimitChange('bodilyInjury', value)}
                    >
                      <SelectTrigger id="bodily-injury">
                        <SelectValue placeholder="Select limits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25/50">$25k/$50k</SelectItem>
                        <SelectItem value="50/100">$50k/$100k</SelectItem>
                        <SelectItem value="100/300">$100k/$300k</SelectItem>
                        <SelectItem value="250/500">$250k/$500k</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="property-damage">Property Damage</Label>
                    <Select 
                      value={limits.propertyDamage} 
                      onValueChange={(value) => handleLimitChange('propertyDamage', value)}
                    >
                      <SelectTrigger id="property-damage">
                        <SelectValue placeholder="Select limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">$25,000</SelectItem>
                        <SelectItem value="50">$50,000</SelectItem>
                        <SelectItem value="100">$100,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Vehicle Protection</h3>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-primary" />
                    <Label htmlFor="collision" className="text-base font-medium">Collision Coverage</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Covers damage to your vehicle from an accident</p>
                </div>
                <Switch
                  id="collision"
                  checked={coverage.collision}
                  onCheckedChange={() => handleCoverageToggle('collision')}
                />
              </div>
              
              {coverage.collision && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="collision-deductible">Collision Deductible</Label>
                  <Select 
                    value={limits.collisionDeductible} 
                    onValueChange={(value) => handleLimitChange('collisionDeductible', value)}
                  >
                    <SelectTrigger id="collision-deductible">
                      <SelectValue placeholder="Select deductible" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250">$250</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="1000">$1,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    <Label htmlFor="comprehensive" className="text-base font-medium">Comprehensive Coverage</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Covers damage not caused by collision (theft, weather, etc.)</p>
                </div>
                <Switch
                  id="comprehensive"
                  checked={coverage.comprehensive}
                  onCheckedChange={() => handleCoverageToggle('comprehensive')}
                />
              </div>
              
              {coverage.comprehensive && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="comprehensive-deductible">Comprehensive Deductible</Label>
                  <Select 
                    value={limits.comprehensiveDeductible} 
                    onValueChange={(value) => handleLimitChange('comprehensiveDeductible', value)}
                  >
                    <SelectTrigger id="comprehensive-deductible">
                      <SelectValue placeholder="Select deductible" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250">$250</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="1000">$1,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Additional Coverages</h3>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Label htmlFor="uninsured" className="text-base font-medium">Uninsured/Underinsured Motorist</Label>
                  <p className="text-sm text-muted-foreground mt-1">Protection if you're hit by a driver with no or insufficient insurance</p>
                </div>
                <Switch
                  id="uninsured"
                  checked={coverage.uninsured}
                  onCheckedChange={() => handleCoverageToggle('uninsured')}
                />
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <Label htmlFor="medical-payments" className="text-base font-medium">Medical Payments</Label>
                  <p className="text-sm text-muted-foreground mt-1">Covers medical expenses regardless of fault</p>
                </div>
                <Switch
                  id="medical-payments"
                  checked={coverage.medicalPayments}
                  onCheckedChange={() => handleCoverageToggle('medicalPayments')}
                />
              </div>
              
              {coverage.medicalPayments && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="medical-limit">Medical Payment Limit</Label>
                  <Select 
                    value={limits.medicalPayments} 
                    onValueChange={(value) => handleLimitChange('medicalPayments', value)}
                  >
                    <SelectTrigger id="medical-limit">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">$1,000</SelectItem>
                      <SelectItem value="5">$5,000</SelectItem>
                      <SelectItem value="10">$10,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-start justify-between">
                <div>
                  <Label htmlFor="roadside" className="text-base font-medium">Roadside Assistance</Label>
                  <p className="text-sm text-muted-foreground mt-1">Help with breakdowns, flat tires, or lockouts</p>
                </div>
                <Switch
                  id="roadside"
                  checked={coverage.roadside}
                  onCheckedChange={() => handleCoverageToggle('roadside')}
                />
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <Label htmlFor="rental" className="text-base font-medium">Rental Car Reimbursement</Label>
                  <p className="text-sm text-muted-foreground mt-1">Covers rental car costs if your vehicle is being repaired</p>
                </div>
                <Switch
                  id="rental"
                  checked={coverage.rentalReimbursement}
                  onCheckedChange={() => handleCoverageToggle('rentalReimbursement')}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center">
        <Button onClick={calculatePremium} size="lg" className="px-8">
          Calculate Premium Estimate
        </Button>
      </div>
      
      {/* Results Section */}
      {estimatedPremium.total > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-center mb-6">Premium Estimate</h3>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-primary/10 rounded-lg">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <span className="text-sm text-muted-foreground">Estimated Annual Premium</span>
              <div className="text-3xl font-bold text-primary">{formatCurrency(estimatedPremium.total)}</div>
            </div>
            <div className="text-center md:text-right">
              <span className="text-sm text-muted-foreground">Monthly Payment</span>
              <div className="text-2xl font-bold">{formatCurrency(estimatedPremium.monthly)}</div>
            </div>
          </div>
          
          <h4 className="font-medium mb-4">Coverage Breakdown</h4>
          
          <div className="space-y-3">
            {estimatedPremium.liability > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span>Liability</span>
                <span className="font-medium">{formatCurrency(estimatedPremium.liability)}</span>
              </div>
            )}
            
            {estimatedPremium.collision > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span>Collision</span>
                <span className="font-medium">{formatCurrency(estimatedPremium.collision)}</span>
              </div>
            )}
            
            {estimatedPremium.comprehensive > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span>Comprehensive</span>
                <span className="font-medium">{formatCurrency(estimatedPremium.comprehensive)}</span>
              </div>
            )}
            
            {estimatedPremium.uninsured > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span>Uninsured/Underinsured Motorist</span>
                <span className="font-medium">{formatCurrency(estimatedPremium.uninsured)}</span>
              </div>
            )}
            
            {estimatedPremium.medicalPayments > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span>Medical Payments</span>
                <span className="font-medium">{formatCurrency(estimatedPremium.medicalPayments)}</span>
              </div>
            )}
            
            {estimatedPremium.roadside > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span>Roadside Assistance</span>
                <span className="font-medium">{formatCurrency(estimatedPremium.roadside)}</span>
              </div>
            )}
            
            {estimatedPremium.rentalReimbursement > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span>Rental Car Reimbursement</span>
                <span className="font-medium">{formatCurrency(estimatedPremium.rentalReimbursement)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2 border-b font-bold">
              <span>Total Annual Premium</span>
              <span>{formatCurrency(estimatedPremium.total)}</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium mb-1">Important Note</p>
              <p>This is only an estimate based on the information provided. Actual premiums will vary based on additional factors including credit score, location, exact vehicle details, and insurance company policies.</p>
            </div>
          </div>
        </Card>
      )}
      
      <Card className="p-6 bg-muted/20">
        <h3 className="text-lg font-medium mb-2">Coverage Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Liability Insurance</p>
              <p className="text-sm text-muted-foreground">Most experts recommend at least 100/300/50 in liability coverage to adequately protect your assets.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Deductibles</p>
              <p className="text-sm text-muted-foreground">Choose a deductible you can comfortably afford in case of an accident. Lower deductibles mean higher premiums.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Full Coverage</p>
              <p className="text-sm text-muted-foreground">For newer vehicles or those with loans, comprehensive and collision coverage is usually recommended or required.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AutoInsuranceCalculator;
