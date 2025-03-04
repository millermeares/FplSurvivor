"use client";

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CastawaySelectionRowProps {
  id: string;
  name: string;
  imageUrl: string | null;
  isSelected: boolean;
  onSelect?: (id: string) => void; // Make optional to handle disabled state
}

export default function CastawaySelectionRow({
  id,
  name,
  imageUrl,
  isSelected,
  onSelect,
}: CastawaySelectionRowProps) {
  return (
    <Card
      key={id}
      className={cn(
        "flex items-center gap-3 p-2 cursor-pointer transition-all border border-gray-200 rounded-md",
        isSelected ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800",
        !onSelect && "opacity-50 cursor-not-allowed" // Disabled style
      )}
      onClick={onSelect ? () => onSelect(id) : undefined} // Prevent clicks when disabled
    >
      <div className="flex items-center w-full">
        <Avatar className="w-8 h-8 rounded-full overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-sm">🏝️</span>
          )}
        </Avatar>
        <p className="text-sm font-medium ml-3 whitespace-nowrap">{name}</p>
      </div>
    </Card>
  );
}
