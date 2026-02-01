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
