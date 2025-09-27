import React, { useState, useEffect } from "react";
import SummaryCards from "../components/SummaryCards";
import SalesBarChart from "../components/charts/SalesBarChart";
import CategoryDonutChart from "../components/charts/CategoryDonutChart";
import MonthlySalesChart from "../components/charts/MonthlySalesChart";
import { Card } from "../components/ui/card";

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/data-summary");
      const result = await response.json();

      if (response.ok) {
        setAnalyticsData({
          summary: result.summary,
          charts: result.charts,
        });
        setCsvData(result.csvData.data || []);
      } else {
        setError(result.message || "Failed to fetch analytics data");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Error Loading Data
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Sales Analytics Dashboard
        </h1>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      {analyticsData?.summary && (
        <SummaryCards summary={analyticsData.summary} />
      )}

      {/* Charts Section */}
      {analyticsData?.charts && (
        <div className="space-y-6">
          {/* Sales by Region Bar Chart */}
          <SalesBarChart
            data={analyticsData.charts.salesByRegion}
            title="Sales Performance by Region"
          />

          {/* Category and Monthly Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryDonutChart
              data={analyticsData.charts.salesByCategory}
              title="Sales Distribution by Category"
            />
            <MonthlySalesChart
              data={analyticsData.charts.monthlySalesTrend}
              title="Monthly Sales Trend"
            />
          </div>
        </div>
      )}

      {/* CSV Data Table Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Raw Data Table
          </h2>
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            {showTable ? "Hide Table" : "Show Table"}
          </button>
        </div>

        {showTable && csvData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  {Object.keys(csvData[0] || {}).map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 100).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 text-sm text-gray-900 border-b"
                      >
                        {typeof value === "number" &&
                        cellIndex ===
                          Object.keys(row).findIndex((k) => k === "SalesAmount")
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(value)
                          : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 100 && (
              <div className="mt-4 text-center text-gray-600">
                Showing first 100 rows of {csvData.length} total records
              </div>
            )}
          </div>
        )}

        {showTable && csvData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No CSV data available
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
