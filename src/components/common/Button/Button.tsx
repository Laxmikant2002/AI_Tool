import React, { forwardRef } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Reusable button component with consistent styling and accessibility
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {ButtonVariant} [props.variant='primary'] - Button variant
 * @param {ButtonSize} [props.size='md'] - Button size
 * @param {boolean} [props.isFullWidth=false] - Whether button should take full width
 * @param {boolean} [props.isDisabled=false] - Whether button is disabled
 * @param {boolean} [props.isLoading=false] - Whether button is in loading state
 * @param {React.ReactNode} [props.leftIcon] - Icon to show before text
 * @param {React.ReactNode} [props.rightIcon] - Icon to show after text
 * @param {string} [props.type='button'] - Button type attribute
 * @param {string} [props.className] - Additional CSS class
 * @param {string} [props.ariaLabel] - Accessible label
 * @param {function} [props.onClick] - Click handler
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        ${styles.Button}
        ${styles[variant]}
        ${styles[size]}
        ${isFullWidth ? styles.FullWidth : ''}
        ${isLoading ? styles.Loading : ''}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className={styles.LoadingSpinner} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </span>
      )}
      
      {!isLoading && leftIcon && (
        <span className={styles.LeftIcon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span className={styles.Content}>
        {children}
      </span>
      
      {!isLoading && rightIcon && (
        <span className={styles.RightIcon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});