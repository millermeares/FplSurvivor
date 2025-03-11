"use client";

import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

// todo: do a mapping of db event_type keys to the human readable version
interface ScoreTooltipProps {
  score: number;
  events: string[];
}

const ScoreToolTip: React.FC<ScoreTooltipProps> = ({ score, events }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="font-medium cursor-pointer">{score}</span>
      </TooltipTrigger>
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
    </Tooltip>
  </TooltipProvider>
);

export default ScoreToolTip
