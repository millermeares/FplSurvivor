"use client";

import React, { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface TooltipDisplayProps {
  score: number;
  title: string;
  items: string[];
  emptyMessage: string;
}

const TooltipDisplay: React.FC<TooltipDisplayProps> = ({ score, title, items, emptyMessage }) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <span
            className="font-medium cursor-pointer underline decoration-dotted hover:bg-gray-100 px-1 rounded transition"
            onClick={(e) => {
              e.stopPropagation(); // Prevents closing immediately
              setOpen((prev) => !prev);
            }}
          >
            {score}
          </span>
        </TooltipTrigger>
        {open && (
          <TooltipContent className="text-sm p-2">
            <p className="font-semibold">{title}</p>
            {items.length > 0 ? (
              <ul className="mt-1">
                {items.map((item, index) => (
                  <li key={index} className="text-gray-600">• {item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{emptyMessage}</p>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipDisplay;
