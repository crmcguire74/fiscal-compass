import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const ScientificCalculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0); // Basic memory function example

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
    }
  };

  const clearAll = () => {
    setDisplayValue("0");
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplayValue("0");
    // Note: More sophisticated clear entry might revert to previous state if needed
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate(currentValue, inputValue, operator);
      setDisplayValue(String(result));
      setCurrentValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return right === 0 ? NaN : left / right; // Handle division by zero
      case "^":
        return Math.pow(left, right);
      default:
        return right; // Should not happen with binary ops
    }
  };

  const handleUnaryOperation = (op: string) => {
    const inputValue = parseFloat(displayValue);
    let result: number;

    switch (op) {
      case "sqrt":
        result = Math.sqrt(inputValue);
        break;
      case "sin":
        result = Math.sin(degreesToRadians(inputValue));
        break;
      case "cos":
        result = Math.cos(degreesToRadians(inputValue));
        break;
      case "tan":
        result = Math.tan(degreesToRadians(inputValue));
        break;
      case "log":
        result = Math.log10(inputValue);
        break; // Base 10 log
      case "ln":
        result = Math.log(inputValue);
        break; // Natural log
      case "1/x":
        result = inputValue === 0 ? NaN : 1 / inputValue;
        break;
      case "+/-":
        result = inputValue * -1;
        break;
      case "!":
        result = factorial(inputValue);
        break;
      case "deg": // Placeholder for degree/radian mode switch
      case "rad": // Placeholder for degree/radian mode switch
        console.warn("Degree/Radian mode switch not implemented yet.");
        return; // Don't change display for mode switch yet
      default:
        result = inputValue;
    }

    if (isNaN(result) || !isFinite(result)) {
      setDisplayValue("Error");
    } else {
      // Format result nicely if needed, e.g., limit decimal places
      setDisplayValue(String(result));
    }
    // Decide if unary operations should reset the state or allow chaining
    // For now, let's assume it finalizes the current number
    setCurrentValue(result); // Update currentValue after unary op
    setWaitingForOperand(true); // Ready for next number or operator
    setOperator(null); // Clear operator after unary op
  };

  const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN; // Factorial is not defined for negative numbers or non-integers
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleEquals = () => {
    const inputValue = parseFloat(displayValue);

    if (operator && currentValue !== null) {
      const result = calculate(currentValue, inputValue, operator);
      if (isNaN(result) || !isFinite(result)) {
        setDisplayValue("Error");
      } else {
        setDisplayValue(String(result));
      }
      setCurrentValue(null); // Reset after equals
      setOperator(null);
      setWaitingForOperand(false); // Allow new number input
    }
    // If no operator or currentValue, just keep the displayed value
  };

  // --- Memory Functions ---
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => {
    setDisplayValue(String(memory));
    setWaitingForOperand(false); // Allow editing recalled value
  };
  const memoryAdd = () => {
    const currentDisplay = parseFloat(displayValue);
    if (!isNaN(currentDisplay)) {
      setMemory(memory + currentDisplay);
      setWaitingForOperand(true); // After M+, usually wait for next input
    }
  };
  const memorySubtract = () => {
    const currentDisplay = parseFloat(displayValue);
    if (!isNaN(currentDisplay)) {
      setMemory(memory - currentDisplay);
      setWaitingForOperand(true); // After M-, usually wait for next input
    }
  };

  // Layout structure
  const buttonLayout = [
    // Scientific functions row 1
    ["(", ")", "mc", "m+", "m-", "mr"],
    // Scientific functions row 2
    ["2nd", "x²", "x³", "xʸ", "eˣ", "10ˣ"],
    // Scientific functions row 3
    ["1/x", "√x", "³√x", "ʸ√x", "ln", "log₁₀"],
    // Scientific functions row 4
    ["x!", "sin", "cos", "tan", "e", "EE"],
    // Scientific functions row 5
    ["Rad", "sinh", "cosh", "tanh", "π", "Rand"],
    // Standard calculator rows
    ["AC", "C", "+/-", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const handleButtonClick = (label: string) => {
    if (displayValue === "Error") {
      if (label === "AC") {
        clearAll();
      }
      return; // Ignore other buttons if in error state until AC
    }

    if (!isNaN(parseInt(label))) {
      // Digit
      inputDigit(label);
    } else if (label === ".") {
      inputDecimal();
    } else if (["+", "-", "*", "/", "^"].includes(label)) {
      // Binary operators
      performOperation(label);
    } else if (label === "=") {
      handleEquals();
    } else if (label === "AC") {
      clearAll();
    } else if (label === "C") {
      clearEntry();
    } else if (
      ["sqrt", "sin", "cos", "tan", "log", "ln", "1/x", "+/-", "!"].includes(
        label
      )
    ) {
      // Unary operators
      // Map UI labels to internal function names if needed
      const opMap: { [key: string]: string } = {
        "√x": "sqrt",
        "log₁₀": "log",
        "x!": "!",
        "x²": "sqr",
        "x³": "cube",
        xʸ: "^",
        eˣ: "exp",
        "10ˣ": "pow10",
        "³√x": "cbrt",
        "ʸ√x": "ythrt",
      };
      handleUnaryOperation(opMap[label] || label);
    } else if (label === "mc") {
      memoryClear();
    } else if (label === "mr") {
      memoryRecall();
    } else if (label === "m+") {
      memoryAdd();
    } else if (label === "m-") {
      memorySubtract();
    }
    // Add handlers for other scientific buttons (π, e, Rand, etc.)
    else if (label === "π") {
      setDisplayValue(String(Math.PI));
      setWaitingForOperand(false);
    } else if (label === "e") {
      setDisplayValue(String(Math.E));
      setWaitingForOperand(false);
    } else if (label === "Rand") {
      setDisplayValue(String(Math.random()));
      setWaitingForOperand(false);
    }
    // Placeholder for other functions like 2nd, EE, Rad/Deg, etc.
    else {
      console.warn(`Button "${label}" functionality not implemented yet.`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="p-4">
        {/* Display */}
        <Input
          type="text"
          value={displayValue}
          readOnly
          className="mb-4 text-right text-3xl h-16 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md px-3"
          aria-label="Calculator Display"
        />

        {/* Buttons Grid */}
        <div className={`grid grid-cols-${buttonLayout[0].length} gap-2`}>
          {buttonLayout.flat().map((label) => (
            <Button
              key={label}
              onClick={() => handleButtonClick(label)}
              variant={
                ["AC", "C"].includes(label)
                  ? "destructive"
                  : ["=", "+", "-", "*", "/", "^"].includes(label)
                  ? "secondary"
                  : "outline"
              }
              className={`text-lg p-4 h-14 flex items-center justify-center rounded-md ${
                label === "0" ? "col-span-2" : "" // Make 0 button wider
              } ${
                ["=", "+", "-", "*", "/", "^"].includes(label)
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : ""
              } ${
                ["AC", "C"].includes(label)
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : ""
              } ${
                !isNaN(parseInt(label)) || label === "."
                  ? "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  : ""
              } ${
                // Style scientific buttons differently
                [
                  "(",
                  ")",
                  "mc",
                  "m+",
                  "m-",
                  "mr",
                  "2nd",
                  "x²",
                  "x³",
                  "xʸ",
                  "eˣ",
                  "10ˣ",
                  "1/x",
                  "√x",
                  "³√x",
                  "ʸ√x",
                  "ln",
                  "log₁₀",
                  "x!",
                  "sin",
                  "cos",
                  "tan",
                  "e",
                  "EE",
                  "Rad",
                  "sinh",
                  "cosh",
                  "tanh",
                  "π",
                  "Rand",
                ].includes(label)
                  ? "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  : ""
              }`}
              aria-label={`Calculator button ${label}`}
            >
              {/* Special display for some buttons */}
              {label === "x²" ? (
                <>
                  x<sup>2</sup>
                </>
              ) : label === "x³" ? (
                <>
                  x<sup>3</sup>
                </>
              ) : label === "xʸ" ? (
                <>
                  x<sup>y</sup>
                </>
              ) : label === "eˣ" ? (
                <>
                  e<sup>x</sup>
                </>
              ) : label === "10ˣ" ? (
                <>
                  10<sup>x</sup>
                </>
              ) : label === "√x" ? (
                <>√x</>
              ) : label === "³√x" ? (
                <>³√x</>
              ) : label === "ʸ√x" ? (
                <>ʸ√x</>
              ) : label === "log₁₀" ? (
                <>
                  log<sub>10</sub>
                </>
              ) : (
                label
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScientificCalculator;
