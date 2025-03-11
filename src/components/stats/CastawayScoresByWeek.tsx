"use client"

import { CastawayEventsWithScoring } from "../StatsView";
import React from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const calculateWeeklyScores = (data: CastawayEventsWithScoring) => {
  const { events, scoring } = data;
  const scores: Record<string, number> = {};
  const castaways: Record<string, string> = {}
  const weeks: Set<string> = new Set();

  for (const event of events) {
    const { season, episode_number, castaway_id, castaway_name, event_type } = event;
    // if (!event_type) continue;
    const non_null_event_type = event_type || ''
    const key = `${season}-${episode_number}-${castaway_id}`;
    scores[key] = (scores[key] || 0) + (scoring[non_null_event_type] || 0);

    castaways[castaway_id] = castaway_name;
    weeks.add(`${season}-${episode_number}`);
  }

  return { scores, castaways, weeks: Array.from(weeks).sort() };
};

const CastawayScoresByWeek: React.FC<{ data: CastawayEventsWithScoring }> = ({data}) => {
  const { scores, castaways, weeks } = calculateWeeklyScores(data);

  return (
    <Card className="p-4 overflow-x-auto">
      <div className="min-w-max">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="p-2 text-left">Castaway</th>
              {weeks.map((week) => (
                <th key={week} className="p-2 text-center whitespace-nowrap">W{week.split("-")[1]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(castaways).map(([castawayId, castawayName]) => (
              <tr key={castawayId} className="border-t text-center text-sm">
                <td className="p-2 text-left font-semibold">{castawayName}</td>
                {weeks.map((week) => {
                  const score = scores[`${week}-${castawayId}`] || 0;
                  return (
                    <td key={`${week}-${castawayId}`} className="p-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium cursor-pointer">{score}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Score: {score}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
export default CastawayScoresByWeek