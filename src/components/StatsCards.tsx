import React from "react";
import { Card, CardContent } from "./ui/card";

export interface StatsCardItem {
  title: string;
  stats: string | number;
  style?: string;
  type?: "number" | "currency";
}

interface StatsCardsProps {
  items: StatsCardItem[];
  className?: string;
}


function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ items, className }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${className || ""}`}>
      {items.map((item, idx) => {
        let displayStats = item.stats;
        if (item.type === "currency" && typeof item.stats === "number") {
          displayStats = formatCurrency(item.stats);
        }
        return (
          <Card key={idx} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">{item.title}</p>
              <p className={"text-3xl " + (item.style || "text-gray-900")}>{displayStats}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
