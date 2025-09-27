import React from 'react';
import { Card } from './ui/card';

const SummaryCards = ({ summary }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (!summary) return null;

  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(summary.totalSales),
      icon: '💰',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Units Sold',
      value: formatNumber(summary.totalUnitsSold),
      icon: '📦',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
    },
    {
      title: 'Total Orders',
      value: formatNumber(summary.totalOrders),
      icon: '🛍️',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(summary.averageOrderValue),
      icon: '📊',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
    },
    {
      title: 'Best Performing Region',
      value: summary.bestPerformingRegion,
      icon: '🏆',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className={`p-4 ${card.color}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className="text-2xl opacity-80">
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
