import React from 'react';
import { BaseComponentProps } from './types';

const BaseComponent: React.FC<BaseComponentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export default BaseComponent;