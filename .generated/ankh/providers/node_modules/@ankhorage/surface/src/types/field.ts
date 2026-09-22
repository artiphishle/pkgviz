import type React from 'react';

export interface FieldProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  testID?: string;
}
