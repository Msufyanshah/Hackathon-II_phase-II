import React from 'react';

// Keyboard navigation support for interactive components

// Keyboard event handlers
export const handleKeyboardNavigation = {
  // Handle Enter and Space keys for activation
  activateWithKeyboard(
    event: React.KeyboardEvent,
    callback: () => void
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  },

  // Handle arrow key navigation for lists
  handleArrowNavigation(
    event: React.KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onMove: (newIndex: number) => void
  ) {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = totalItems - 1;
        break;
      default:
        return; // Don't call onMove for other keys
    }

    onMove(newIndex);
  },

  // Handle arrow key navigation for horizontal lists (like tabs)
  handleHorizontalArrowNavigation(
    event: React.KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onMove: (newIndex: number) => void
  ) {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = totalItems - 1;
        break;
      default:
        return; // Don't call onMove for other keys
    }

    onMove(newIndex);
  },

  // Handle keyboard selection for radio groups
  handleRadioGroupNavigation(
    event: React.KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onSelect: (newIndex: number) => void
  ) {
    handleKeyboardNavigation.handleArrowNavigation(
      event,
      currentIndex,
      totalItems,
      onSelect
    );
  },

  // Handle keyboard selection for checkboxes (with space only)
  handleCheckboxWithKeyboard(
    event: React.KeyboardEvent,
    onToggle: () => void
  ) {
    if (event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  },

  // Handle keyboard for combobox/dropdown
  handleComboboxNavigation(
    event: React.KeyboardEvent,
    isOpen: boolean,
    currentIndex: number,
    totalItems: number,
    onToggle: () => void,
    onNavigate: (newIndex: number) => void,
    onSelect: () => void
  ) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (isOpen) {
          onSelect();
        } else {
          onToggle();
        }
        break;
      case ' ':
        event.preventDefault();
        onToggle();
        break;
      case 'Escape':
        event.preventDefault();
        onToggle(); // Close dropdown
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        if (isOpen) {
          handleKeyboardNavigation.handleArrowNavigation(
            event,
            currentIndex,
            totalItems,
            onNavigate
          );
        } else {
          event.preventDefault();
          onToggle(); // Open dropdown
        }
        break;
      case 'Home':
      case 'End':
        if (isOpen) {
          handleKeyboardNavigation.handleArrowNavigation(
            event,
            currentIndex,
            totalItems,
            onNavigate
          );
        }
        break;
      default:
        break;
    }
  }
};

// Keyboard navigation hooks (to be used in React components)
export const useKeyboardNavigation = <T,>(
  items: T[],
  initialIndex: number = 0
) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const moveFocus = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < items.length) {
      setCurrentIndex(newIndex);
    }
  };

  const focusNext = () => {
    moveFocus(currentIndex + 1);
  };

  const focusPrevious = () => {
    moveFocus(currentIndex - 1);
  };

  const focusFirst = () => {
    moveFocus(0);
  };

  const focusLast = () => {
    moveFocus(items.length - 1);
  };

  const resetFocus = () => {
    setCurrentIndex(initialIndex);
  };

  return {
    currentIndex,
    moveFocus,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    resetFocus
  };
};

// Keyboard-aware components
export const KeyboardNavigableList = <T,>({
  items,
  renderItem,
  onActivate,
  initialIndex = 0
}: {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => React.ReactNode;
  onActivate: (item: T, index: number) => void;
  initialIndex?: number;
}) => {
  const { currentIndex, moveFocus } = useKeyboardNavigation(items, initialIndex);

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
    handleKeyboardNavigation.handleArrowNavigation(
      e,
      index,
      items.length,
      moveFocus
    );
  };

  const handleActivate = (index: number) => () => {
    onActivate(items[index], index);
  };

  return (
    <div role="list" className="keyboard-navigable-list">
      {items.map((item, index) => (
        <div
          key={index}
          role="listitem"
          tabIndex={index === currentIndex ? 0 : -1}
          onKeyDown={handleKeyDown(index)}
          onClick={handleActivate(index)}
          onFocus={() => moveFocus(index)}
          className={index === currentIndex ? 'focused' : ''}
        >
          {renderItem(item, index, index === currentIndex)}
        </div>
      ))}
    </div>
  );
};

// Keyboard shortcut manager
export class KeyboardShortcutManager {
  private shortcuts: Map<string, () => void>;
  private enabled: boolean;

  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;

    // Bind the global keydown handler
    this.handleGlobalKeyDown = this.handleGlobalKeyDown.bind(this);
    this.enable();
  }

  register(combination: string, callback: () => void) {
    this.shortcuts.set(combination.toLowerCase(), callback);
  }

  unregister(combination: string) {
    this.shortcuts.delete(combination.toLowerCase());
  }

  enable() {
    if (!this.enabled) {
      document.addEventListener('keydown', this.handleGlobalKeyDown);
      this.enabled = true;
    }
  }

  disable() {
    if (this.enabled) {
      document.removeEventListener('keydown', this.handleGlobalKeyDown);
      this.enabled = false;
    }
  }

  private handleGlobalKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return;

    // Skip if focusing on input-like elements
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    const keyCombo = this.getKeyCombination(event);

    if (this.shortcuts.has(keyCombo)) {
      event.preventDefault();
      this.shortcuts.get(keyCombo)!();
    }
  }

  private getKeyCombination(event: KeyboardEvent): string {
    const modifiers = [];

    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.shiftKey) modifiers.push('shift');
    if (event.altKey) modifiers.push('alt');
    if (event.metaKey) modifiers.push('meta');

    // Normalize the main key
    let key = event.key.toLowerCase();
    if (key === ' ') key = 'space';
    if (key.length === 1) key = key.toLowerCase(); // Ensure lowercase for letters

    return [...modifiers, key].join('+');
  }
}

export default {
  handleKeyboardNavigation,
  useKeyboardNavigation,
  KeyboardNavigableList,
  KeyboardShortcutManager
};