# Mortgage Rate Negotiator

An AI-powered chat interface for mortgage rate negotiation built with Next.js, React, and TypeScript.

## 🚀 Features

- **Interactive Chat Interface**: Collects user financial information through a conversational UI
- **AI-Powered Negotiation**: Uses advanced prompts and state management for intelligent mortgage rate negotiation
- **Smart Input Formatting**: Automatically formats currency inputs and validates user data
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **TypeScript**: Full type safety throughout the application

## 🏗️ Tech Stack

- **Next.js 15** with App Router
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **AI-powered chat system**

## 📁 Project Structure

```
apps/web/
├── app/                    # Next.js app directory
│   ├── api/agent/         # API endpoints for chat handling
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── lib/                   # Utility functions and logic
│   ├── negotiation.ts     # Mortgage calculation logic
│   ├── prompts.ts         # AI prompts for negotiation
│   ├── rate.ts           # Rate calculation utilities
│   ├── state.ts          # State management
│   └── types.ts          # TypeScript type definitions
└── providers/            # React context providers
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   cd apps/web
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How It Works

1. **User Intake**: The chat interface collects essential financial information including:
   - Annual salary and income
   - Liquid assets and savings
   - First-time buyer status
   - Existing loans (vehicles, etc.)
   - Desired loan amount and down payment

2. **AI Analysis**: The system processes this information using intelligent prompts to:
   - Calculate optimal mortgage rates
   - Identify negotiation opportunities
   - Provide personalized recommendations

3. **Smart Negotiation**: The AI agent helps users:
   - Understand market rates
   - Prepare negotiation strategies
   - Optimize their financial position

## 🔧 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.
