# Frontend Components

This directory contains the React components for the AI Standup Summarizer application.

## Component Structure

### Core Components

- **`Header.tsx`** - Main application header with title
- **`Layout.tsx`** - Main layout wrapper with consistent styling
- **`NewUpdateForm.tsx`** - Form for submitting new standup updates
- **`SummaryItem.tsx`** - Individual summary entry display
- **`SummariesList.tsx`** - List container for all summaries

### Custom Hooks

- **`useStandupApi.ts`** - Custom hook for GraphQL operations and state management

### Types

- **`types/index.ts`** - Shared TypeScript interfaces and types

## Component Hierarchy

```
App
├── Layout
    ├── Header
    ├── NewUpdateForm
    └── SummariesList
        └── SummaryItem (multiple)
```

## Props Interface

### Header
- `title: string` - The header title text

### Layout
- `children: React.ReactNode` - Child components to render

### NewUpdateForm
- `userId: string` - Current user ID
- `text: string` - Current update text
- `loading: boolean` - Loading state
- `error: string | null` - Error message if any
- `onUserIdChange: (userId: string) => void` - User ID change handler
- `onTextChange: (text: string) => void` - Text change handler
- `onSubmit: () => void` - Form submission handler
- `onRefresh: () => void` - Refresh summaries handler

### SummaryItem
- `update: Update` - The update object to display

### SummariesList
- `summaries: Update[]` - Array of summaries to display
- `loading: boolean` - Loading state

## Styling

All components use inline styles for simplicity and to avoid external dependencies. The styling follows a consistent design system with:

- Consistent spacing (8px, 12px, 16px, 20px, 24px)
- Consistent border radius (4px, 6px, 8px, 12px)
- Consistent colors for text, borders, and backgrounds
- Consistent shadows and hover effects

## Usage Example

```tsx
import { Header, Layout, NewUpdateForm, SummariesList } from './components'
import { useStandupApi } from './hooks/useStandupApi'

const App = () => {
  const api = useStandupApi()
  
  return (
    <Layout>
      <Header title="My App" />
      <NewUpdateForm {...api} />
      <SummariesList summaries={api.summaries} loading={api.loading} />
    </Layout>
  )
}
```
