"use client";

import React, { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface SelectionTooltipProps {
  score: number;
  selections: string[];
}

const SelectionToolTip: React.FC<SelectionTooltipProps> = ({ score, selections }) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <span
            className="font-medium cursor-pointer underline decoration-dotted hover:bg-gray-100 px-1 rounded transition"
            onClick={(e) => {
              e.stopPropagation(); // Prevents immediate closing
              setOpen((prev) => !prev);
            }}
          >
            {score}
          </span>
        </TooltipTrigger>
        {open && (
          <TooltipContent className="text-sm p-2">
            <p className="font-semibold">Selections:</p>
            {selections.length > 0 ? (
              <ul className="mt-1">
                {selections.map((selection, index) => (
                  <li key={index} className="text-gray-600">• {selection}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No selections</p>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default SelectionToolTip;
