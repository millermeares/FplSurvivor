"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CastawaySelection from "./castaways/CastawaySelection";
import LockedCastaway from "./castaways/LockedCastaway";
import ProtectedPage from "./ProtectedPage";
import { Skeleton } from "@/components/ui/skeleton";

export interface Week {
  episode_number: string; // Updated to string since it's in timestamp format
  season: number;
  lock_time: string; // timestamp
}

export interface Castaway {
  id: string;
  name: string;
  image_url: string | null;
}

export interface CastawayWithSelection extends Castaway {
  _fk_week_eliminated: number | null;
  selection_id: string | null;
  is_captain: boolean | null;
  created_at: string | null;
  removed_at: string | null;
}

export default function CastawayView() {
  const [castaways, setCastaways] = useState<CastawayWithSelection[]>([]);
  const [activeSelections, setActiveSelections] = useState<CastawayWithSelection[]>([])
  const [week, setWeek] = useState<Week | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCastaways = async () => {
      try {
        const [castawaysResponse, selectionsResponse] = await Promise.all([
          axios.post("/api/proxy", { path: "castawaysWithSelections" }),
          axios.post("/api/proxy", { path: "selectionsForUser" }),
        ]);

        setCastaways(castawaysResponse.data.castaways);
        setWeek(castawaysResponse.data.week);
        setActiveSelections(selectionsResponse.data)
      } catch (error) {
        console.error("Error fetching castaways:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCastaways();
  }, []);

  if (loading) {
    return (
      <ProtectedPage>
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </ProtectedPage>
    );
  }

  const now = new Date();
  const episodeTime = new Date(week!!.lock_time.replace(" ", "T"))
  const isLocked = now > episodeTime
  return (
    <ProtectedPage>
      {isLocked ? (
        <LockedCastaway castaways={castaways} week={week!!} />
      ) : (
        <CastawaySelection castaways={castaways} week={week!!} activeSelections={activeSelections} />
      )}
    </ProtectedPage>
  );
}
