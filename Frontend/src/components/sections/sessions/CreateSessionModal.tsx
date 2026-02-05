import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROBLEMS } from "@/data/Problems";
import { getEnumForDifficulty } from "@/lib/utils";
import { CircleFadingPlusIcon } from "lucide-react";
import { useState } from "react";

const CreateSessionModal = ({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateSession,
  isCreating,
}: any) => {
  const problems = Object.values(PROBLEMS);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);

  if (!isOpen) return null;

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // dialog is closing → clear state
          setSelectedProblem(null);
          setRoomConfig({ problem: null, difficulty: 0 });
        }
        onClose(open);
      }}
    >
      <AlertDialogContent className="max-w-lg w-full">
        <AlertDialogHeader>
          <div className="flex flex-row items-center justify-center gap-1 w-full">
            <AlertDialogMedia>
              <CircleFadingPlusIcon />
            </AlertDialogMedia>
            <AlertDialogTitle className="mb-2">
              Create New Session
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>Select Problem</AlertDialogDescription>

          {/* Full width Select */}
          <Select
            onValueChange={(value) => {
              const problem = problems.find((p) => p.id === value);
              if (problem) {
                setRoomConfig({
                  problem: value,
                  difficulty: getEnumForDifficulty(problem?.difficulty) ?? 0,
                });
                setSelectedProblem(problem);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a problem" />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              avoidCollisions={false}
              position="popper"
              className="w-full"
            >
              <SelectGroup>
                {problems.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Problem details below dropdown */}
          {selectedProblem && (
            <div className="mt-4 p-4 rounded-lg bg-muted text-left w-full border border-brand">
              <h4 className="text-lg font-bold font-serif">Room Summary</h4>
              <h4 className="text-base font-medium">
                {selectedProblem.title} -{" "}
                <span className="text-sm text-muted-foreground">
                  Difficulty ({selectedProblem.difficulty})
                </span>
              </h4>
              <p className="text-sm text-muted-foreground">
                Max Participants: 2 (1-on-1 session)
              </p>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-wrap gap-3 justify-end">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={onCreateSession}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? "Creating..." : "Start Session"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateSessionModal;
