import { PROBLEMS, type Problem, type SupportedLanguage } from "@/data/Problems";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "../sections/panels/CodeEditor";
import OutputTab from "../sections/panels/OutputTab";
import ProblemDescription from "../sections/panels/problemDescription";
import { ExecuteCode } from "@/lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti"

const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState<string>("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState<any | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem: Problem = PROBLEMS[currentProblemId];

  // Update problem when URL changes
  useEffect(() => {
    if(problemId && PROBLEMS[problemId]) {
        setCurrentProblemId(problemId);
        setCode(PROBLEMS[problemId].starterCode[selectedLanguage]);
        setOutput(null);
    }
  }, [problemId, selectedLanguage]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language as SupportedLanguage);
    setCode(PROBLEMS[currentProblemId].starterCode[language as SupportedLanguage]);
    setOutput(null);
  }

  const handleProblemChange = (problemId: string) => {
    navigate(`/problems/${problemId}`);
  }

const triggerConfetti = () => {
  // left burst
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 120, // wider spread
    origin: { x: 0.2, y: 0.8 },
    colors: ["#ff0a54", "#ff477e", "#ff7096", "#fbb1bd", "#fee440"],
    ticks: 200,
  });

  // right burst
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 120, // wider spread
    origin: { x: 0.8, y: 0.8 },
    colors: ["#00bbf9", "#00f5d4", "#9b5de5", "#f15bb5", "#fee440"],
    ticks: 200,
  });

  // central burst
  confetti({
    particleCount: 120,
    spread: 150, // extra wide so it overlaps with others
    origin: { x: 0.5, y: 0.6 },
    colors: ["#ff0a54", "#00bbf9", "#9b5de5", "#f15bb5", "#fee440"],
    scalar: 1.2,
    ticks: 220,
  });
};




  const normalizeOutput = (output: string): string => {
  return output
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/\[\s+/g, "[")       // remove spaces after [
        .replace(/\s+\]/g, "]")       // remove spaces before ]
        .replace(/\s*,\s*/g, ",")     // normalize commas
        .replace(/'/g, '"')           // convert single quotes to double quotes
    )
    .filter((line) => line.length > 0)
    .join("\n");
};


  const checkIfTestsPassed  = (actualOutput: string, expectedOutput: string) : boolean=> {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  }

  const handleRunCode = async() => {
    setIsRunning(true);
    setOutput(null);
    const result = await ExecuteCode(selectedLanguage,code);
    setOutput(result ?? "");
    setIsRunning(false);

    //checking if the code is executed successfully and matches expected output
    if(result.success){
        const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
        const testsPassed: boolean = checkIfTestsPassed(result.output ?? '', expectedOutput);
        if(testsPassed){
            triggerConfetti();
            toast.success("Tests passed!");
        }
        else{
            toast.error("Tests failed, Check your output");
        }
    }
    else{
        toast.error("Code Execution Failed");
    }
  }

  
  return (
    <div className="h-screen w-full bg-base-100 flex flex-col">
        
        <PanelGroup direction="horizontal" className="">
            {/* Left Panel - Problem Description */}
            <Panel defaultSize={40} minSize={30}>
                <ProblemDescription 
                    problem={currentProblem}
                    currentProblemId={currentProblemId}
                    onProblemChange={handleProblemChange}
                    allProblems={Object.values(PROBLEMS)}
                />
            </Panel>

            <PanelResizeHandle className="w-1.5 cursor-col-resize 
             bg-foreground/40
             hover:bg-foreground 
             hover:drop-shadow-[0_0_3px_var(--brand-foreground/30)] 
             transition-all duration-300"/>

            {/* Right Panel - Code Editor and Output Tab */}
            <Panel defaultSize={60} minSize={30}>
                <PanelGroup direction="vertical">
                    {/* Code Editor Panel */}
                    <Panel defaultSize={70} minSize={30}>
                        <CodeEditor
                        selectedLanguage = {selectedLanguage}
                        code = {code}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={setCode}
                        onRunCode={handleRunCode}
                        />
                    </Panel>

                    <PanelResizeHandle className="h-1.5 cursor-col-resize 
                    bg-foreground/40
                    hover:bg-foreground 
                    hover:drop-shadow-[0_0_3px_var(--brand-foreground/30)] 
                    transition-all duration-300"/>
                    
                    {/* Output Tab Panel */}
                    <Panel defaultSize={30} minSize={30}>
                        <OutputTab output={output}/>
                    </Panel>
                </PanelGroup>
            </Panel>
        </PanelGroup>
        
    </div>
  )
}

export default ProblemDetail
