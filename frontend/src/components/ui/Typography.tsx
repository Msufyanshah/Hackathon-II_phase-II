import React from 'react';
import { BaseComponentProps } from '../../lib/types';

export interface HeadingProps extends BaseComponentProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  weight = 'bold',
  className = '',
  ...props
}) => {
  const headingClasses = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const classes = `${headingClasses[level]} ${weightClasses[weight]} font-heading ${className}`;

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export interface TextProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'muted' | 'destructive';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'primary',
  size = 'base',
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'text-foreground',
    secondary: 'text-secondary-foreground',
    muted: 'text-muted-foreground',
    destructive: 'text-destructive-foreground',
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};

export interface LinkProps extends BaseComponentProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'muted' | 'destructive';
  underline?: 'always' | 'hover' | 'never';
}

export const Link: React.FC<LinkProps> = ({
  children,
  href,
  variant = 'primary',
  underline = 'hover',
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'text-primary hover:text-primary/80',
    secondary: 'text-secondary hover:text-secondary/80',
    muted: 'text-muted-foreground hover:text-muted-foreground/80',
    destructive: 'text-destructive hover:text-destructive/80',
  };

  const underlineClasses = {
    always: 'underline',
    hover: 'hover:underline',
    never: 'no-underline',
  };

  const classes = `cursor-pointer ${variantClasses[variant]} ${underlineClasses[underline]} ${className}`;

  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
};

export default { Heading, Text, Link };