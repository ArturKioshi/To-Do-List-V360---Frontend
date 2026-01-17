import type { ComponentProps } from 'react';
import { ClassMerge } from '../utils/ClassMerge';

type ButtonVariant = 'default' | 'cancel';

type ButtonProps = ComponentProps<"button"> & {
  onClick: () => void;
  variant?: ButtonVariant;
};

export function Button({ onClick, children, variant = 'default', className, ...rest }: ButtonProps) {
  const variantStyles = {
    default: 'bg-(--color-button) text-(--color-button-text) hover:opacity-90',
    cancel: 'bg-transparent border-2 border-gray-300 text-(--color-headline) hover:bg-gray-50'
  };

  return (
    <button
      onClick={onClick}
      {...rest}
      className={ClassMerge(
        'w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-opacity hover:cursor-pointer',
        variantStyles[variant],
        className
      )}
    >
      <span>{children}</span>
    </button>
  );
}
