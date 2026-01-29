# Component Documentation

This document provides usage examples and documentation for the key components in the application.

## UI Components

### Button
A customizable button component with different variants and sizes.

```tsx
import { Button } from '../ui/Button';

// Primary button
<Button variant="primary" onClick={() => console.log('clicked')}>
  Click me
</Button>

// Secondary button
<Button variant="secondary">
  Secondary action
</Button>

// Danger button
<Button variant="danger">
  Delete
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'
- `className`: Additional CSS classes

### Card
A container component with padding and shadow.

```tsx
import { Card } from '../ui/Card';

<Card className="p-6">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

**Props:**
- `className`: Additional CSS classes

### Input
An input field component with label and error handling.

```tsx
import { Input } from '../ui/Input';

<Input
  type="email"
  label="Email"
  name="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  placeholder="your@email.com"
/>
```

**Props:**
- `type`: Input type ('text', 'email', 'password', etc.)
- `label`: Label text
- `name`: Field name
- `value`: Current value
- `onChange`: Change handler
- `error`: Error message
- `placeholder`: Placeholder text
- `required`: Whether field is required
- `disabled`: Whether field is disabled

### ErrorMessage
Displays error messages in a consistent way.

```tsx
import { ErrorMessage } from '../ui/ErrorMessage';

{error && <ErrorMessage message={error} />}
```

**Props:**
- `message`: Error message to display
- `className`: Additional CSS classes

## Form Components

### LoginForm
Handles user authentication.

```tsx
import LoginForm from '../forms/LoginForm';

<LoginForm
  onSuccess={() => console.log('Logged in')}
  onError={(error) => console.error('Login error:', error)}
/>
```

**Props:**
- `onSuccess`: Callback on successful login
- `onError`: Callback on login error

### RegisterForm
Handles user registration.

```tsx
import RegisterForm from '../forms/RegisterForm';

<RegisterForm
  onSuccess={() => console.log('Registered')}
  onError={(error) => console.error('Registration error:', error)}
/>
```

**Props:**
- `onSuccess`: Callback on successful registration
- `onError`: Callback on registration error

### TaskForm
Handles task creation and editing.

```tsx
import TaskForm from '../forms/TaskForm';

<TaskForm
  userId={currentUser.id}
  onSuccess={(task) => console.log('Task created:', task)}
  onCancel={() => console.log('Cancelled')}
/>
```

**Props:**
- `userId`: ID of the user creating the task
- `task`: Existing task for editing (optional)
- `onSuccess`: Callback on successful task operation
- `onCancel`: Callback when cancelled

## Layout Components

### ProtectedRoute
Ensures only authenticated users can access certain parts of the application.

```tsx
import ProtectedRoute from '../layouts/ProtectedRoute';

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**Props:**
- `children`: Child components to render if authenticated

### Layout
Main layout component with header and navigation.

```tsx
import Layout from '../layouts/Layout';

<Layout title="Dashboard">
  <DashboardContent />
</Layout>
```

**Props:**
- `title`: Page title
- `children`: Child components

## Service Components

### TaskService
Provides methods for interacting with the task API.

```tsx
import { TaskService } from '../../services/tasks';

// Get user tasks
const tasks = await TaskService.getUserTasks(userId);

// Create a task
const newTask = await TaskService.createTask(userId, { title: 'New task' });

// Update a task
const updatedTask = await TaskService.updateTask(taskId, { title: 'Updated title' });

// Delete a task
await TaskService.deleteTask(taskId);

// Toggle completion
const task = await TaskService.toggleTaskCompletion(taskId, true);
```

## Context Providers

### AuthContext
Manages authentication state throughout the application.

```tsx
import { useAuth } from '../contexts/AuthContext';

const { user, loading, login, logout } = useAuth();
```

## Testing Guidelines

### Component Testing
Components should be tested with different states:
- Loading state
- Error state
- Success state
- Empty state
- Disabled state

### Integration Testing
Test the interaction between components and services, especially:
- Form submissions
- API calls
- Navigation flows
- Authentication flows

## Accessibility Guidelines

All components should follow WCAG 2.1 AA standards:
- Proper semantic HTML
- Keyboard navigation support
- ARIA attributes where needed
- Color contrast ratios
- Focus indicators