import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import MortgageRatePerformance from './analytics/MortgageRatePerformance';
import PromotionalEffectiveness from './analytics/PromotionalEffectiveness';
import CustomerSegmentation from './analytics/CustomerSegmentation';
import NegotiationImpact from './analytics/NegotiationImpact';
import FunnelAnalysis from './analytics/FunnelAnalysis';
import ExportControls from './ExportControls';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mortgage Rate Negotiator Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive analytics dashboard for mortgage rate performance and customer insights
          </p>
        </div>

        {/* Export Controls */}
        <div className="mb-6">
          <ExportControls />
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Mortgage Rate Performance */}
          <div className="lg:col-span-2">
            <MortgageRatePerformance />
          </div>

          {/* Promotional Effectiveness */}
          <PromotionalEffectiveness />

          {/* Customer Segmentation */}
          <CustomerSegmentation />

          {/* Negotiation Impact */}
          <div className="lg:col-span-2">
            <NegotiationImpact />
          </div>

          {/* Funnel Analysis */}
          <div className="lg:col-span-2">
            <FunnelAnalysis />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

