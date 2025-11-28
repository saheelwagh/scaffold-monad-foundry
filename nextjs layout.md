Core Structure
app/
 - Next.js 13+ App Router directory containing pages and layouts
layout.tsx
 - Root layout with providers and global styling
page.tsx
 - Home page component
debug/
 - Debug contracts feature with its own page and components
blockexplorer/
 - Block explorer feature with nested routes
components/
 - Reusable React components
Header.tsx
 - Navigation header with menu links
Footer.tsx
 - Site footer
ScaffoldEthAppWithProviders.tsx
 - Main app wrapper with Web3 providers
scaffold-eth/
 - Scaffold-ETH specific components
hooks/
 - Custom React hooks for Web3 and app functionality
services/
 - External service integrations (Web3, APIs)
utils/
 - Utility functions and helpers
styles/
 - Global CSS and styling
Theme System
The project uses:

Tailwind CSS with DaisyUI components
Theme switching (light/dark mode)
Consistent styling with classes like bg-base-100, btn, rounded-3xl

For adding a new app feature, I recommend following the existing pattern:

Option 1: Dedicated Route (Recommended)

app/
├── your-app/
│   ├── page.tsx              # Main app page
│   ├── layout.tsx            # App-specific layout (optional)
│   └── _components/          # App-specific components
│       ├── index.ts          # Export barrel
│       ├── AppComponent1.tsx
│       └── AppComponent2.tsx

Option 2: Component-Based Integration
components/
├── your-app/
│   ├── index.ts              # Export barrel
│   ├── YourApp.tsx           # Main app component
│   └── components/           # Sub-components

Supporting Structure
hooks/your-app/ - App-specific hooks
utils/your-app/ - App-specific utilities
services/your-app/ - App-specific services