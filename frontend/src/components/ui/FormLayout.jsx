import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const FormLayout = ({
  title,
  description,
  children,
  onSubmit,
  className = "",
  headerClassName = "",
  contentClassName = "",
  actions = null
}) => {
  return (
    <div className={`form-container premium-card ${className}`}>
      <div className={`form-header ${headerClassName}`}>
        <div className="relative z-10">
          <h2 className="form-title">{title}</h2>
          {description && (
            <p className="form-description mt-1 opacity-90">{description}</p>
          )}
        </div>
      </div>

      <div className={`form-content ${contentClassName}`}>
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
        </form>
      </div>
    </div>
  );
};

const FormSection = ({
  title,
  subtitle,
  children,
  className = "",
  icon: Icon
}) => {
  return (
    <div className={`form-section ${className}`}>
      {(title || subtitle) && (
        <h3 className="form-subtitle mb-4 flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </h3>
      )}
      {subtitle && <p className="form-description mb-4">{subtitle}</p>}
      {children}
    </div>
  );
};

const FormGrid = ({
  children,
  cols = 3,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`form-grid ${gridCols[cols]} ${className}`}>
      {children}
    </div>
  );
};

const FormField = ({
  label,
  children,
  required = false,
  error = null,
  success = null,
  info = null,
  className = ""
}) => {
  return (
    <div className={`form-field ${className}`}>
      <Label className={`form-label ${required ? 'form-label-required' : ''}`}>
        {label}
      </Label>
      {children}
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}
      {info && <div className="form-info">{info}</div>}
    </div>
  );
};

const FormActions = ({
  children,
  className = ""
}) => {
  return (
    <>
      <div className="form-divider"></div>
      <div className={`form-button-group ${className}`}>
        {children}
      </div>
    </>
  );
};

export {
  FormLayout,
  FormSection,
  FormGrid,
  FormField,
  FormActions
};