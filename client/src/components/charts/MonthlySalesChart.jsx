import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../ui/card";
import { useTheme } from "../../contexts/ThemeContext";

const MonthlySalesChart = ({ data, title = "Monthly Sales Trend" }) => {
  const { theme } = useTheme();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="font-semibold text-card-foreground">{`Month: ${label}`}</p>
          <p className="text-primary">
            {`Sales: ${formatCurrency(payload[0].value)}`}
          </p>
          <p className="text-green-600">
            {`Units: ${payload[0].payload.units}`}
          </p>
          <p className="text-purple-600">
            {`Orders: ${payload[0].payload.orders}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const axisColor = theme === "dark" ? "#4a5568" : "#e5e7eb";
  const textColor = theme === "dark" ? "#e2e8f0" : "#374151";
  const primaryColor = theme === "dark" ? "#60a5fa" : "#3b82f6";
  const dotFillColor = theme === "dark" ? "#1a202c" : "#ffffff";

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={axisColor}
              className="opacity-30"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: textColor }}
              axisLine={{ stroke: axisColor }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: textColor }}
              axisLine={{ stroke: axisColor }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={primaryColor}
              strokeWidth={3}
              dot={{ fill: primaryColor, strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: primaryColor,
                strokeWidth: 2,
                fill: dotFillColor,
              }}
              className="drop-shadow-sm"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MonthlySalesChart;
