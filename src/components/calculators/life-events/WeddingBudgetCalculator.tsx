
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Heart, PlusCircle, MinusCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BudgetItem {
  id: string;
  category: string;
  name: string;
  plannedAmount: number;
  actualAmount: number;
}

const initialBudgetItems: BudgetItem[] = [
  { id: "venue", category: "Venue", name: "Ceremony & Reception Venue", plannedAmount: 10000, actualAmount: 0 },
  { id: "catering", category: "Food & Drink", name: "Catering & Bar", plannedAmount: 8000, actualAmount: 0 },
  { id: "photography", category: "Services", name: "Photography", plannedAmount: 3000, actualAmount: 0 },
  { id: "attire", category: "Attire", name: "Wedding Attire", plannedAmount: 2500, actualAmount: 0 },
  { id: "flowers", category: "Décor", name: "Flowers & Decorations", plannedAmount: 2000, actualAmount: 0 },
  { id: "music", category: "Entertainment", name: "Music/DJ", plannedAmount: 1500, actualAmount: 0 },
  { id: "cake", category: "Food & Drink", name: "Wedding Cake", plannedAmount: 500, actualAmount: 0 },
  { id: "invitations", category: "Stationery", name: "Invitations & Stationery", plannedAmount: 500, actualAmount: 0 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#EC7063", "#5DADE2", "#58D68D"];

const WeddingBudgetCalculator = () => {
  const [totalBudget, setTotalBudget] = useState(30000);
  const [guestCount, setGuestCount] = useState(100);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState(0);
  const { toast } = useToast();

  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.plannedAmount, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actualAmount, 0);
  const remainingBudget = totalBudget - totalPlanned;
  const costPerGuest = totalPlanned / (guestCount || 1);

  // Group items by category for chart
  const categoryData = budgetItems.reduce((acc, item) => {
    const existingCategory = acc.find(cat => cat.name === item.category);
    if (existingCategory) {
      existingCategory.value += item.plannedAmount;
    } else {
      acc.push({ name: item.category, value: item.plannedAmount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const handleAddItem = () => {
    if (!newItemName || newItemAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid item name and amount.",
        variant: "destructive",
      });
      return;
    }

    const newItem: BudgetItem = {
      id: `item-${Date.now()}`,
      category: "Other",
      name: newItemName,
      plannedAmount: newItemAmount,
      actualAmount: 0,
    };

    setBudgetItems([...budgetItems, newItem]);
    setNewItemName("");
    setNewItemAmount(0);

    toast({
      title: "Item Added",
      description: `${newItemName} has been added to your budget.`,
    });
  };

  const updateItemPlannedAmount = (id: string, amount: number) => {
    setBudgetItems(
      budgetItems.map(item => (item.id === id ? { ...item, plannedAmount: amount } : item))
    );
  };

  const updateItemActualAmount = (id: string, amount: number) => {
    setBudgetItems(
      budgetItems.map(item => (item.id === id ? { ...item, actualAmount: amount } : item))
    );
  };

  const handleSaveBudget = () => {
    // In a real app, this would save to a database or localStorage
    toast({
      title: "Budget Saved",
      description: "Your wedding budget has been saved successfully.",
    });
  };

  const removeItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Total Wedding Budget</label>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">$</span>
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Number of Guests</label>
                <Input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                />
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-1">Budget Summary</h3>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm text-muted-foreground">Total Budget:</div>
                  <div className="text-sm font-medium text-right">${totalBudget.toLocaleString()}</div>
                  
                  <div className="text-sm text-muted-foreground">Total Planned:</div>
                  <div className="text-sm font-medium text-right">${totalPlanned.toLocaleString()}</div>
                  
                  <div className="text-sm text-muted-foreground">Remaining:</div>
                  <div className={`text-sm font-medium text-right ${remainingBudget < 0 ? 'text-red-500' : ''}`}>
                    ${remainingBudget.toLocaleString()}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">Cost Per Guest:</div>
                  <div className="text-sm font-medium text-right">${costPerGuest.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 h-64">
              <h3 className="font-medium mb-2">Budget Breakdown</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Budget Items</h2>
        <div className="space-y-4">
          {budgetItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-10 items-center p-4 gap-4">
                  <div className="md:col-span-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-muted-foreground mb-1 block">Planned Amount</label>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">$</span>
                      <Input
                        type="number"
                        value={item.plannedAmount}
                        onChange={(e) => updateItemPlannedAmount(item.id, Number(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-muted-foreground mb-1 block">Actual Amount</label>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">$</span>
                      <Input
                        type="number"
                        value={item.actualAmount}
                        onChange={(e) => updateItemActualAmount(item.id, Number(e.target.value))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-3">Add New Item</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Item Name</label>
                  <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g., Wedding Favors"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Planned Amount</label>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">$</span>
                    <Input
                      type="number"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddItem} className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-8">
          <Button onClick={handleSaveBudget} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Budget
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeddingBudgetCalculator;
