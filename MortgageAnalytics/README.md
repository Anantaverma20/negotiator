# Mortgage Rate Negotiator Analytics Dashboard

A comprehensive React-based analytics dashboard for monitoring mortgage rate performance, customer interactions, and business outcomes.

## Features

### 📊 Analytics Sections

1. **Mortgage Rate Performance**
   - Chart of mortgage rates offered vs. accepted rates
   - Trendline of acceptance rate per rate bucket (5–6%, 6–7%, 7–8%)
   - KPI: Customer retention by mortgage rate

2. **Promotional Offer Effectiveness**
   - Bar chart comparing acceptance rates of different promotional offers
   - Table showing which promotions work best for high-loyalty vs low-loyalty customers

3. **Customer Segmentation Analysis**
   - Segment by: first-time buyer, assets owned, loyalty rating
   - Heatmap/table of deals accepted by segment

4. **Negotiation Strategy Impact**
   - Funnel visualization of how negotiation rounds affect success rate
   - KPI: Average % discount given vs. final acceptance

5. **Funnel Drop-off Analysis**
   - Step-by-step funnel (Background check → Credit check → Rate proposal → Negotiation → Final confirmation)
   - Chart showing where most customers drop off

6. **Reporting & Export**
   - Button to export dashboard data as CSV
   - Option to email a snapshot report (integrates with OpenAI API email agent)

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualizations
- **Backend**: Convex (for data storage and queries)
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   └── Card.tsx              # Reusable card components
│   ├── analytics/
│   │   ├── MortgageRatePerformance.tsx
│   │   ├── PromotionalEffectiveness.tsx
│   │   ├── CustomerSegmentation.tsx
│   │   ├── NegotiationImpact.tsx
│   │   └── FunnelAnalysis.tsx
│   ├── Dashboard.tsx             # Main dashboard layout
│   └── ExportControls.tsx        # CSV export and email reporting
├── types/
│   └── index.ts                  # TypeScript type definitions
├── lib/
│   └── utils.ts                  # Utility functions and mock data
├── App.tsx                       # Main app component
├── index.tsx                     # App entry point
└── index.css                     # Global styles with Tailwind
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the dashboard

### Building for Production

```bash
npm run build
```

## Data Integration

The dashboard is designed to integrate with Convex backend with the following assumed table structure:

- **customers**: Customer profiles with loyalty ratings, assets, etc.
- **offers**: Mortgage rate offers with promotional details
- **negotiations**: Negotiation rounds and outcomes
- **mortgages**: Final mortgage details and status tracking

## Features in Detail

### Responsive Design
- Mobile-first approach with responsive grid layouts
- Clean card-based design with rounded corners
- Consistent color scheme and typography

### Interactive Charts
- Hover tooltips for detailed data points
- Responsive charts that adapt to screen size
- Multiple chart types: bar charts, line charts, funnel visualizations

### Export Functionality
- CSV export for all dashboard data
- Email reporting integration ready for OpenAI API
- Print-friendly layouts

### Mock Data
Currently uses mock data for development and demonstration purposes. In production, this would be replaced with real Convex queries.

## Customization

The dashboard is modular and easily customizable:

- Add new analytics sections by creating components in `src/components/analytics/`
- Modify styling through Tailwind classes
- Update data processing logic in `src/lib/utils.ts`
- Add new chart types using Recharts components

## Performance Considerations

- Lazy loading for chart components
- Memoized calculations for data processing
- Optimized re-renders with React.memo where appropriate

## Future Enhancements

- Real-time data updates
- Advanced filtering and date range selection
- Custom dashboard layouts
- More detailed drill-down capabilities
- Integration with additional data sources

## License

This project is created for demonstration purposes.
