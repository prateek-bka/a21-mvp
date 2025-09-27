class DataAnalyzer {
  // Apply filters to data
  static applyFilters(data, filters) {
    if (!filters || typeof filters !== "object") {
      return data;
    }

    return data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === "") return true;

        const rowValue = row[key];
        if (!rowValue) return false;

        // Handle different filter types
        if (Array.isArray(value)) {
          // Multiple values (OR condition)
          return value.some((v) =>
            rowValue.toLowerCase().includes(v.toLowerCase()),
          );
        } else if (typeof value === "string") {
          // Single value (case-insensitive partial match)
          return rowValue.toLowerCase().includes(value.toLowerCase());
        }

        return rowValue === value;
      });
    });
  }

  // Apply search to data
  static applySearch(data, search) {
    if (!search || search.trim() === "") {
      return data;
    }

    const searchTerm = search.toLowerCase();
    return data.filter((row) => {
      return Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(searchTerm),
      );
    });
  }

  // Sort data
  static sortData(data, sortBy, sortOrder = "desc") {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      const aValue = parseFloat(a[sortBy]) || a[sortBy] || "";
      const bValue = parseFloat(b[sortBy]) || b[sortBy] || "";

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
      } else {
        const comparison = aValue.toString().localeCompare(bValue.toString());
        return sortOrder === "desc" ? -comparison : comparison;
      }
    });
  }

  // Get top products analysis
  static getTopProducts(
    data,
    metric = "SalesAmount",
    topCount = 5,
    sortOrder = "desc",
  ) {
    // Group by product and sum the metric
    const productSales = {};
    data.forEach((row) => {
      const product = row.Product;
      const value = parseFloat(row[metric]) || 0;

      if (!productSales[product]) {
        productSales[product] = {
          Product: product,
          Category: row.Category,
          TotalSalesAmount: 0,
          TotalUnitsSold: 0,
          OrderCount: 0,
        };
      }

      productSales[product].TotalSalesAmount +=
        parseFloat(row.SalesAmount) || 0;
      productSales[product].TotalUnitsSold += parseInt(row.UnitsSold) || 0;
      productSales[product].OrderCount += 1;
    });

    // Sort and get top products
    return Object.values(productSales)
      .sort((a, b) => {
        const aValue =
          metric === "SalesAmount" ? a.TotalSalesAmount : a.TotalUnitsSold;
        const bValue =
          metric === "SalesAmount" ? b.TotalSalesAmount : b.TotalUnitsSold;
        return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
      })
      .slice(0, topCount);
  }

  // Get sales trend analysis
  static getSalesTrend(data, groupBy = "month") {
    const salesTrend = {};

    data.forEach((row) => {
      const date = new Date(row.Date.split("-").reverse().join("-")); // Convert DD-MM-YYYY to YYYY-MM-DD
      let key;

      if (groupBy === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0",
        )}`;
      } else if (groupBy === "year") {
        key = date.getFullYear().toString();
      } else {
        key = row.Date;
      }

      if (!salesTrend[key]) {
        salesTrend[key] = {
          Period: key,
          TotalSalesAmount: 0,
          TotalUnitsSold: 0,
          OrderCount: 0,
          AverageSalesAmount: 0,
        };
      }

      salesTrend[key].TotalSalesAmount += parseFloat(row.SalesAmount) || 0;
      salesTrend[key].TotalUnitsSold += parseInt(row.UnitsSold) || 0;
      salesTrend[key].OrderCount += 1;
    });

    // Calculate averages and sort by period
    return Object.values(salesTrend)
      .map((item) => ({
        ...item,
        AverageSalesAmount:
          item.OrderCount > 0 ? item.TotalSalesAmount / item.OrderCount : 0,
      }))
      .sort((a, b) => a.Period.localeCompare(b.Period));
  }

  // Get region analysis
  static getRegionAnalysis(data) {
    const regionStats = {};

    data.forEach((row) => {
      const region = row.Region;

      if (!regionStats[region]) {
        regionStats[region] = {
          Region: region,
          TotalSalesAmount: 0,
          TotalUnitsSold: 0,
          OrderCount: 0,
          AverageSalesAmount: 0,
          TopProducts: {},
        };
      }

      regionStats[region].TotalSalesAmount += parseFloat(row.SalesAmount) || 0;
      regionStats[region].TotalUnitsSold += parseInt(row.UnitsSold) || 0;
      regionStats[region].OrderCount += 1;

      // Track top products per region
      const product = row.Product;
      if (!regionStats[region].TopProducts[product]) {
        regionStats[region].TopProducts[product] = 0;
      }
      regionStats[region].TopProducts[product] +=
        parseFloat(row.SalesAmount) || 0;
    });

    // Calculate averages and get top 3 products per region
    return Object.values(regionStats).map((region) => ({
      ...region,
      AverageSalesAmount:
        region.OrderCount > 0 ? region.TotalSalesAmount / region.OrderCount : 0,
      TopProducts: Object.entries(region.TopProducts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([product, sales]) => ({ Product: product, TotalSales: sales })),
    }));
  }

  // Generate comprehensive data summary
  static generateDataSummary(data, headers) {
    // Calculate total sales and units sold
    const totalSales = data.reduce(
      (sum, row) => sum + (parseFloat(row.SalesAmount) || 0),
      0,
    );
    const totalUnitsSold = data.reduce(
      (sum, row) => sum + (parseInt(row.UnitsSold) || 0),
      0,
    );

    // Calculate sales by region for bar chart
    const regionSales = {};
    data.forEach((row) => {
      const region = row.Region;
      const sales = parseFloat(row.SalesAmount) || 0;
      const units = parseInt(row.UnitsSold) || 0;

      if (!regionSales[region]) {
        regionSales[region] = { region, sales: 0, units: 0, orders: 0 };
      }
      regionSales[region].sales += sales;
      regionSales[region].units += units;
      regionSales[region].orders += 1;
    });

    const salesByRegionChart = Object.values(regionSales)
      .map((region) => ({
        name: region.region,
        sales: Math.round(region.sales * 100) / 100,
        units: region.units,
        orders: region.orders,
      }))
      .sort((a, b) => b.sales - a.sales);

    // Find best performing region
    const bestPerformingRegion = salesByRegionChart[0];

    // Calculate sales by category for donut chart
    const categorySales = {};
    data.forEach((row) => {
      const category = row.Category;
      const sales = parseFloat(row.SalesAmount) || 0;

      if (!categorySales[category]) {
        categorySales[category] = 0;
      }
      categorySales[category] += sales;
    });

    const salesByCategoryChart = Object.entries(categorySales)
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100,
        percentage: Math.round((value / totalSales) * 100 * 100) / 100,
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate monthly sales trend
    const monthlySales = {};
    data.forEach((row) => {
      // Convert DD-MM-YYYY to proper date
      const dateParts = row.Date.split("-");
      const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      const sales = parseFloat(row.SalesAmount) || 0;
      const units = parseInt(row.UnitsSold) || 0;

      if (!monthlySales[monthKey]) {
        monthlySales[monthKey] = {
          month: monthName,
          sales: 0,
          units: 0,
          orders: 0,
          sortKey: monthKey,
        };
      }
      monthlySales[monthKey].sales += sales;
      monthlySales[monthKey].units += units;
      monthlySales[monthKey].orders += 1;
    });

    const monthlySalesTrendChart = Object.values(monthlySales)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map((month) => ({
        month: month.month,
        sales: Math.round(month.sales * 100) / 100,
        units: month.units,
        orders: month.orders,
      }));

    // Prepare table data
    const csvTableData = data.map((row, index) => ({
      id: index + 1,
      ...row,
      SalesAmount: parseFloat(row.SalesAmount) || 0,
      UnitsSold: parseInt(row.UnitsSold) || 0,
    }));

    // Calculate additional metrics
    const averageOrderValue = totalSales / data.length;
    const totalOrders = data.length;

    return {
      summary: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalUnitsSold,
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        bestPerformingRegion: bestPerformingRegion?.name || "N/A",
      },
      charts: {
        salesByRegion: salesByRegionChart,
        salesByCategory: salesByCategoryChart,
        monthlySalesTrend: monthlySalesTrendChart,
      },
      csvData: {
        data: csvTableData,
        headers,
        totalRecords: csvTableData.length,
      },
    };
  }
}

module.exports = DataAnalyzer;
