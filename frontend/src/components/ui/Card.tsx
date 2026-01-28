import React from 'react';
import { BaseComponentProps } from '../../lib/types';

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  ...props
}) => {
  const classes = `rounded-xl border bg-card text-card-foreground shadow ${className}`;

  return (
    <div className={classes} {...props}>
      {(title || subtitle) && (
        <div className="p-6 pb-0">
          {title && <h3 className="font-semibold leading-none tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 pt-0">
        {children}
      </div>
    </div>
  );
};

export default Card;