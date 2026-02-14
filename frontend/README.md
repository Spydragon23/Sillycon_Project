# Silly Hackathon

A Next.js project built with React, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Silly-Hackathon
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   
   *Note: We use `--legacy-peer-deps` to resolve a dependency conflict between `date-fns` and `react-day-picker`.*

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Available Scripts

- `npm run dev` - Start the development server with Turbo
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: Next.js 16.1.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: npm (with pnpm lock file present)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
