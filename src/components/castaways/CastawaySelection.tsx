"use client";

import { useState } from "react";
import axios from "axios";
import CastawaySelectionRow from "./CastawaySelectionRow";
import { CastawayWithSelection, Week } from "../CastawayView";
import Link from "next/link";
import { alertError } from "@/lib/utils";

export interface CastawaySelectionProps {
  castaways: CastawayWithSelection[];
  week: Week;
  activeSelections: CastawayWithSelection[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CastawaySelection({ castaways, week, activeSelections }: CastawaySelectionProps) {
  const [selected, setSelected] = useState<string | null>(
    castaways.find((castaway) => castaway.selection_id !== null)?.id || null
  );
  const [submitting, setSubmitting] = useState(false);

  const onSelect = async (id: string) => {
    if (submitting || selected === id) return;

    setSubmitting(true);
    try {
      const response = await axios.post("/api/proxy", {
        path: "setSelections",
        body: {
          week: week.episode_number,
          castaways: [{ castawayId: id, isCaptain: false }],
        },
      });

      // Only update state if request succeeded
      if (response.status === 200 && response.data) {
        setSelected(id);
      } else {
        alertError()
        console.error("API response invalid:", response);
      }
    } catch (error) {
      alertError();
      console.error("Error setting castaway:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const rulesLink = (
    <Link href="/account" className="text-blue-500 hover:underline">
      scoring
    </Link>
  );

  return (
    <div className="max-w-md mx-auto space-y-2">
      <h2 className="text-lg font-semibold text-center">
        Select a Castaway for Week {week.episode_number} ({rulesLink})  
        <span className="block text-gray-500 text-sm">
          Week {week.episode_number} picks lock at {new Date(week.lock_time).toLocaleString()}
        </span>
      </h2>
      <div className="text-center font-medium">
        {selected 
          ? <span className="text-green-600">
              You have selected {castaways.find(c => c.id === selected)?.name} for this week.
            </span>
          : <span className="text-red-500">
              You have not selected anyone for this week.
            </span>
        }
      </div>

      <div className="space-y-1 overflow-auto">
        {castaways.map((castaway) => (
          <CastawaySelectionRow
            key={castaway.id}
            id={castaway.id}
            name={castaway.name}
            imageUrl={castaway.image_url}
            isSelected={selected === castaway.id}
            onSelect={submitting ? undefined : () => onSelect(castaway.id)}
            week_eliminated={castaway._fk_week_eliminated}
          />
        ))}
      </div>
    </div>
  );
}
