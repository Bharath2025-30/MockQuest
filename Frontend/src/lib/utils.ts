import type { badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Extract the union type of valid variants  
type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
export const getDifficultyBadgeClass = (
  difficulty?: string | null
  ): BadgeVariant => {
    switch (difficulty?.toLowerCase()) { 
      case "easy":
        return "success"; 
      case "medium":
        return "warning";
      case "hard":
        return "destructive";
      default:
        return "secondary"; // Default variant
    }
}

export const getEnumForDifficulty = (difficulty: string): number => {
  switch (difficulty?.toLowerCase()) { 
      case "easy":
        return 0; 
      case "medium":
        return 1;
      case "hard":
        return 2;
      default:
        return 2; 
    }
}

export const getDifficutyName = (difficulty: number): string => {
  switch (difficulty) { 
      case 0:
        return "Easy"; 
      case 1:
        return "Medium";
      case 2:
        return "Hard";
      default:
        return "Hard"; 
    }
}
