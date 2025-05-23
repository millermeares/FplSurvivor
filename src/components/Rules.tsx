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
              <li>+1 point for each jury vote received at Final Tribal Council</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold">Player Selection</h2>
            <p className="text-sm">
              Each week, you will select one castaway. In future weeks, you will have the opportunity to choose a new castaway.
            </p>
          </div>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold">Loyalty Bonus</h2>
            <p className="text-sm">
              If you pick the same castaway for 3 consecutive weeks, you will earn 1 bonus point.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
