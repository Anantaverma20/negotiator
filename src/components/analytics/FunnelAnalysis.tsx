import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Define the interface for funnel analysis data
interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
  dropoffRate?: number;
}

// Mock data for development (fallback) - Based on 4 customers total
const mockFunnelData = [
  { stage: 'Background Check', count: 4, dropoffRate: 0, percentage: 100 },
  { stage: 'Credit Check', count: 4, dropoffRate: 0, percentage: 100 },
  { stage: 'Rate Proposal', count: 3, dropoffRate: 25, percentage: 75 },
  { stage: 'Negotiation', count: 3, dropoffRate: 0, percentage: 75 },
  { stage: 'Final Confirmation', count: 3, dropoffRate: 0, percentage: 75 },
  { stage: 'Completed', count: 3, dropoffRate: 0, percentage: 75 }
];

const FunnelAnalysis: React.FC = () => {
  // Temporarily use mock data to avoid type inference issues
  // TODO: Re-enable Convex query once type issues are resolved
  // const funnelData = useQuery(api.queries.getFunnelAnalysis);
  
  // Use mock data for now
  const displayFunnelData: FunnelData[] = mockFunnelData;

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Background Check': return 'bg-blue-500';
      case 'Credit Check': return 'bg-green-500';
      case 'Rate Proposal': return 'bg-yellow-500';
      case 'Negotiation': return 'bg-orange-500';
      case 'Final Confirmation': return 'bg-red-500';
      case 'Completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDropoffColor = (rate: number) => {
    if (rate === 0) return 'text-gray-500';
    if (rate < 15) return 'text-green-600';
    if (rate < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Drop-off Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel Visualization */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Customer Journey Funnel</h4>
            <div className="space-y-3">
              {displayFunnelData.map((stage: FunnelData, index: number) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                    <span className="text-sm text-gray-500">{stage.count} customers</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className={`h-8 rounded-full ${getStageColor(stage.stage)} flex items-center justify-center text-white text-sm font-medium`}
                      style={{ width: `${stage.percentage}%` }}
                    >
                      {stage.percentage}%
                    </div>
                  </div>
                  {index > 0 && stage.dropoffRate !== undefined && (
                    <div className="text-xs text-right mt-1">
                      <span className={`font-medium ${getDropoffColor(stage.dropoffRate)}`}>
                        -{stage.dropoffRate}% drop-off
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Drop-off Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Drop-off Rates by Stage</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayFunnelData.slice(1)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="stage" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="dropoffRate" fill="#ef4444" name="Drop-off Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-600">Total Started</div>
            <div className="text-2xl font-bold text-blue-900">4</div>
            <div className="text-xs text-blue-700">Background checks</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-600">Completed</div>
            <div className="text-2xl font-bold text-green-900">3</div>
            <div className="text-xs text-green-700">75% completion rate</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-red-600">Only Drop-off</div>
            <div className="text-2xl font-bold text-red-900">25%</div>
            <div className="text-xs text-red-700">Rate Proposal stage</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-600">Customers Lost</div>
            <div className="text-2xl font-bold text-purple-900">1</div>
            <div className="text-xs text-purple-700">Out of 4 total</div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Key Insights</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Single drop-off occurs at Rate Proposal stage (25%)</li>
            <li>• Strong performance in Credit Check and Background Check (0% drop-off)</li>
            <li>• Overall conversion rate from start to completion is 75%</li>
            <li>• Once customers reach negotiation, they tend to complete the process</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelAnalysis;
