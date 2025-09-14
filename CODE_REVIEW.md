# Code Review Request

This commit is created to trigger a comprehensive code review of the entire mortgage negotiator application.

## Files to Review:

### Core Application Files:
- `apps/web/app/page.tsx` - Main page component with chat interface
- `apps/web/app/layout.tsx` - Root layout component
- `apps/web/app/globals.css` - Global styles and Tailwind configuration

### API Routes:
- `apps/web/app/api/agent/route.ts` - Main API endpoint for chat agent

### Library Files:
- `apps/web/lib/negotiation.ts` - Mortgage calculation logic
- `apps/web/lib/prompts.ts` - AI prompts for negotiation
- `apps/web/lib/rate.ts` - Rate calculation utilities
- `apps/web/lib/state.ts` - State management
- `apps/web/lib/types.ts` - TypeScript type definitions

### Configuration Files:
- `apps/web/package.json` - Dependencies and scripts
- `apps/web/next.config.js` - Next.js configuration
- `apps/web/tailwind.config.ts` - Tailwind CSS configuration
- `apps/web/tsconfig.json` - TypeScript configuration

### Additional Files:
- `apps/web/providers/index.ts` - React context providers
- `apps/web/.env.example` - Environment variables template

## Review Focus Areas:
1. Code quality and best practices
2. TypeScript type safety
3. React component structure
4. API endpoint implementation
5. Error handling
6. Security considerations
7. Performance optimizations

Please review all files for improvements and suggestions.
