import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Define the interface for negotiation impact data
interface NegotiationData {
  round: string | number;
  negotiations: number;
  accepted: number;
  acceptanceRate: number;
  avgDiscount: number;
}

// Mock data for development (fallback) - Based on 4 customers total
const mockNegotiationData = [
  { round: 1, totalNegotiations: 4, successfulNegotiations: 2, successRate: 50.0, averageDiscount: 0.15 },
  { round: 2, totalNegotiations: 2, successfulNegotiations: 1, successRate: 50.0, averageDiscount: 0.28 },
  { round: 3, totalNegotiations: 1, successfulNegotiations: 1, successRate: 100.0, averageDiscount: 0.42 },
  { round: 4, totalNegotiations: 0, successfulNegotiations: 0, successRate: 0, averageDiscount: 0 }
];

const mockDiscountAcceptanceData = [
  { discountRange: '0-0.2%', offers: 2, accepted: 1, acceptanceRate: 50.0 },
  { discountRange: '0.2-0.4%', offers: 1, accepted: 1, acceptanceRate: 100.0 },
  { discountRange: '0.4-0.6%', offers: 1, accepted: 1, acceptanceRate: 100.0 },
  { discountRange: '0.6%+', offers: 0, accepted: 0, acceptanceRate: 0 }
];

const NegotiationImpact: React.FC = () => {
  // Temporarily use mock data to avoid type inference issues
  // TODO: Re-enable Convex query once type issues are resolved
  // const negotiationData = useQuery(api.queries.getNegotiationImpact);
  
  // Use mock data for now
  const displayNegotiationData = mockNegotiationData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Negotiation Strategy Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel Visualization */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Negotiation Round Success Rates</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayNegotiationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="round" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successRate" fill="#10b981" name="Success Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Discount vs Acceptance */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Discount vs Final Acceptance</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={displayNegotiationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="round" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="averageDiscount" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Avg Discount %"
                />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Success Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-600">Total Negotiations</div>
            <div className="text-2xl font-bold text-blue-900">4</div>
            <div className="text-xs text-blue-700">Customers engaged</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-600">Overall Success Rate</div>
            <div className="text-2xl font-bold text-green-900">75%</div>
            <div className="text-xs text-green-700">3 out of 4 customers</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-600">Avg Discount Given</div>
            <div className="text-2xl font-bold text-purple-900">0.28%</div>
            <div className="text-xs text-purple-700">Successful deals</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-orange-600">Best Round</div>
            <div className="text-2xl font-bold text-orange-900">Round 3</div>
            <div className="text-xs text-orange-700">100% success rate</div>
          </div>
        </div>

        {/* Discount Range Analysis */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Acceptance Rate by Discount Range</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount Range
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Offers
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accepted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acceptance Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockDiscountAcceptanceData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.discountRange}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.offers}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.accepted}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.acceptanceRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NegotiationImpact;
