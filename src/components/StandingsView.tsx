"use client";

import { act, useEffect, useState } from "react";
import axios from "axios";
import ProtectedPage from "./ProtectedPage";
import { Skeleton } from "@/components/ui/skeleton";
import { CastawayEventsWithScoring } from "./StatsView";
import StandingsTable from "./standings/StandingsTable";

export interface SelectionResponse {
  user_id: string;
  user_email: string;
  user_name: string;
  castaway_id: string;
  castaway_image_url?: string | null;
  selection_id: string;
  _fk_week_id: number;
  is_captain: boolean;
  created_at: string;
  removed_at: string;
}

export default function StandingsView() {
  const [loading, setLoading] = useState(true);
  const [castawayEventsWithScoring, setCastawayEventsWithScoring] =useState<CastawayEventsWithScoring | null>(null);
  const [activeSelections, setActiveSelections] = useState<SelectionResponse[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, selectionsResponse] = await Promise.all([
          axios.post("/api/proxy", { path: "eventsWithScoring" }),
          axios.post("/api/proxy", { path: "activeSelections" }),
        ]);
        setCastawayEventsWithScoring(eventsResponse.data);
        setActiveSelections(selectionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  return (
    <ProtectedPage>
      <StandingsTable
          castawayEventsWithScoring={castawayEventsWithScoring!!}
          activeSelections={activeSelections!!}
        />
    </ProtectedPage>
  )
}
