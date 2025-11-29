# UHC – Unique Health Code

## Overview

UHC (Unique Health Code) is a National Digital Health Platform designed to serve citizens, doctors, ASHA workers, and government officials. The application provides role-based access to health records, household management, patient tracking, and government health analytics.

The platform is built as a full-stack web application using React 19 with Vite on the frontend, Express.js on the backend, and PostgreSQL with Drizzle ORM for data persistence. It implements a multi-tenant architecture supporting four distinct user roles (citizen, doctor, ASHA worker, government official), each with dedicated portals and functionalities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 19 with Vite as the build tool and development server
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Recharts for data visualization

**Design Decisions:**
- Component-based architecture using shadcn/ui for consistency and accessibility
- Custom theme system with CSS variables for light/dark mode support
- Responsive design with mobile-first approach
- Path aliases (`@/`, `@shared/`, `@assets/`) for clean imports
- Context-based authentication state management

**Routing Structure:**
The application implements role-based routing with protected routes:
- `/` - Public home page
- `/citizen/*` - Citizen portal (dashboard, timeline, schemes)
- `/doctor/*` - Doctor portal (search, patient records, notes)
- `/asha/*` - ASHA worker portal (household updates, ward members, form submission, CSV upload)
- `/gov/*` - Government portal (dashboard, alerts, admin panel)

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js server framework
- TypeScript for type safety across the stack
- PostgreSQL database via Neon serverless driver
- Drizzle ORM for type-safe database operations
- ESBuild for production bundling

**Design Decisions:**
- RESTful API architecture with `/api/*` endpoints
- Session-based authentication (infrastructure in place, currently simplified for prototype)
- Shared schema definitions between frontend and backend (`shared/schema.ts`)
- Storage abstraction layer (`IStorage` interface) for database operations
- Development mode with Vite middleware integration for HMR
- Production build separates client and server bundles

**API Structure:**
- `/api/auth/*` - Authentication endpoints (login, user retrieval)
- `/api/asha-workers` - ASHA worker management
- `/api/households/*` - Household CRUD operations
- `/api/members/*` - Family member management
- `/api/vaccinations/*` - Vaccination records
- `/api/search/patients` - Patient search functionality

### Data Storage

**Database Schema:**
The application uses PostgreSQL with the following core tables:

1. **users** - Authentication and role management
   - Stores email, role (citizen/doctor/asha/gov), full_name
   - Links to ward_id and household_id for role-based data access

2. **wards** - Geographic administrative units
   - Hierarchical structure: state → district → ward
   - Tracks cleanliness and vaccination completion rates
   - Ward ID format: `WARD-{StateCode}-{DistrictCode}-{WardNumber}`

3. **asha_workers** - Community health workers
   - Linked to specific wards
   - ASHA ID format: `ASHA-{WardNumber}-{ThreeDigitNumber}`

4. **households** - Family units
   - Contains family demographic information
   - Tracks cleanliness scores and vaccination completion
   - Household ID format: `HH-{WardNumber}-{FourDigitNumber}`
   - Includes UHC ID for unique health code identification

5. **members** - Individual family members
   - Links to households
   - Stores basic demographic data (name, age, relation)

6. **vaccinations** - Immunization records
   - Links to individual members
   - Tracks vaccine name and date

**ORM Choice:**
Drizzle ORM was selected for:
- Type-safe query building
- Excellent TypeScript integration
- Schema-first approach with automatic type generation
- Support for PostgreSQL-specific features
- Lightweight compared to alternatives

### External Dependencies

**Database:**
- Neon PostgreSQL serverless database
- Connection via `@neondatabase/serverless` driver
- Environment-based connection string (`DATABASE_URL`)

**UI Component Library:**
- shadcn/ui (customizable component system built on Radix UI)
- Radix UI primitives for accessible, unstyled components
- Lucide React for iconography

**Development Tools:**
- Replit-specific plugins for development banner, cartographer, and runtime error overlay
- Custom Vite plugin for OpenGraph image meta tag management

**Build and Deployment:**
- Vite for client bundling
- ESBuild for server bundling with selective dependency bundling
- Static file serving in production mode
- Support for Replit deployment domain detection

**Third-Party Services:**
The application is designed to integrate with:
- Email/OTP authentication (infrastructure present, simplified for prototype)
- CSV upload and processing for bulk data entry
- Future integration points for scheme eligibility APIs
- Government health analytics platforms

**Notable Dependencies:**
- `connect-pg-simple` - PostgreSQL session store (infrastructure for future use)
- `date-fns` - Date manipulation and formatting
- `drizzle-zod` - Zod schema generation from Drizzle schemas
- `embla-carousel-react` - Carousel/slider components
- `vaul` - Drawer component implementation
- `cmdk` - Command palette/search interface
- `react-hook-form` with `@hookform/resolvers` - Form management