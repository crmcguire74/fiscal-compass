import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const ScientificCalculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [isRadianMode, setIsRadianMode] = useState<boolean>(true);
  const [formula, setFormula] = useState<string>("");
  const [parenCount, setParenCount] = useState<number>(0);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplayValue(digit);
      setFormula((prev) => prev + digit);
      setWaitingForOperand(false);
    } else {
      const newValue = displayValue === "0" ? digit : displayValue + digit;
      setDisplayValue(newValue);
      if (displayValue === "0") {
        setFormula((prev) => prev.slice(0, -1) + digit);
      } else {
        setFormula((prev) => prev + digit);
      }
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue("0.");
      setFormula((prev) => prev + "0.");
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
      setFormula((prev) => prev + ".");
    }
  };

  const clearAll = () => {
    setDisplayValue("0");
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setFormula("");
    setParenCount(0);
  };

  const clearEntry = () => {
    setDisplayValue("0");
    if (!operator) {
      setFormula("");
    }
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

    // Update formula
    const opDisplay =
      {
        "*": "×",
        "/": "÷",
        "+": "+",
        "-": "-",
        "^": "^",
      }[nextOperator] || nextOperator;

    setFormula((prev) => prev + " " + opDisplay + " ");
  };

  const handleParenthesis = (paren: "(" | ")") => {
    if (paren === "(") {
      setParenCount((prev) => prev + 1);
      if (!waitingForOperand && displayValue !== "0") {
        setFormula((prev) => prev + " × (");
      } else {
        setFormula((prev) => prev + "(");
      }
      setWaitingForOperand(true);
    } else if (paren === ")" && parenCount > 0) {
      setParenCount((prev) => prev - 1);
      setFormula((prev) => prev + ")");
    }
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
        return right === 0 ? NaN : left / right;
      case "^":
        return Math.pow(left, right);
      default:
        return right;
    }
  };

  const handleUnaryOperation = (op: string) => {
    const inputValue = parseFloat(displayValue);
    let result: number;
    let formulaOp = "";

    switch (op) {
      case "sqrt":
        result = Math.sqrt(inputValue);
        formulaOp = "√";
        break;
      case "sin":
        result = isRadianMode
          ? Math.sin(inputValue)
          : Math.sin(degreesToRadians(inputValue));
        formulaOp = "sin";
        break;
      case "cos":
        result = isRadianMode
          ? Math.cos(inputValue)
          : Math.cos(degreesToRadians(inputValue));
        formulaOp = "cos";
        break;
      case "tan":
        result = isRadianMode
          ? Math.tan(inputValue)
          : Math.tan(degreesToRadians(inputValue));
        formulaOp = "tan";
        break;
      case "sinh":
        result = Math.sinh(inputValue);
        formulaOp = "sinh";
        break;
      case "cosh":
        result = Math.cosh(inputValue);
        formulaOp = "cosh";
        break;
      case "tanh":
        result = Math.tanh(inputValue);
        formulaOp = "tanh";
        break;
      case "log":
        result = Math.log10(inputValue);
        formulaOp = "log";
        break;
      case "ln":
        result = Math.log(inputValue);
        formulaOp = "ln";
        break;
      case "1/x":
        result = inputValue === 0 ? NaN : 1 / inputValue;
        formulaOp = "1/";
        break;
      case "+/-":
        result = -inputValue;
        formulaOp = "-";
        break;
      case "!":
        result = factorial(inputValue);
        formulaOp = "!";
        break;
      case "sqr":
        result = inputValue * inputValue;
        formulaOp = "²";
        break;
      case "cube":
        result = inputValue * inputValue * inputValue;
        formulaOp = "³";
        break;
      case "exp":
        result = Math.exp(inputValue);
        formulaOp = "e^";
        break;
      case "pow10":
        result = Math.pow(10, inputValue);
        formulaOp = "10^";
        break;
      case "cbrt":
        result = Math.cbrt(inputValue);
        formulaOp = "∛";
        break;
      default:
        result = inputValue;
        formulaOp = "";
    }

    if (isNaN(result) || !isFinite(result)) {
      setDisplayValue("Error");
      setFormula("Error");
    } else {
      setDisplayValue(String(result));
      if (["!", "²", "³"].includes(formulaOp)) {
        setFormula((prev) => prev + formulaOp);
      } else if (formulaOp) {
        setFormula((prev) => `${formulaOp}(${prev})`);
      }
    }
    setCurrentValue(result);
    setWaitingForOperand(true);
    setOperator(null);
  };

  const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
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
        setFormula("Error");
      } else {
        setDisplayValue(String(result));
        setFormula(String(result));
      }
      setCurrentValue(null);
      setOperator(null);
      setWaitingForOperand(false);
    }
  };

  const memoryClear = () => setMemory(0);
  const memoryRecall = () => {
    setDisplayValue(String(memory));
    setFormula((prev) => prev + memory);
    setWaitingForOperand(false);
  };
  const memoryAdd = () => {
    const currentDisplay = parseFloat(displayValue);
    if (!isNaN(currentDisplay)) {
      setMemory(memory + currentDisplay);
      setWaitingForOperand(true);
    }
  };
  const memorySubtract = () => {
    const currentDisplay = parseFloat(displayValue);
    if (!isNaN(currentDisplay)) {
      setMemory(memory - currentDisplay);
      setWaitingForOperand(true);
    }
  };

  const buttonLayout = [
    ["(", ")", "mc", "m+", "m-", "mr"],
    ["2nd", "x²", "x³", "xʸ", "eˣ", "10ˣ"],
    ["1/x", "√x", "³√x", "ʸ√x", "ln", "log₁₀"],
    ["x!", "sin", "cos", "tan", "e", "EE"],
    ["Rad", "sinh", "cosh", "tanh", "π", "Rand"],
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
      return;
    }

    if (!isNaN(parseInt(label))) {
      inputDigit(label);
    } else if (label === ".") {
      inputDecimal();
    } else if (["+", "-", "*", "/", "^"].includes(label)) {
      performOperation(label);
    } else if (label === "=") {
      handleEquals();
    } else if (label === "AC") {
      clearAll();
    } else if (label === "C") {
      clearEntry();
    } else if (label === "mc") {
      memoryClear();
    } else if (label === "mr") {
      memoryRecall();
    } else if (label === "m+") {
      memoryAdd();
    } else if (label === "m-") {
      memorySubtract();
    } else if (label === "π") {
      setDisplayValue(String(Math.PI));
      setFormula((prev) => prev + "π");
      setWaitingForOperand(false);
    } else if (label === "e") {
      setDisplayValue(String(Math.E));
      setFormula((prev) => prev + "e");
      setWaitingForOperand(false);
    } else if (label === "Rand") {
      const rand = Math.random();
      setDisplayValue(String(rand));
      setFormula((prev) => prev + rand.toFixed(8));
      setWaitingForOperand(false);
    } else if (label === "Rad") {
      setIsRadianMode(!isRadianMode);
    } else if (label === "(") {
      handleParenthesis("(");
    } else if (label === ")") {
      handleParenthesis(")");
    } else if (label === "xʸ") {
      performOperation("^");
    } else {
      // Handle all other scientific operations
      const opMap: { [key: string]: string } = {
        "√x": "sqrt",
        "log₁₀": "log",
        "x!": "!",
        "x²": "sqr",
        "x³": "cube",
        eˣ: "exp",
        "10ˣ": "pow10",
        "³√x": "cbrt",
        sin: "sin",
        cos: "cos",
        tan: "tan",
        sinh: "sinh",
        cosh: "cosh",
        tanh: "tanh",
        ln: "ln",
        "1/x": "1/x",
        "+/-": "+/-",
      };

      const operation = opMap[label];
      if (operation) {
        handleUnaryOperation(operation);
      } else if (label === "2nd" || label === "EE") {
        // These functions are not implemented yet
        console.warn(`Button "${label}" functionality not implemented yet.`);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 sm:mt-4 sm:mb-4">
      <CardContent className="p-2 sm:p-6">
        <div className="relative mb-6">
          <Input
            type="text"
            value={displayValue}
            readOnly
            className="text-right pr-4 text-3xl h-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-inner font-mono tracking-wider"
            aria-label="Calculator Display"
          />
          {formula && (
            <span className="absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 font-mono overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[90%]">
              {formula}
            </span>
          )}
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isRadianMode ? "RAD" : "DEG"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {memory !== 0 && `M = ${memory}`}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 p-2 sm:p-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-inner">
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
              className={`
                text-sm sm:text-lg h-14 flex items-center justify-center rounded-lg 
                transition-all duration-150 ease-in-out
                transform hover:scale-[1.02] active:scale-95
                shadow hover:shadow-lg active:shadow-sm
                font-medium tracking-wide text-[0.8rem] sm:text-base
                backdrop-blur-sm backdrop-saturate-150
                ${label === "0" ? "col-span-2" : ""}
                ${
                  ["=", "+", "-", "*", "/", "^"].includes(label)
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold"
                    : ""
                }
                ${
                  ["AC", "C"].includes(label)
                    ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    : ""
                }
                ${
                  !isNaN(parseInt(label)) || label === "."
                    ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                    : ""
                }
                ${
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
                    ? "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-200"
                    : ""
                }
              `}
              aria-label={`Calculator button ${label}`}
            >
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
