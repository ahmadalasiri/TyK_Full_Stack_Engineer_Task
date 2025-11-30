# Frontend - TyK Registration System

React-based multi-step registration form with real-time validation and progress tracking.

## 📦 Dependencies

### Core
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **TailwindCSS** - Utility-first CSS framework

### UI Components
- **Radix UI** - Accessible component primitives (Checkbox, Label, Select, Separator)
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Conditional class utilities

### Utilities
- **country-state-city** - Country and state data
- **react-phone-number-input** - International phone number input

## 🏗️ Project Structure

```
src/
├── features/
│   └── registration/
│       ├── RegistrationFlow.jsx      # Main flow orchestrator
│       ├── ProgressIndicator.jsx    # Step navigation UI
│       ├── StepPersonalInfo.jsx     # Step 1: Personal info
│       ├── StepAddress.jsx          # Step 2: Address details
│       ├── StepAccount.jsx          # Step 3: Account setup
│       ├── StepReview.jsx           # Step 4: Review & submit
│       └── StepErrorBanner.jsx      # Error display component
│
├── components/
│   └── ui/                          # Reusable UI components
│       ├── button.jsx
│       ├── card.jsx
│       ├── checkbox.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── select.jsx
│       └── separator.jsx
│
├── context/
│   ├── RegistrationContext.jsx      # Context provider
│   └── RegistrationContextValue.jsx # Context definition
│
├── hooks/
│   ├── useRegistration.js           # Main registration hook
│   └── useStepError.js              # Step error handling hook
│
├── api/
│   └── registration.js              # API client functions
│
├── validation/
│   └── schemas.js                   # Zod validation schemas
│
├── lib/
│   └── utils.js                     # Utility functions (cn, etc.)
│
├── App.jsx                          # Root component
└── main.jsx                         # Entry point
```

## 🚀 Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Runs on `http://localhost:5173` by default. Vite automatically proxies `/api` requests to `http://localhost:3001`.

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage

```bash
npm run test:coverage
```

### Test Structure

- `__tests__/api/` - API client tests
- `__tests__/integration/` - Full flow integration tests
- `__tests__/validation/` - Schema validation tests
- `__tests__/utils/` - Utility function tests

## 📝 Key Features

### State Management

Uses React Context API for global state:
- Current step tracking
- Form data persistence across steps
- Completed steps tracking
- Backend error handling

### Form Validation

- **Client-side**: Zod schemas with React Hook Form
- **Real-time**: Validation on field change (`mode: "onChange"`)
- **Step-level**: Prevents progression if validation fails
- **Backend sync**: Displays server-side validation errors

### Registration Flow

1. **Step 1 - Personal Info**: First name, last name, email, optional phone
2. **Step 2 - Address**: Street, city, state, country (with country-state-city library)
3. **Step 3 - Account**: Username (with availability check), password, confirm password, terms, newsletter
4. **Step 4 - Review**: Display all data, allow editing, submit registration

### Username Availability

- Debounced API calls (prevents excessive requests)
- Real-time feedback while typing
- Blocks progression if username unavailable

### Progress Indicator

- Visual step navigation
- Click to navigate to completed steps
- Prevents skipping ahead to incomplete steps

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001
```

If not set, defaults to `http://localhost:3001`.

### Vite Configuration

See `vite.config.js` for:
- React plugin configuration
- Proxy settings for API requests
- Build optimizations

### TailwindCSS

Configuration in `tailwind.config.js`:
- Custom color scheme
- Animation utilities
- Component variants

## 📦 Build Output

Production build creates:
- `dist/index.html` - Entry HTML
- `dist/assets/` - Bundled JS and CSS
- Optimized and minified for production

## 🐛 Common Issues

### Port Already in Use

Change port in `vite.config.js` or use:
```bash
npm run dev -- --port 3000
```

### API Connection Errors

Ensure backend is running on `http://localhost:3001` or update `VITE_API_BASE_URL`.

### Build Errors

Clear cache and rebuild:
```bash
rm -rf node_modules dist
npm install
npm run build
```

