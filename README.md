# SalonBook Client

A modern, full-featured salon booking web application built with Next.js. SalonBook helps customers explore salon services, book appointments, and manage their bookings, while giving admins tools to manage services, appointments, users, and transactions.

## Live Links

| Type | Link |
|---|---|
| **Live Website** | [https://salonbook-client-iota.vercel.app/](https://salonbook-client-iota.vercel.app/) |
| **Client Repository** | [https://github.com/md-towhidul-islam0/salon-client](https://github.com/md-towhidul-islam0/salon-client) |
| **Server Repository** | [https://github.com/md-towhidul-islam0/salon-server](https://github.com/md-towhidul-islam0/salon-server) |

## Project Description

**SalonBook Client** is the frontend of a salon appointment management platform. It provides a smooth experience for customers to browse services, view service details, book appointments, and track their booking/payment status. It also includes role-based dashboards for customers and admins to manage day-to-day salon operations.

## Important Features

### Public Features
- **Home Page** — Attractive landing experience with featured services, service categories, and salon highlights.
- **Services Listing** — Browse active salon services with search, category filter, and price sorting support.
- **Service Details** — View detailed service information including name, image, category, description, price, duration, and booking option.
- **Salon Details Page** — Protected salon information page with location, opening hours, and contact details.
- **Beautiful 404 Page** — Custom not-found page for invalid routes across the website.

### Customer Features
- **Authentication** — Secure sign-in/sign-up flow with role-based access.
- **Appointment Booking** — Book services with date, predefined time slot, and optional message.
- **My Appointments** — View appointment details, status, payment status, and cancel pending appointments.
- **Customer Overview** — Dashboard stats for total, pending, confirmed, and cancelled appointments.
- **My Profile** — View customer profile information and appointment summary.
- **Payment Success Page** — Confirmation UI after Stripe checkout completion.

### Admin Features
- **Admin Overview** — Key stats including customers, active services, appointment requests, pending/confirmed appointments, and successful payments.
- **Manage Services** — Add, update, and manage salon services.
- **Manage Appointments** — View all appointment requests, inspect details, and update status (Pending/Confirmed/Cancelled).
- **Manage Users** — View users and manage account role/block status through dropdown actions.
- **Transactions** — View transaction records with customer, service, appointment, amount, currency, Stripe session reference, payment status, and transaction date.
- **Admin Profile** — Admin account/profile overview.

### UX & Technical Highlights
- **Responsive UI** — Optimized for mobile, tablet, and desktop devices.
- **Protected Routes** — Role-based route protection for customer/admin/dashboard areas.
- **Reusable Components** — Shared dashboard UI, tables, status pills, and transaction components.
- **Modern App Router** — Built using Next.js App Router with server/client component patterns.

## Technology Stack

| Category | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4, tw-animate-css |
| **UI / Icons** | shadcn/ui, Base UI, Lucide React |
| **Authentication** | Better Auth, Better Auth Mongo Adapter |
| **Database** | MongoDB |
| **Payments** | Stripe |
| **Code Quality** | Biome (lint/format) |
| **Build/Tooling** | Turbopack, React Compiler |

## Folder Structure

```text
salonbook-client/
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── (Auth)/             # Sign in / Sign up routes
│   │   ├── (Dashboard)/        # Protected dashboard routes
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   │   ├── add-update-service/
│   │   │   │   ├── manage-appointments/
│   │   │   │   ├── manage-services/
│   │   │   │   ├── manage-users/
│   │   │   │   ├── profile/
│   │   │   │   └── transactions/
│   │   │   ├── Customer/       # Customer dashboard pages
│   │   │   │   ├── my-appointments/
│   │   │   │   └── my-profile/
│   │   │   └── component/      # Shared dashboard UI components
│   │   ├── api/                # API route handlers (auth, checkout, etc.)
│   │   ├── salondetails/       # Protected salon details page
│   │   ├── services/           # Services list and service details pages
│   │   ├── success/            # Payment success page
│   │   ├── unauth/             # Unauthorized access page
│   │   ├── layout.tsx          # Root layout
│   │   ├── not-found.tsx       # Global 404 page
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── Global/             # Shared global components (NavBar, Footer, etc.)
│   │   ├── Home/               # Home page sections
│   │   └── ui/                 # Reusable UI primitives
│   ├── hooks/                  # Custom React hooks
│   ├── Image/                  # Local image assets
│   └── lib/
│       ├── core/               # API/data helper functions
│       ├── auth.ts             # Auth server config
│       ├── auth-client.ts      # Auth client
│       └── stripe.ts           # Stripe setup
├── .env                        # Local environment variables (not committed)
├── biome.json                  # Biome config
├── next.config.ts              # Next.js config
├── package.json
└── README.md
```

## Installation Instructions

1. **Clone the client repository**

   ```bash
   git clone https://github.com/md-towhidul-islam0/salon-client.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd salon-client
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create an environment file**

   Create a `.env` file in the root directory and add the required environment variables listed below.

## How to Run the Project Locally

1. Make sure dependencies are installed and `.env` is configured.
2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the app in your browser:

   ```text
   http://localhost:3000
   ```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Run production server
npm run lint     # Run Biome checks
npm run format   # Format code with Biome
```

## Required Environment Variables

> Add these variable **names** in your `.env` file. Do **not** commit real secret values.

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MONGODB_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IMAGEBB_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

## Additional Notes

- This project depends on the SalonBook backend/server API for services, appointments, users, and transactions data.
- Some dashboard features require proper role-based authentication (Customer/Admin).
- Stripe payment flow requires valid Stripe configuration and backend support.
- For the best experience, run both client and server projects locally with matching environment configuration.

## Author

**MD Towhidul Islam**  
Client: [salon-client](https://github.com/md-towhidul-islam0/salon-client)  
Server: [salon-server](https://github.com/md-towhidul-islam0/salon-server)
