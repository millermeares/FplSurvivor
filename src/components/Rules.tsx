import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Rules() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Scoring</h2>
            <ul className="list-disc list-inside text-sm">
              <li>+1 point for winning a non-immunity challenge</li>
              <li>+1 point for finding an idol</li>
              <li>+1 point for playing an idol</li>
              <li>+1 point for being protected by an idol during tribal</li>
              <li>+2 points for winning immunity</li>
              <li>+1 point for each vote towards an exiled player</li>
              <li>-1 point for each vote received</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold">Player Selection</h2>
            <p className="text-sm">
              Each week, you will select one player. In future weeks, you will have the opportunity to choose a new player.
            </p>
          </div>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold">Loyalty Bonus</h2>
            <p className="text-sm">
              A loyalty multiplier applies to your weekly score based on consecutive weeks choosing the same player:
            </p>
            <p className="text-sm italic">
              Example: After picking the same player for 5 consecutive weeks, your weekly score is multiplied by 1.5x.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
