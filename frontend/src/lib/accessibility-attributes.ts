// Accessibility attributes (ARIA) for interactive components

// ARIA attributes for common components
export const getAccessibilityAttributes = (
  componentType: 'button' | 'link' | 'input' | 'checkbox' | 'radio' | 'combobox' | 'listbox' | 'menu' | 'dialog' | 'tabpanel',
  props?: {
    label?: string;
    description?: string;
    disabled?: boolean;
    expanded?: boolean;
    selected?: boolean;
    checked?: boolean;
    pressed?: boolean;
    hasPopup?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
    controls?: string;
    owns?: string;
    describedBy?: string;
    labelledBy?: string;
    activeDescendant?: string;
    autocomplete?: 'inline' | 'list' | 'both' | 'none';
    role?: string;
  }
) => {
  const attrs: { [key: string]: string | boolean | number } = {};

  // Add default roles based on component type
  switch (componentType) {
    case 'button':
      attrs.role = 'button';
      break;
    case 'checkbox':
      attrs.role = 'checkbox';
      break;
    case 'radio':
      attrs.role = 'radio';
      break;
    case 'dialog':
      attrs.role = 'dialog';
      attrs['aria-modal'] = true;
      break;
    case 'tabpanel':
      attrs.role = 'tabpanel';
      break;
    default:
      break;
  }

  // Add provided attributes
  if (props) {
    if (props.label) attrs['aria-label'] = props.label;
    if (props.description) attrs['aria-description'] = props.description;
    if (props.disabled !== undefined) attrs['aria-disabled'] = props.disabled;
    if (props.expanded !== undefined) attrs['aria-expanded'] = props.expanded;
    if (props.selected !== undefined) attrs['aria-selected'] = props.selected;
    if (props.checked !== undefined) attrs['aria-checked'] = props.checked;
    if (props.pressed !== undefined) attrs['aria-pressed'] = props.pressed;
    if (props.hasPopup) attrs['aria-haspopup'] = props.hasPopup;
    if (props.controls) attrs['aria-controls'] = props.controls;
    if (props.owns) attrs['aria-owns'] = props.owns;
    if (props.describedBy) attrs['aria-describedby'] = props.describedBy;
    if (props.labelledBy) attrs['aria-labelledby'] = props.labelledBy;
    if (props.activeDescendant) attrs['aria-activedescendant'] = props.activeDescendant;
    if (props.autocomplete) attrs['aria-autocomplete'] = props.autocomplete;
    if (props.role) attrs.role = props.role;
  }

  return attrs;
};

// Specific ARIA patterns
export const getButtonAriaProps = (props: {
  label?: string;
  pressed?: boolean;
  disabled?: boolean;
  hasPopup?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
}) => {
  return getAccessibilityAttributes('button', props);
};

export const getInputAriaProps = (props: {
  label?: string;
  describedBy?: string;
  required?: boolean;
  invalid?: boolean;
  autocomplete?: string;
  readonly?: boolean;
}) => {
  const attrs: { [key: string]: string | boolean } = {};

  if (props.label) attrs['aria-label'] = props.label;
  if (props.describedBy) attrs['aria-describedby'] = props.describedBy;
  if (props.required !== undefined) attrs['aria-required'] = props.required;
  if (props.invalid !== undefined) attrs['aria-invalid'] = props.invalid;
  if (props.autocomplete) attrs['aria-autocomplete'] = props.autocomplete;
  if (props.readonly !== undefined) attrs['aria-readonly'] = props.readonly;

  return attrs;
};

export const getCheckboxAriaProps = (props: {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
}) => {
  return getAccessibilityAttributes('checkbox', props);
};

export const getRadioAriaProps = (props: {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  groupLabel?: string;
}) => {
  const attrs = getAccessibilityAttributes('radio', props);

  if (props.groupLabel) {
    attrs['aria-labelledby'] = props.groupLabel;
  }

  return attrs;
};

export const getDialogAriaProps = (props: {
  label?: string;
  describedBy?: string;
  modal?: boolean;
}) => {
  const attrs = getAccessibilityAttributes('dialog', props);

  if (props.modal !== undefined) attrs['aria-modal'] = props.modal;

  return attrs;
};

// Focus management for accessibility
export const focusManagement = {
  // Trap focus inside an element (useful for modals)
  trapFocus(element: HTMLElement | null) {
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

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  // Move focus to an element
  focusElement(element: HTMLElement | null) {
    if (element) {
      element.focus();
    }
  },

  // Focus first element in a container
  focusFirstElement(container: HTMLElement | null) {
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }
};

// Announce content to screen readers
export const screenReaderAnnouncer = {
  announce(message: string, politeness: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.style.position = 'absolute';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.padding = '0';
    announcement.style.margin = '-1px';
    announcement.style.overflow = 'hidden';
    announcement.style.clip = 'rect(0, 0, 0, 0)';
    announcement.style.whiteSpace = 'nowrap';
    announcement.style.border = '0';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
};

// Accessibility utilities for components
export const componentAccessibility = {
  // Get props for accessible buttons
  getAccessibleButtonProps({
    onClick,
    children,
    variant = 'primary',
    disabled = false,
    label,
    ...rest
  }: {
    onClick?: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
    disabled?: boolean;
    label?: string;
  } & React.HTMLAttributes<HTMLButtonElement>) {
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

    const ariaProps = getButtonAriaProps({
      label,
      pressed: variant === 'primary' ? undefined : undefined,
      disabled
    });

    return {
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      disabled,
      'aria-disabled': disabled,
      ...ariaProps,
      ...rest
    };
  }
};

export default {
  getAccessibilityAttributes,
  getButtonAriaProps,
  getInputAriaProps,
  getCheckboxAriaProps,
  getRadioAriaProps,
  getDialogAriaProps,
  focusManagement,
  screenReaderAnnouncer,
  componentAccessibility
};