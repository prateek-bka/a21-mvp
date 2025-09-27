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

  // Table functionality state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterText, setFilterText] = useState("");

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
        // Reset table state when new data is loaded
        setCurrentPage(1);
        setFilterText("");
        setSortConfig({ key: null, direction: "asc" });
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

  // Table functionality functions
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleFilter = (value) => {
    setFilterText(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Filter data based on search text
  const filteredData = csvData.filter((row) => {
    if (!filterText) return true;
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Sort filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle different data types
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    if (aString < bString) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aString > bString) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Paginate sorted data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-6 bg-destructive/10 border-destructive/20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Error Loading Data
            </h2>
            <p className="text-destructive/80 mb-4">{error}</p>
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
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
        <h1 className="text-3xl font-bold text-foreground">
          Sales Analytics Dashboard
        </h1>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales by Region Bar Chart */}
          <SalesBarChart
            data={analyticsData.charts.salesByRegion}
            title="Sales Performance by Region"
          />

          {/* Category Donut Chart */}
          <CategoryDonutChart
            data={analyticsData.charts.salesByCategory}
            title="Sales Distribution by Category"
          />

          {/* Monthly Sales Trend Chart */}
          <MonthlySalesChart
            data={analyticsData.charts.monthlySalesTrend}
            title="Monthly Sales Trend"
          />
        </div>
      )}

      {/* CSV Data Table Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Raw Data Table
          </h2>
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            {showTable ? "Hide Table" : "Show Table"}
          </button>
        </div>

        {showTable && csvData.length > 0 && (
          <div className="space-y-4">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search in all columns..."
                  value={filterText}
                  onChange={(e) => handleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">
                    Rows per page:
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-border rounded text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, sortedData.length)} of{" "}
                  {sortedData.length} records
                  {filteredData.length !== csvData.length &&
                    ` (filtered from ${csvData.length})`}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-muted/50">
                    {Object.keys(csvData[0] || {}).map((header) => (
                      <th
                        key={header}
                        onClick={() => handleSort(header)}
                        className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border cursor-pointer hover:bg-muted/30 select-none"
                      >
                        <div className="flex items-center gap-1">
                          {header}
                          <div className="flex flex-col">
                            <span
                              className={`text-xs ${
                                sortConfig.key === header &&
                                sortConfig.direction === "asc"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              ▲
                            </span>
                            <span
                              className={`text-xs ${
                                sortConfig.key === header &&
                                sortConfig.direction === "desc"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              ▼
                            </span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr key={startIndex + index} className="hover:bg-muted/30">
                      {Object.values(row).map((value, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-3 text-sm text-foreground border-b border-border"
                        >
                          {typeof value === "number" &&
                          cellIndex ===
                            Object.keys(row).findIndex(
                              (k) => k === "SalesAmount"
                            )
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm bg-background border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:bg-muted/50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm bg-background border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {showTable && csvData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No CSV data available
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
