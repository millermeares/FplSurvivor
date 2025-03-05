"use client";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedPage from "./ProtectedPage";
import CastawaySelectionRow from "./CastawaySelectionRow";

const WEEK_ID = 2
export interface Week {
  episode_number: number,
  season: number,
  lock_time: string // timestamp
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

function getSelectedCastawayIds(castaways: CastawayWithSelection[]): string[] {
  return castaways
    .filter(castaway => castaway.selection_id !== null) // Keep only selected castaways
    .map(castaway => castaway.id); // Extract their IDs
}


export default function CastawaySelection() {
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  function getCastawaysFromApiResponseBackwardsCompatible(response: AxiosResponse<any, any>) {
    if (response.data.castaways) {
      return response.data.castaways
    }
    return response.data
  }
  useEffect(() => {
    const fetchCastaways = async () => {
      try {
        const response = await axios.post("/api/proxy", {
          path: "castawaysWithSelections", 
          body: {
            week: WEEK_ID
          }
        });
        console.log(response)
        
        const castawaysFromResponse = getCastawaysFromApiResponseBackwardsCompatible(response)
        const selectedCastaways = getSelectedCastawayIds(castawaysFromResponse)
        setCastaways(castawaysFromResponse);
        setSelected(selectedCastaways[0])
      } catch (error) {
        console.error("Error fetching castaways:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCastaways();
  }, []);

  const onSelect = async (id: string) => {
    if (submitting || selected === id) return; // Prevent multiple rapid selections

    setSubmitting(true);
    try {
      const res = await axios.post("/api/proxy", {
        path: "setSelections",
        body: {
          week: WEEK_ID,
          castaways: [
            {
              castawayId: id,
              isCaptain: false,
            },
          ],
        },
      });
      console.log(res)

      setSelected(id);
    } catch (error) {
      console.error("Error setting castaway", error);
      // TODO: Handle error state (e.g., show an error message to the user)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedPage>
      <div className="max-w-md mx-auto space-y-2">
        <h2 className="text-lg font-semibold text-center">Select a Castaway (Week {WEEK_ID})</h2>
        {loading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="space-y-1 overflow-auto">
            {castaways.map((castaway) => (
              <CastawaySelectionRow
                key={castaway.id}
                id={castaway.id}
                name={castaway.name}
                imageUrl={castaway.image_url}
                isSelected={selected === castaway.id}
                onSelect={submitting ? undefined : () => onSelect(castaway.id)} // Disable while submitting
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}
