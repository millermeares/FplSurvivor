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

const SEASON = 49;
const LOYALTY_STREAK_MIN = 3;

type UserStanding = {
  user_name: string;
  weekly_scores: Record<number, number>;
  total: number;
  selections: Record<number, string[]>;
};

const updateUserScoresAndSelections = (
  selection: SelectionResponse,
  users: Record<string, UserStanding>,
  userWeeklyCastawayIds: Record<string, Record<number, string[]>>,
  scores: Record<string, number>,
  castaways: Record<string, string>
) => {
  const { user_id, user_name, _fk_week_id, castaway_id, is_captain } = selection;
  const key = `${SEASON}-${_fk_week_id}-${castaway_id}`;
  const points = scores[key] || 0;
  const finalPoints = is_captain ? points * 2 : points;
  const castawayName = castaways[castaway_id] || "Selection hidden until lock.";

  if (!users[user_id]) {
    users[user_id] = {
      user_name,
      weekly_scores: {},
      total: 0,
      selections: {},
    };
  }
  users[user_id].weekly_scores[_fk_week_id] =
    (users[user_id].weekly_scores[_fk_week_id] || 0) + finalPoints;

  users[user_id].total += finalPoints;

  if (!users[user_id].selections[_fk_week_id]) {
    users[user_id].selections[_fk_week_id] = [];
  }
  users[user_id].selections[_fk_week_id].push(
    `${castawayName}${is_captain ? " (C)" : ""}`
  );

  if (!userWeeklyCastawayIds[user_id]) {
    userWeeklyCastawayIds[user_id] = {};
  }
  if (!userWeeklyCastawayIds[user_id][_fk_week_id]) {
    userWeeklyCastawayIds[user_id][_fk_week_id] = [];
  }
  userWeeklyCastawayIds[user_id][_fk_week_id].push(castaway_id);
};

const applyLoyaltyBonuses = (
  users: Record<string, UserStanding>,
  userWeeklyCastawayIds: Record<string, Record<number, string[]>>
) => {
  Object.entries(userWeeklyCastawayIds).forEach(([user_id, weekToCastaways]) => {
    const weekNums = Object.keys(weekToCastaways).map(Number).sort((a, b) => a - b);
    const castawayWeekMap: Record<string, number[]> = {};

    // Build castaway -> list of weeks they were selected
    for (const week of weekNums) {
      for (const castawayId of weekToCastaways[week]) {
        if (!castawayWeekMap[castawayId]) castawayWeekMap[castawayId] = [];
        castawayWeekMap[castawayId].push(week);
      }
    }

    // Apply loyalty bonuses
    for (const [, selectedWeeks] of Object.entries(castawayWeekMap)) {
      const sortedWeeks = selectedWeeks.sort((a, b) => a - b);
      let streakStartIndex = 0;

      for (let i = 1; i < sortedWeeks.length; i++) {
        if (sortedWeeks[i] === sortedWeeks[i - 1] + 1) {
          const weeksSinceStart = i - streakStartIndex + 1;
          if (weeksSinceStart % LOYALTY_STREAK_MIN === 0) {
            const bonusWeek =
              sortedWeeks[
                streakStartIndex +
                  LOYALTY_STREAK_MIN - 1 +
                  ((weeksSinceStart / LOYALTY_STREAK_MIN - 1) * LOYALTY_STREAK_MIN)
              ];
      
            users[user_id].total += 1;
            users[user_id].weekly_scores[bonusWeek] =
              (users[user_id].weekly_scores[bonusWeek] || 0) + 1;
            if (!users[user_id].selections[bonusWeek]) {
              users[user_id].selections[bonusWeek] = [];
            }
            users[user_id].selections[bonusWeek].push("LOYALTY BONUS: +1");
          }
        } else {
          streakStartIndex = i; // this is what actually controls the bonus logic
        }
      }      
    }
  });
};


const calculateStandings = (
  castawayEventsWithScoring: CastawayEventsWithScoring,
  activeSelections: SelectionResponse[]
) => {
  const { scores, castaways, weeks } = calculateWeeklyScores(castawayEventsWithScoring);

  const users: Record<string, UserStanding> = {};
  const userWeeklyCastawayIds: Record<string, Record<number, string[]>> = {};

  for (const selection of activeSelections) {
    updateUserScoresAndSelections(selection, users, userWeeklyCastawayIds, scores, castaways);
  }

  applyLoyaltyBonuses(users, userWeeklyCastawayIds);

  const standings = Object.entries(users)
    .sort(([, a], [, b]) => b.total - a.total)
    .map(([user_id, data]) => ({ user_id, ...data }));

  const week_nums = weeks.map((w) => Number(w.split("-")[1]));

  return { standings, weeks: week_nums };
};


const StandingsTable: React.FC<StandingsTableProps> = ({ castawayEventsWithScoring, activeSelections }) => {
  const { standings, weeks } = calculateStandings(castawayEventsWithScoring, activeSelections);
  const reversedWeeks = [...weeks].reverse(); // Don't mutate original weeks

  return (
    <Card className="p-4 overflow-x-auto">
      <h2 className="text-sm font-semibold mb-1">Standings</h2>
      <div className="min-w-max">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-2 py-1 text-left">User</th>
              <th className="px-2 py-1 text-center font-semibold">Total</th>
              {reversedWeeks.map((week) => (
                <th key={week} className="px-2 py-1 text-center">W{week}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map(({ user_id, user_name, weekly_scores, total, selections }) => (
              <tr key={user_id} className="border-t text-center">
                <td className="px-2 py-1 text-left font-medium">{user_name}</td>
                <td className="px-2 py-1 font-bold">{total}</td>
                {reversedWeeks.map((week) => (
                  <td key={`${user_id}-${week}`} className="px-2 py-1">
                    <TooltipDisplay
                      score={weekly_scores[week] || 0}
                      title="Selections:"
                      items={selections[week] || []}
                      emptyMessage="No selections"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};


export default StandingsTable;
