"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedPage from "./ProtectedPage";
import CastawaySelectionRow from "./CastawaySelectionRow";

interface Castaway {
  id: string;
  name: string;
  image_url: string | null;
}
export default function CastawaySelection() {
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCastaways = async () => {
      try {
        const response = await axios.post("/api/proxy", {
          path: "castaways",
        });
        setCastaways(response.data);
      } catch (error) {
        console.error("Error fetching castaways:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCastaways();
  }, []);


  // todo: test what happens when you click a bunch of stuff rapidly. 
  const onSelect = (id: string) => {
    const setSelectionInDb = async () => {
      try {
        const response = await axios.post("/api/proxy", {
          path: "setSelections",
          body: {
            week: 2,
            castaways: [{
              castawayId: id,
              isCaptain: false
            }]
          }
        })
        console.log(response)
        // todo: if successful, set the color of the selected row to green?
      } catch (error) {
        console.error("Error setting castaway", error) // todo: handle
      } 
    }
    setSelectionInDb()
    setSelected(id)
  }

  return (
    <ProtectedPage>
      <div className="max-w-md mx-auto space-y-2">
        <h2 className="text-lg font-semibold text-center">Select a Castaway</h2>
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
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedPage>
  );
}
