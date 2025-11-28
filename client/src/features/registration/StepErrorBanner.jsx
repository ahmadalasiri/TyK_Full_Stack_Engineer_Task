import React from "react";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { AlertCircle } from "lucide-react";

export function StepErrorBanner({ stepError }) {
  if (!stepError) {
    return null;
  }

  return (
    <Card className="border-destructive bg-destructive/10">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            {Array.isArray(stepError) ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                {stepError.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-destructive">{stepError}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
