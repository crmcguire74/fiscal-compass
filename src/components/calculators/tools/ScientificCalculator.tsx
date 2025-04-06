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
  const [calculatorMode, setCalculatorMode] = useState<
    "scientific" | "basic" | "graphing"
  >("scientific");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default on calculator keys to avoid double input
      if (
        [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          ".",
          "+",
          "-",
          "*",
          "/",
          "(",
          ")",
          "Enter",
          "Escape",
          "Backspace",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Handle numeric and operator keys
      if (!isNaN(parseInt(e.key))) {
        handleButtonClick(e.key);
      } else {
        switch (e.key) {
          case ".":
            handleButtonClick(".");
            break;
          case "+":
            performOperation("+");
            break;
          case "-":
            performOperation("-");
            break;
          case "*":
            performOperation("*");
            break;
          case "/":
            performOperation("/");
            break;
          case "(":
            handleParenthesis("(");
            break;
          case ")":
            handleParenthesis(")");
            break;
          case "Enter":
            handleButtonClick("=");
            break;
          case "Escape":
            handleButtonClick("AC");
            break;
          case "Backspace":
            if (displayValue === "0" && formula === "") {
              clearAll();
            } else {
              setDisplayValue((prev) =>
                prev.length > 1 ? prev.slice(0, -1) : "0"
              );
              setFormula((prev) => prev.slice(0, -1));
            }
            break;
        }
      }
    };

    // Add keyboard listener
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayValue, operator, currentValue]); // Dependencies for calculation state

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

  // Update orientation based on window width
  React.useEffect(() => {
    const handleResize = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? "landscape" : "portrait"
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scientificButtonLayoutPortrait = {
    scientific: [
      ["(", ")", "mc", "m+", "m-", "mr"],
      ["2nd", "x²", "x³", "xʸ", "eˣ", "10ˣ"],
      ["¹/ₓ", "³√ₓ", "∛ₓ", "ⁿ√ₓ", "ln", "log₁₀"],
      ["x!", "sin", "cos", "tan", "e", "EE"],
      ["Rand", "sinh", "cosh", "tanh", "π", "Rad"],
    ],
    controls: [
      ["Bksp", "+/-", "%", "/"],
      ["7", "8", "9", "×"],
      ["4", "5", "6", "-"],
      ["1", "2", "3", "+"],
      ["Mode", "0", ".", "="],
    ],
  };

  const scientificButtonLayoutLandscape = [
    ["(", ")", "mc", "m+", "m-", "mr", "AC", "+/-", "%", "/"],
    ["2nd", "x²", "x³", "xʸ", "eˣ", "10ˣ", "7", "8", "9", "*"],
    ["1/x", "³√x", "⁴√x", "ⁿ√x", "ln", "log₁₀", "4", "5", "6", "-"],
    ["x!", "sin", "cos", "tan", "e", "EE", "1", "2", "3", "+"],
    ["Rad", "sinh", "cosh", "tanh", "π", "Rand", "Mode", "0", ".", "="],
  ];

  const basicButtonLayout = [
    ["Bksp", "+/-", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["Mode", "0", ".", "="],
  ];

  const graphingButtonLayoutPortrait = [
    // Graphing functions (6 columns)
    ["f1", "f2", "f3", "f4", "f5", "graph"],
    ["y=", "window", "zoom", "trace", "2nd", "mode"],
    ["←", "→", "↑", "↓", "enter", "del"],
    ["sin", "cos", "tan", "(", ")", "alpha"],
    ["ln", "log", "e", "π", "^", "EE"],
    // Number pad (4 columns)
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["Mode", "0", ".", "="],
  ];

  const graphingButtonLayoutLandscape = [
    ["f1", "f2", "f3", "f4", "f5", "graph", "7", "8", "9", "÷"],
    ["y=", "window", "zoom", "trace", "2nd", "mode", "4", "5", "6", "*"],
    ["←", "→", "↑", "↓", "enter", "del", "1", "2", "3", "-"],
    ["sin", "cos", "tan", "(", ")", "alpha", "0", ".", "π", "+"],
    ["ln", "log", "e", "^", "√", "Mode", "Bksp", ",", "EE", "="],
  ];

  const getButtonLayout = () => {
    if (calculatorMode === "basic") return basicButtonLayout;
    if (calculatorMode === "graphing") {
      if (orientation === "portrait") {
        return graphingButtonLayoutPortrait;
      }
      return graphingButtonLayoutLandscape;
    }
    if (orientation === "portrait") {
      return [
        ...scientificButtonLayoutPortrait.scientific,
        ...scientificButtonLayoutPortrait.controls,
      ];
    }
    return scientificButtonLayoutLandscape;
  };

  const buttonLayout = getButtonLayout();

  const handleButtonClick = (label: string) => {
    if (label === "Mode") {
      setCalculatorMode((current) => {
        if (current === "scientific") return "basic";
        if (current === "basic") return "graphing";
        return "scientific";
      });
      return;
    }

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
    } else if (["+", "-", "*", "×", "/", "^"].includes(label)) {
      performOperation(label === "×" ? "*" : label);
    } else if (label === "=") {
      handleEquals();
    } else if (
      label === "AC" ||
      (label === "Bksp" && displayValue === "0" && formula === "")
    ) {
      clearAll();
    } else if (label === "Bksp") {
      console.log("Backspace pressed:", { displayValue, formula });
      if (displayValue === "0" && formula === "") {
        clearAll();
      } else {
        const newDisplayValue =
          displayValue.length > 1 ? displayValue.slice(0, -1) : "0";
        const newFormula = formula.slice(0, -1);
        console.log("New values:", { newDisplayValue, newFormula });
        setDisplayValue(newDisplayValue);
        setFormula(newFormula);
      }
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
      } else if (
        [
          "2nd",
          "EE",
          "f1",
          "f2",
          "f3",
          "f4",
          "f5",
          "y=",
          "window",
          "zoom",
          "trace",
          "graph",
          "←",
          "→",
          "↑",
          "↓",
          "enter",
          "alpha",
          "del",
        ].includes(label)
      ) {
        // These functions are not implemented yet
        console.warn(`Button "${label}" functionality not implemented yet.`);
      }
    }
  };

  return (
    <Card
      className={`w-full h-full shadow-xl bg-white flex flex-col overflow-hidden ${
        calculatorMode === "basic" ? "min-h-[600px]" : ""
      }`}
    >
      <CardContent
        className={`flex-1 flex flex-col overflow-y-auto ${
          calculatorMode === "basic"
            ? "p-4 gap-4"
            : calculatorMode === "graphing"
            ? "p-1 pb-4"
            : "p-1"
        }`}
      >
        {calculatorMode === "graphing" && (
          <div
            className={`flex-1 min-h-[300px] ${
              orientation === "landscape" ? "min-h-[400px]" : ""
            } bg-black rounded-lg mb-4 mx-1`}
          >
            {/* Graphing output window */}
          </div>
        )}
        <div className="relative mb-1">
          <Input
            type="text"
            value={displayValue}
            readOnly
            ref={inputRef}
            className={`text-right pr-4 text-2xl ${
              calculatorMode === "basic" ? "h-24" : "h-14"
            } bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-lg shadow-inner font-mono tracking-wider mb-4`}
            aria-label="Calculator Display"
          />
          {formula && (
            <span className="absolute left-3 top-2 text-sm text-gray-500 font-mono overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[90%]">
              {formula}
            </span>
          )}
        </div>

        {calculatorMode === "scientific" && orientation === "portrait" ? (
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="grid grid-cols-6 gap-1">
              {scientificButtonLayoutPortrait.scientific.flat().map((label) => (
                <Button
                  key={label}
                  onClick={() => handleButtonClick(label)}
                  className="rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm h-[3.8rem]"
                >
                  {label === "Bksp" && displayValue === "0" && formula === ""
                    ? "AC"
                    : label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {scientificButtonLayoutPortrait.controls.flat().map((label) => (
                <Button
                  key={label}
                  onClick={() => handleButtonClick(label)}
                  className={`
                    text-sm h-[3.8rem] flex items-center justify-center
                    ${
                      ["Bksp", "+/-", "%", "/"].includes(label)
                        ? "rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : ["×", "+", "-", "="].includes(label)
                        ? "rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold"
                        : label === "Mode"
                        ? "rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold"
                        : !isNaN(parseInt(label)) || label === "."
                        ? "rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                        : "rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }
                  `}
                >
                  {label === "Bksp" && displayValue === "0" && formula === ""
                    ? "AC"
                    : label}
                </Button>
              ))}
            </div>
          </div>
        ) : calculatorMode === "graphing" && orientation === "portrait" ? (
          <div className="flex-1 flex flex-col gap-0.5">
            <div className="grid grid-cols-6 gap-1">
              {graphingButtonLayoutPortrait
                .slice(0, 5)
                .flat()
                .map((label) => (
                  <Button
                    key={label}
                    onClick={() => handleButtonClick(label)}
                    className="rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm h-[3.8rem]"
                  >
                    {label}
                  </Button>
                ))}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {graphingButtonLayoutPortrait
                .slice(5)
                .flat()
                .map((label) => (
                  <Button
                    key={label}
                    onClick={() => handleButtonClick(label)}
                    className={`
                    text-sm h-[3.8rem] flex items-center justify-center
                    ${
                      ["AC", "+/-", "%", "÷"].includes(label)
                        ? "rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : ["*", "+", "-", "="].includes(label)
                        ? "rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold"
                        : label === "Mode"
                        ? "rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold"
                        : !isNaN(parseInt(label)) || label === "."
                        ? "rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                        : "rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }
                  `}
                  >
                    {label}
                  </Button>
                ))}
            </div>
          </div>
        ) : (
          <div
            className={`
            flex-1 grid
            ${
              calculatorMode === "graphing"
                ? orientation === "portrait"
                  ? "grid-cols-6"
                  : "grid-cols-10"
                : calculatorMode === "basic"
                ? "gap-2 grid-cols-4 h-full"
                : "gap-2 grid-cols-10"
            }
            ${calculatorMode === "graphing" ? "gap-1" : "gap-2"}
          `}
          >
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
                  text-sm flex items-center justify-center ${
                    calculatorMode === "basic" ? "h-full text-lg" : "h-14"
                  }
                  transition-all duration-150 ease-in-out
                  transform hover:scale-[1.02] active:scale-95
                  shadow hover:shadow-lg active:shadow-sm
                  font-medium tracking-wide
                  rounded-lg
                  ${
                    ["=", "+", "-", "*", "/", "^"].includes(label)
                      ? "bg-blue-500 hover:bg-blue-600 text-white font-bold"
                      : ["AC", "C"].includes(label)
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : label === "Mode"
                      ? "bg-sky-500 hover:bg-sky-600 text-white font-bold"
                      : !isNaN(parseInt(label)) || label === "."
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }
                  ${
                    label === "0" &&
                    calculatorMode !== "scientific" &&
                    calculatorMode !== "basic"
                      ? "col-span-2"
                      : ""
                  }
                `}
                aria-label={`Calculator button ${label}`}
              >
                {label === "Bksp" && displayValue === "0" && formula === "" ? (
                  "AC"
                ) : label === "calc" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M4 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm1 3h14v3H5V5zm0 4h3v3H5V9zm5 0h4v3h-4V9zm6 0h3v3h-3V9zM5 14h3v3H5v-3zm5 0h4v3h-4v-3zm6 0h3v7h-3v-7zM5 19h9v2H5v-2z" />
                  </svg>
                ) : label === "x²" ? (
                  "x²"
                ) : label === "x³" ? (
                  "x³"
                ) : label === "xʸ" ? (
                  "xʸ"
                ) : label === "eˣ" ? (
                  "eˣ"
                ) : label === "10ˣ" ? (
                  "10ˣ"
                ) : label === "¹/ₓ" ? (
                  "¹/ₓ"
                ) : label === "³√ₓ" ? (
                  "³√ₓ"
                ) : label === "∛ₓ" ? (
                  "∛ₓ"
                ) : label === "ⁿ√ₓ" ? (
                  "ⁿ√ₓ"
                ) : label === "log₁₀" ? (
                  "log₁₀"
                ) : (
                  label
                )}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScientificCalculator;
