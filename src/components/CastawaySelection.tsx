"use client";

import { useState } from "react";
import axios from "axios";
import CastawaySelectionRow from "./CastawaySelectionRow";
import { CastawayWithSelection, Week } from "./CastawayView";
import Link from 'next/link'

export interface CastawaySelectionProps {
  castaways: CastawayWithSelection[];
  week: Week;
}

export default function CastawaySelection({ castaways, week }: CastawaySelectionProps) {
  const [selected, setSelected] = useState<string | null>(
    castaways.find((castaway) => castaway.selection_id !== null)?.id || null
  );
  const [submitting, setSubmitting] = useState(false);

  const onSelect = async (id: string) => {
    if (submitting || selected === id) return;

    setSubmitting(true);
    try {
      await axios.post("/api/proxy", {
        path: "setSelections",
        body: {
          week: week.episode_number,
          castaways: [{ castawayId: id, isCaptain: false }],
        },
      });
      setSelected(id);
    } catch (error) {
      console.error("Error setting castaway", error);
    } finally {
      setSubmitting(false);
    }
  };
  const rulesLink = (
    <Link href="/account" className="text-blue-500 hover:underline">scoring</Link>
  )

  return (
    <div className="max-w-md mx-auto space-y-2">
      <h2 className="text-lg font-semibold text-center">Select a Castaway for Week {week.episode_number} ({rulesLink})</h2>
      <div className="text-center text-green-600 font-medium">
        {selected && `You have selected ${castaways.find(c => c.id === selected)?.name} for this week.`}
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
          />
        ))}
      </div>
    </div>
  );
}
