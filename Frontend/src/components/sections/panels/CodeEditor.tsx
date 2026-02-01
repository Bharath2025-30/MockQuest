import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SupportedLanguage } from "@/data/Problems";
import { LANGUAGE_CONFIG } from "@/data/Problems";
import { Loader2Icon, Play } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

type CodeEditorProps = {
  selectedLanguage: SupportedLanguage;
  code: string;
  isRunning: boolean;
  onLanguageChange: (language: SupportedLanguage) => void;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
};

const CodeEditor = ({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}: CodeEditorProps) => {
  return (
    <div className="h-full bg-base-300 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-base-100">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={selectedLanguage}
            className="size-6"
          />
          <Select
            value={selectedLanguage}
            onValueChange={(value: SupportedLanguage) =>
              onLanguageChange(value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a problem" />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
            >
              <SelectGroup>
                {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                  <SelectItem key={key} value={key}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

       <Button variant="default" disabled={isRunning} onClick={onRunCode}>
          {isRunning ? (
            <div className="flex items-center gap-2">
              <Loader2Icon className="size-4 animate-spin" />{" "}
              <span>Running...</span>{" "}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="size-4" /> <span>Run Code</span>{" "}
            </div>
          )}{" "}
        </Button>
      </div>

      <div className="flex-1">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
