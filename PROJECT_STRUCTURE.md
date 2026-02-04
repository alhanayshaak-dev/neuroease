# NeuroFlow Project Structure

## Directory Layout

```
neuroflow/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── api/                # API routes
│   │
│   ├── components/             # React components
│   │   ├── StatusBadge.tsx     # Stress status indicator
│   │   ├── Header.tsx          # Fixed header
│   │   ├── Navigation.tsx      # Bottom navigation
│   │   └── ...
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── supabase.ts         # Supabase client
│   │   ├── anthropic.ts        # Anthropic API client
│   │   └── ...
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useRealtimeSubscription.ts
│   │   └── ...
│   │
│   ├── utils/                  # Utility functions
│   │   ├── stress.ts           # Stress calculation
│   │   ├── __tests__/          # Unit tests
│   │   └── ...
│   │
│   └── types/                  # TypeScript types
│       ├── index.ts            # Main types export
│       ├── database.ts         # Database types
│       └── ...
│
├── public/                     # Static assets
│
├── .kiro/                      # Kiro spec files
│   └── specs/
│       └── neuroflow/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
│
├── Configuration Files
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript config
│   ├── next.config.js          # Next.js config
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── postcss.config.js       # PostCSS config
│   ├── jest.config.js          # Jest config
│   ├── jest.setup.js           # Jest setup
│   ├── .eslintrc.json          # ESLint config
│   ├── .prettierrc             # Prettier config
│   ├── .gitignore              # Git ignore
│   └── .env.local              # Environment variables
│
└── Documentation
    ├── README.md               # Project overview
    ├── NEUROFLOW_BUILD_SPEC.md # Build specification
    ├── DATABASE_SCHEMA.sql     # Database schema
    ├── API_INTEGRATION.md      # API integration guide
    ├── UI_COMPONENTS.md        # Component documentation
    └── PROJECT_STRUCTURE.md    # This file
```

## Key Files

### Configuration
- **package.json**: Project dependencies and npm scripts
- **tsconfig.json**: TypeScript compiler options with path aliases
- **next.config.js**: Next.js configuration with security headers
- **tailwind.config.js**: Tailwind CSS with NeuroFlow brand colors
- **jest.config.js**: Jest testing framework configuration
- **.eslintrc.json**: Code quality rules
- **.prettierrc**: Code formatting rules

### Source Code
- **src/app/layout.tsx**: Root layout with dark mode enabled
- **src/app/page.tsx**: Home page
- **src/lib/supabase.ts**: Supabase client initialization
- **src/lib/anthropic.ts**: Anthropic API client
- **src/types/**: TypeScript type definitions
- **src/hooks/**: Custom React hooks
- **src/utils/**: Utility functions
- **src/components/**: React components

### Environment
- **.env.local**: Environment variables (Supabase, Anthropic API keys)

## Development Workflow

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Building
```bash
npm run build
npm start
```

### Testing
```bash
npm test              # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

## Technology Stack

- **Framework**: Next.js 14+ with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Real-time**: Supabase Realtime (WebSocket)
- **AI**: Anthropic Claude API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **Property Testing**: fast-check
- **Code Quality**: ESLint + Prettier

## Design Principles

1. **Dark Mode First**: All UI designed for dark mode (default)
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Privacy**: User controls all data and permissions
4. **Opt-In Features**: All features disabled by default
5. **Real-Time**: Supabase Realtime for instant updates
6. **Type Safety**: Full TypeScript coverage
7. **Testing**: Unit + Property-based tests

## Environment Variables

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_ANTHROPIC_API_KEY`: Anthropic API key
- `NEXT_PUBLIC_APP_NAME`: App name (NeuroFlow)
- `NEXT_PUBLIC_APP_TAGLINE`: App tagline

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development server
3. Begin implementing features from tasks.md
4. Write tests alongside implementation
5. Deploy to Vercel when ready
