# React Frontend Project Structure

## Project Overview
This is a structured React frontend for an e-commerce book store application.

## Directory Structure

### Core Directories
```
src/
├── components/
│   ├── common/      # Reusable UI components
│   ├── layout/      # Layout components (Header, Footer)
│   ├── features/    # Feature-specific components
│   └── shared/      # Shared components
│
├── pages/
│   ├── Home/        # Landing page
│   ├── Admin/       # Admin dashboard
│   ├── Products/    # Product listings
│   ├── Cart/        # Shopping cart
│   ├── Checkout/    # Checkout process
│   └── User/        # User-related pages
│       ├── Signin/  # Login page
│       └── Signup/  # Registration page
│
├── services/
│   ├── api/        # API configurations
│   └── auth/       # Authentication services
│
├── styles/         # Global styles
│   ├── app.css
│   ├── index.css
│   └── user.css
│
├── redux/          # State management
│   ├── slices/     # Redux slices
│   └── store/      # Store configuration
│
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── assets/         # Static assets
```

## Import Conventions
Use absolute imports with the `@` prefix:
```javascript
// Components
import { Button } from '@components/common';
import { Header } from '@components/layout';

// Pages
import { Home } from '@pages/Home';
import { Signin, Signup } from '@pages/User';

// Services
import { apiService } from '@services/api';
import { authService } from '@services/auth';
```

## Development Guidelines

### Component Development
- Use functional components with hooks
- Keep components small and focused
- Implement proper prop-types
- Use TypeScript for type safety

### State Management
- Use React Context for simple state
- Implement Redux for complex state
- Follow Redux Toolkit patterns
- Maintain clean action creators

### Styling
- Use Tailwind CSS for components
- Keep global styles minimal
- Follow BEM naming convention
- Implement responsive design

### Performance
- Implement code splitting
- Use React.memo wisely
- Optimize bundle size
- Lazy load components

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Run restructure script: `./restructure.sh`
4. Start development: `npm run dev`

## Build & Deploy
- Development: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`

## Best Practices
- Follow folder structure strictly
- Use absolute imports
- Write unit tests
- Document components
- Follow Git workflow

## Troubleshooting
- Check import paths
- Verify component exports
- Use absolute imports with `jsconfig.json`

## Contributing
- Follow established folder structure
- Write clean, documented code
- Create detailed pull requests 


https://mega.nz/folder/35NghLJK#aPlma5kAMBx7Eaur7O6-1w