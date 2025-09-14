import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Define the interface for mortgage rate performance data
interface MortgageRateData {
  rateRange: string;
  offeredCount: number;
  acceptedCount: number;
  acceptanceRate: number;
}

// Mock data for development (fallback) - Based on 4 customers total
const mockRateData = [
  { rateRange: '5-6%', offeredCount: 1, acceptedCount: 1, acceptanceRate: 100.0 },
  { rateRange: '6-7%', offeredCount: 2, acceptedCount: 1, acceptanceRate: 50.0 },
  { rateRange: '7-8%', offeredCount: 1, acceptedCount: 0, acceptanceRate: 0.0 },
];

const mockTrendData = [
  { month: 'Jan', '5-6%': 68, '6-7%': 62, '7-8%': 48 },
  { month: 'Feb', '5-6%': 71, '6-7%': 65, '7-8%': 52 },
  { month: 'Mar', '5-6%': 69, '6-7%': 67, '7-8%': 55 },
  { month: 'Apr', '5-6%': 73, '6-7%': 69, '7-8%': 58 },
  { month: 'May', '5-6%': 75, '6-7%': 71, '7-8%': 60 },
  { month: 'Jun', '5-6%': 71, '6-7%': 65, '7-8%': 52 },
];

const MortgageRatePerformance: React.FC = () => {
  // Temporarily use mock data to avoid type inference issues
  // TODO: Re-enable Convex query once type issues are resolved
  // const rateData = useQuery(api.queries.getMortgageRatePerformance) as MortgageRateData[] | undefined;
  
  const retentionByRate = useMemo(() => [
    { rate: '5-6%', retention: 94.2 },
    { rate: '6-7%', retention: 89.7 },
    { rate: '7-8%', retention: 76.3 },
  ], []);

  // Use mock data for now
  const displayRateData: MortgageRateData[] = mockRateData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage Rate Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Offered vs Accepted Rates */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Rates Offered vs Accepted</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={displayRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rateRange" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="offeredCount" fill="#3b82f6" name="Offered" />
                <Bar dataKey="acceptedCount" fill="#10b981" name="Accepted" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Acceptance Rate Trend */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Acceptance Rate Trends</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="5-6%" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="6-7%" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="7-8%" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Retention by Rate */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Customer Retention by Mortgage Rate</h4>
          <div className="grid grid-cols-3 gap-4">
            {retentionByRate.map((item) => (
              <div key={item.rate} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{item.retention}%</div>
                <div className="text-sm text-gray-600">{item.rate} Rate Range</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MortgageRatePerformance;
