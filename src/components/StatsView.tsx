"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProtectedPage from "./ProtectedPage";
import { Skeleton } from "@/components/ui/skeleton";
import CastawayScoresByWeek from "./stats/CastawayScoresByWeek";


export interface CastawayEventsWithScoring {
  events: CastawayEvent[],
  scoring: Record<string, number>
}

export interface CastawayEvent {
  castaway_id: string;       
  castaway_name: string;     
  season: number;            
  episode_number: number;  
  event_type: string | null; // Event type (can be null if no event for that week)
  created_at: string | null; // Timestamp when the event was created (nullable)
}
export default function StatsView() {
  const [loading, setLoading] = useState(true);
  const [castawayEventsWithScoring, setCastawayEventsWithScoring] = useState<CastawayEventsWithScoring | null>(null);

  useEffect(() => {
    const fetchCastaways = async () => {
      try {
        const response = await axios.post("/api/proxy", {
          path: "eventsWithScoring",
        });
        setCastawayEventsWithScoring(response.data)
      } catch (error) {
        console.error("Error fetching castaway events:", error);
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


  return (
    <ProtectedPage>
      <CastawayScoresByWeek data={castawayEventsWithScoring!!} />
    </ProtectedPage>
  );
}
