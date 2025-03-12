"use client"

import { CastawayEventsWithScoring } from "../StatsView";
import React from "react";
import { Card } from "@/components/ui/card";
import TooltipDisplay from "../TooltipDisplay";

export const calculateWeeklyScores = (data: CastawayEventsWithScoring) => {
  const { events, scoring } = data;
  const scores: Record<string, number> = {};
  const castaways: Record<string, string> = {};
  const weeks: Set<string> = new Set();
  const totalScores: Record<string, number> = {};
  const scoreBreakdown: Record<string, string[]> = {}; // Track event types per castaway per week

  for (const event of events) {
    const { season, episode_number, castaway_id, castaway_name, event_type } = event;
    const non_null_event_type = event_type || "";
    const key = `${season}-${episode_number}-${castaway_id}`;
    
    const points = scoring[non_null_event_type] || 0;
    scores[key] = (scores[key] || 0) + points;

    castaways[castaway_id] = castaway_name;
    weeks.add(`${season}-${episode_number}`);

    // Track total score per castaway
    totalScores[castaway_id] = (totalScores[castaway_id] || 0) + points;

    // Track score breakdown
    if (!scoreBreakdown[key]) scoreBreakdown[key] = [];
    if (non_null_event_type) scoreBreakdown[key].push(`${event_type} (${points > 0 ? '+' : ''}${points})`);
  }

  return { scores, castaways, weeks: Array.from(weeks).sort(), totalScores, scoreBreakdown };
};


const CastawayScoresByWeek: React.FC<{ data: CastawayEventsWithScoring }> = ({ data }) => {
  const { scores, castaways, weeks, totalScores, scoreBreakdown } = calculateWeeklyScores(data);

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
              <th className="p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(castaways).map(([castawayId, castawayName]) => (
              <tr key={castawayId} className="border-t text-center text-sm">
                <td className="p-2 text-left font-semibold">{castawayName}</td>
                {weeks.map((week) => {
                  const key = `${week}-${castawayId}`;
                  const score = scores[key] || 0;
                  const events = scoreBreakdown[key] || [];

                  return (
                    <td key={key} className="p-2">
                      <TooltipDisplay score={score} title={`Total: ${score}`} items={events} emptyMessage="No events" />
                    </td>
                  );
                })}
                <td className="p-2 font-bold">{totalScores[castawayId] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CastawayScoresByWeek;