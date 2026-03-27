// Accessibility utilities for ARIA attributes and keyboard navigation

// Keyboard navigation utilities
export const handleKeyDown = (
  event: React.KeyboardEvent,
  callback: (event: React.KeyboardEvent) => void
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback(event);
  }
};

export const handleArrowKeys = (
  event: React.KeyboardEvent,
  onUp: () => void,
  onDown: () => void
) => {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      onUp();
      break;
    case 'ArrowDown':
      event.preventDefault();
      onDown();
      break;
    default:
      break;
  }
};

// ARIA attributes helper functions
export const getAriaAttributes = (props: {
  label?: string;
  description?: string;
  hidden?: boolean;
  busy?: boolean;
  live?: 'off' | 'polite' | 'assertive';
  controls?: string;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  pressed?: boolean;
  hasPopup?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
}) => {
  const attrs: { [key: string]: string | boolean | number } = {};

  if (props.label) attrs['aria-label'] = props.label;
  if (props.description) attrs['aria-describedby'] = props.description;
  if (props.hidden !== undefined) attrs['aria-hidden'] = props.hidden;
  if (props.busy !== undefined) attrs['aria-busy'] = props.busy;
  if (props.live) attrs['aria-live'] = props.live;
  if (props.controls) attrs['aria-controls'] = props.controls;
  if (props.expanded !== undefined) attrs['aria-expanded'] = props.expanded;
  if (props.selected !== undefined) attrs['aria-selected'] = props.selected;
  if (props.checked !== undefined) attrs['aria-checked'] = props.checked;
  if (props.pressed !== undefined) attrs['aria-pressed'] = props.pressed;
  if (props.hasPopup) attrs['aria-haspopup'] = props.hasPopup;

  return attrs;
};

// Focus management utilities
export const focusFirstFocusableElement = (container: HTMLElement | null) => {
  if (!container) return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

export const trapFocus = (element: HTMLElement | null, returnFocusTo?: HTMLElement) => {
  if (!element) return;

  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      e.preventDefault();
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Clean up function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
    if (returnFocusTo) {
      returnFocusTo.focus();
    }
  };
};

// Screen reader utilities
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Accessibility-ready components
export const AccessibleButton = ({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  ...props
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  disabled?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleClick();
    }
  };

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500',
    ghost: 'hover:bg-gray-100 focus:ring-2 focus:ring-gray-500',
    link: 'text-blue-600 underline hover:text-blue-800 focus:ring-2 focus:ring-blue-500',
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default {
  handleKeyDown,
  handleArrowKeys,
  getAriaAttributes,
  focusFirstFocusableElement,
  trapFocus,
  announceToScreenReader,
  AccessibleButton,
};