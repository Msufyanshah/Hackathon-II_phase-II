// Responsive design adjustments for all components

// Breakpoints
export const breakpoints = {
  sm: '640px',  // Small devices (landscape phones, 576px and up)
  md: '768px',  // Medium devices (tablets, 768px and up)
  lg: '1024px', // Large devices (desktops, 992px and up)
  xl: '1280px', // Extra large devices (large desktops, 1200px and up)
  '2xl': '1536px' // 2x large devices
};

// Responsive utility classes
export const responsiveClasses = {
  // Container adjustments
  container: {
    base: 'px-4',
    sm: 'max-w-sm mx-auto',
    md: 'max-w-md mx-auto',
    lg: 'max-w-lg mx-auto',
    xl: 'max-w-xl mx-auto',
    '2xl': 'max-w-2xl mx-auto'
  },

  // Grid adjustments
  grid: {
    base: 'grid-cols-1',
    sm: 'grid-cols-1',
    md: 'grid-cols-2',
    lg: 'grid-cols-3',
    xl: 'grid-cols-4'
  },

  // Button adjustments
  button: {
    base: 'px-4 py-2 text-sm',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  },

  // Card adjustments
  card: {
    base: 'p-4',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  },

  // Typography adjustments
  heading: {
    h1: {
      base: 'text-2xl',
      sm: 'text-2xl',
      md: 'text-3xl',
      lg: 'text-4xl',
      xl: 'text-5xl'
    },
    h2: {
      base: 'text-xl',
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl',
      xl: 'text-4xl'
    },
    h3: {
      base: 'text-lg',
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl'
    }
  }
};

// Media query helper functions
export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`
};

// Responsive component styles
export const componentResponsiveStyles = {
  // Form components
  form: {
    fieldSpacing: {
      base: 'mb-4',
      md: 'mb-6'
    },
    input: {
      base: 'py-2 px-3 text-base',
      md: 'py-3 px-4 text-lg'
    }
  },

  // Navigation adjustments
  nav: {
    base: 'flex-col space-y-4 p-4',
    md: 'flex-row items-center space-y-0 space-x-8 p-6',
    lg: 'space-x-10 p-8'
  },

  // Table adjustments
  table: {
    base: 'block overflow-x-auto',
    md: 'table',
    fontSize: {
      base: 'text-xs',
      sm: 'text-sm',
      md: 'text-base'
    }
  },

  // Image adjustments
  image: {
    maxWidth: {
      base: '100%',
      md: '75%',
      lg: '50%'
    }
  },

  // Spacing adjustments
  spacing: {
    padding: {
      base: 'p-4',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12'
    },
    margin: {
      base: 'm-4',
      sm: 'm-4',
      md: 'm-6',
      lg: 'm-8',
      xl: 'm-12'
    }
  }
};

// Utility function to generate responsive class strings
export const generateResponsiveClass = (base: string, responsive: Record<string, string>) => {
  // This would be used in a CSS-in-JS solution
  // For Tailwind CSS, we use the responsive prefixes directly
  return {
    base,
    ...Object.entries(responsive).reduce((acc, [bp, classes]) => {
      acc[bp] = `${base} ${classes}`;
      return acc;
    }, {} as Record<string, string>)
  };
};

// Responsive hook for JavaScript/TypeScript components
export const useResponsive = () => {
  // In a real implementation, this would use window.matchMedia
  // For now, we'll return the breakpoints
  return {
    breakpoints,
    mediaQueries,
    responsiveClasses,
    componentResponsiveStyles
  };
};

// Export all responsive utilities
export default {
  breakpoints,
  responsiveClasses,
  mediaQueries,
  componentResponsiveStyles,
  generateResponsiveClass,
  useResponsive
};