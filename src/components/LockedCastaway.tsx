"use client";

import { CastawayWithSelection } from "./CastawaySelection";

export default function LockedCastaway({ week, castaways }: { week: any, castaways: CastawayWithSelection[]}) {
  const selectedCastaways = castaways.filter(castaway => castaway.selection_id != null)
  const selectionMessage = selectedCastaways.length > 0 ? `You selected ${selectedCastaways[0].name}` : "You did not pick anyone."

  return (
    <div className="max-w-md mx-auto space-y-2">
      <h2 className="text-lg font-semibold text-center">Selections Locked</h2>
      <p className="text-center text-gray-500">
        The selection window for Week {week.episode_number} has closed. {selectionMessage}
      </p>

      <p> You chose</p>
    </div>
  );
}
