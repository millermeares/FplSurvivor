"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CastawayEventsWithScoring } from "../StatsView";
import { SelectionResponse } from "../StandingsView";
import { calculateWeeklyScores } from "../stats/CastawayScoresByWeek";
import SelectionToolTip from "./StandingsToolTip";

interface StandingsTableProps {
  castawayEventsWithScoring: CastawayEventsWithScoring;
  activeSelections: SelectionResponse[];
}



const calculateStandings = (
  castawayEventsWithScoring: CastawayEventsWithScoring,
  activeSelections: SelectionResponse[]
) => {
  const standings: { user_id: string; user_name: string; weekly_scores: Record<number, number>; total: number; selections: Record<number, string[]> }[] = [];
  const { scores, castaways, weeks } = calculateWeeklyScores(castawayEventsWithScoring);
  const users: Record<string, { user_name: string; weekly_scores: Record<number, number>; total: number; selections: Record<number, string[]> }> = {};

  activeSelections.forEach((selection) => {
    const season = 48; // Assuming season is fixed for now
    const key = `${season}-${selection._fk_week_id}-${selection.castaway_id}`;
    const points = scores[key] || 0;
    const castawayName = castaways[selection.castaway_id]!!
    const finalPoints = selection.is_captain ? points * 2 : points; // Captains get double points

    if (!users[selection.user_id]) {
      users[selection.user_id] = { user_name: selection.user_name, weekly_scores: {}, total: 0, selections: {} };
    }

    // Add points to weekly scores
    users[selection.user_id].weekly_scores[selection._fk_week_id] =
      (users[selection.user_id].weekly_scores[selection._fk_week_id] || 0) + finalPoints;

    // Track total score
    users[selection.user_id].total += finalPoints;

    // Store selection details
    if (!users[selection.user_id].selections[selection._fk_week_id]) {
      users[selection.user_id].selections[selection._fk_week_id] = [];
    }
    users[selection.user_id].selections[selection._fk_week_id].push(`${castawayName}${selection.is_captain ? " (C)" : ""}`);
  });

  // Convert users object into sorted standings array
  Object.entries(users)
    .sort(([, a], [, b]) => b.total - a.total) // Sort by total descending
    .forEach(([user_id, data]) => {
      standings.push({ user_id, ...data });
    });
  console.log(weeks)
  const week_nums = Array.from(weeks).map(w => w.split("-")[1]).map(Number)
  return { standings, weeks: week_nums };
};

const StandingsTable: React.FC<StandingsTableProps> = ({ castawayEventsWithScoring, activeSelections }) => {
  const { standings, weeks } = calculateStandings(castawayEventsWithScoring, activeSelections);
  console.log(weeks)
  return (
    <Card className="p-4 overflow-x-auto">
      <h2 className="text-sm font-semibold mb-1">Standings</h2>
      <div className="min-w-max">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-2 py-1 text-left">User</th>
              {weeks.map((week) => (
                <th key={week} className="px-2 py-1 text-center">W{week}</th>
              ))}
              <th className="px-2 py-1 text-center font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(({ user_id, user_name, weekly_scores, total, selections }) => (
              <tr key={user_id} className="border-t text-center">
                <td className="px-2 py-1 text-left font-medium">{user_name}</td>
                {weeks.map((week) => (
                  <td key={`${user_id}-${week}`} className="px-2 py-1">
                    <SelectionToolTip score={weekly_scores[week] || 0} selections={selections[week] || []} />
                  </td>
                ))}
                <td className="px-2 py-1 font-bold">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};


export default StandingsTable;
