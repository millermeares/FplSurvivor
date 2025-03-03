"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface Castaway {
  id: string;
  name: string;
  season: number;
  image_url: string | null;
  _fk_week_eliminated: number | null;
}

export default function CastawaySelection() {
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCastaways = async () => {
      try {
        const response = await axios.post("/api/proxy", {
          path: "castaways", // Dynamic API path
          body: { /* Optional request body */ }
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

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-semibold text-center">Select a Castaway</h2>
      <Separator />
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        castaways.map((castaway) => (
          <Card
            key={castaway.id}
            className={cn(
              "flex items-center gap-4 p-4 cursor-pointer transition-all",
              selected === castaway.id ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            onClick={() => handleSelect(castaway.id)}
          >
            <Avatar>
              {castaway.image_url ? (
                <img src={castaway.image_url} alt={castaway.name} />
              ) : (
                <span className="text-gray-500">🏝️</span>
              )}
            </Avatar>
            <CardContent className="p-0">
              <p className="text-sm font-medium">{castaway.name}</p>
              <p className="text-xs text-gray-500">Season {castaway.season}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
