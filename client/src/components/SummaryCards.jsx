import React from "react";
import { Card } from "./ui/card";
import { useTheme } from "../contexts/ThemeContext";

const SummaryCards = ({ summary }) => {
  const { theme } = useTheme();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  if (!summary) return null;

  const cards = [
    {
      title: "Total Sales",
      value: formatCurrency(summary.totalSales),
      icon: "💰",
      color:
        theme === "dark"
          ? "bg-blue-900/30 border-blue-700/50"
          : "bg-blue-50 border-blue-200",
      textColor: theme === "dark" ? "text-blue-300" : "text-blue-700",
    },
    {
      title: "Total Units Sold",
      value: formatNumber(summary.totalUnitsSold),
      icon: "📦",
      color:
        theme === "dark"
          ? "bg-green-900/30 border-green-700/50"
          : "bg-green-50 border-green-200",
      textColor: theme === "dark" ? "text-green-300" : "text-green-700",
    },
    {
      title: "Total Orders",
      value: formatNumber(summary.totalOrders),
      icon: "🛍️",
      color:
        theme === "dark"
          ? "bg-purple-900/30 border-purple-700/50"
          : "bg-purple-50 border-purple-200",
      textColor: theme === "dark" ? "text-purple-300" : "text-purple-700",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(summary.averageOrderValue),
      icon: "📊",
      color:
        theme === "dark"
          ? "bg-orange-900/30 border-orange-700/50"
          : "bg-orange-50 border-orange-200",
      textColor: theme === "dark" ? "text-orange-300" : "text-orange-700",
    },
    {
      title: "Best Performing Region",
      value: summary.bestPerformingRegion,
      icon: "🏆",
      color:
        theme === "dark"
          ? "bg-yellow-900/30 border-yellow-700/50"
          : "bg-yellow-50 border-yellow-200",
      textColor: theme === "dark" ? "text-yellow-300" : "text-yellow-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className={`p-4 ${card.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className="text-2xl opacity-80">{card.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
