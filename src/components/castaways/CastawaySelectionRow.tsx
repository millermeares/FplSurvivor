"use client";

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";


interface CastawaySelectionRowProps {
  id: string;
  name: string;
  imageUrl: string | null;
  isSelected: boolean;
  week_eliminated: number | null;
  onSelect?: (id: string) => void; // Make optional to handle disabled state
}

// Function to generate filename-friendly ID
const generateImageName = (name: string) => 
  name.toLowerCase().replace(/\s+/g, "_"); // Convert to lowercase and replace spaces with underscores


export default function CastawaySelectionRow({
  id,
  name,
  imageUrl,
  isSelected,
  week_eliminated,
  onSelect,
}: CastawaySelectionRowProps) {
  const localImagePath = `/images/castaways/${generateImageName(name)}.jpg`;
  const isEliminated = week_eliminated !== null;
  const canSelect = !isEliminated && onSelect;

  return (
    <Card
      key={id}
      className={cn(
        "flex items-center gap-3 p-2 cursor-pointer transition-all border border-gray-200 rounded-md",
        isSelected ? "bg-green-200 dark:bg-green-700 border-green-500" : "hover:bg-gray-100 dark:hover:bg-gray-800",
        isEliminated && "opacity-50 cursor-not-allowed border-red-500 line-through text-red-500"
      )}
      onClick={canSelect ? () => onSelect?.(id) : undefined}
    >
      <div className="flex items-center w-full">
        <Avatar className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={imageUrl || localImagePath}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/castaways/default.jpg";
            }}
          />
        </Avatar>
        <p className={cn("text-sm font-medium ml-3 whitespace-nowrap", isEliminated && "line-through text-red-500")}>
          {name}
        </p>
        {isSelected && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />} {/* Checkmark when selected */}
      </div>
    </Card>
  );
}

