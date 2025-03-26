"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CastawayEventsWithScoring } from "../StatsView";
import { SelectionResponse } from "../StandingsView";
import { calculateWeeklyScores } from "../stats/CastawayScoresByWeek";
import TooltipDisplay from "../TooltipDisplay";

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
  const userWeeklyCastawayIds: Record<string, Record<number, string[]>> = {};

  activeSelections.forEach((selection) => {
    const season = 48;
    const key = `${season}-${selection._fk_week_id}-${selection.castaway_id}`;
    const points = scores[key] || 0;
    const castawayName = castaways[selection.castaway_id]!!;
    const finalPoints = selection.is_captain ? points * 2 : points;

    if (!users[selection.user_id]) {
      users[selection.user_id] = { user_name: selection.user_name, weekly_scores: {}, total: 0, selections: {} };
      userWeeklyCastawayIds[selection.user_id] = {};
    }

    if (!userWeeklyCastawayIds[selection.user_id][selection._fk_week_id]) {
      userWeeklyCastawayIds[selection.user_id][selection._fk_week_id] = [];
    }
    userWeeklyCastawayIds[selection.user_id][selection._fk_week_id].push(selection.castaway_id);

    users[selection.user_id].weekly_scores[selection._fk_week_id] =
      (users[selection.user_id].weekly_scores[selection._fk_week_id] || 0) + finalPoints;

    users[selection.user_id].total += finalPoints;

    if (!users[selection.user_id].selections[selection._fk_week_id]) {
      users[selection.user_id].selections[selection._fk_week_id] = [];
    }
    users[selection.user_id].selections[selection._fk_week_id].push(`${castawayName}${selection.is_captain ? " (C)" : ""}`);
  });

  // Add LOYALTY_BONUS
  Object.entries(userWeeklyCastawayIds).forEach(([user_id, weekToCastaways]) => {
    const weekNums = Object.keys(weekToCastaways).map(Number).sort((a, b) => a - b);
    const castawayWeekMap: Record<string, number[]> = {};

    for (const week of weekNums) {
      for (const castawayId of weekToCastaways[week]) {
        if (!castawayWeekMap[castawayId]) castawayWeekMap[castawayId] = [];
        castawayWeekMap[castawayId].push(week);
      }
    }

    for (const [, selectedWeeks] of Object.entries(castawayWeekMap)) {
      const sortedWeeks = selectedWeeks.sort((a, b) => a - b);
      let streak = 1;

      for (let i = 1; i < sortedWeeks.length; i++) {
        if (sortedWeeks[i] === sortedWeeks[i - 1] + 1) {
          streak++;
          const isEndOfStreak = i === sortedWeeks.length - 1 || sortedWeeks[i + 1] !== sortedWeeks[i] + 1;
          if (streak >= 3 && isEndOfStreak) {
            const bonusPoints = Math.floor(streak / 3);
            const bonusWeek = sortedWeeks[i];

            users[user_id].total += bonusPoints;
            users[user_id].weekly_scores[bonusWeek] = (users[user_id].weekly_scores[bonusWeek] || 0) + bonusPoints;

            if (!users[user_id].selections[bonusWeek]) {
              users[user_id].selections[bonusWeek] = [];
            }
            users[user_id].selections[bonusWeek].push(`LOYALTY BONUS: +${bonusPoints}`);
            streak = 1;
          }
        } else {
          streak = 1;
        }
      }
    }
  });

  Object.entries(users)
    .sort(([, a], [, b]) => b.total - a.total)
    .forEach(([user_id, data]) => {
      standings.push({ user_id, ...data });
    });

  const week_nums = Array.from(weeks).map(w => w.split("-")[1]).map(Number);
  return { standings, weeks: week_nums };
};


const StandingsTable: React.FC<StandingsTableProps> = ({ castawayEventsWithScoring, activeSelections }) => {
  const { standings, weeks } = calculateStandings(castawayEventsWithScoring, activeSelections);
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
                    <TooltipDisplay score={weekly_scores[week] || 0} title="Selections:" items={selections[week] || []} emptyMessage="No selections" />
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
