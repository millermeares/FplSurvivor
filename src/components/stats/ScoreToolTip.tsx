"use client";

import React, { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface ScoreTooltipProps {
  score: number;
  events: string[];
}

const ScoreToolTip: React.FC<ScoreTooltipProps> = ({ score, events }) => {
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
            <p className="font-semibold">Total: {score}</p>
            {events.length > 0 ? (
              <ul className="mt-1">
                {events.map((event, index) => (
                  <li key={index} className="text-gray-600">• {event}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No events</p>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScoreToolTip;
