import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Upload, X, Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    disabled = false,
    readOnly = false,
    error,
    success,
    info,
    hint,
    icon: Icon,
    className = '',
    inputClassName = '',
    variant = 'default', // default, outline, filled
    size = 'default', // sm, default, lg
    showPasswordToggle = false,
    accept,
    multiple = false,
    options = [],
    rows = 3,
    dateValue,
    onDateChange,
    min,
    max,
    step,
    pattern,
    autoComplete,
    autoFocus = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const inputId = React.useId();

    const fieldVariants = {
        default: 'space-y-2',
        inline: 'flex items-center space-x-3 space-y-0',
        compact: 'space-y-1'
    };

    const inputSizeClasses = {
        sm: 'h-8 text-sm',
        default: 'h-10',
        lg: 'h-12 text-lg'
    };

    const renderInput = () => {
        const commonProps = {
            id: inputId,
            name,
            value,
            onChange,
            onBlur,
            placeholder,
            disabled: disabled || readOnly,
            className: cn(
                'form-input transition-all duration-200',
                inputSizeClasses[size],
                variant === 'filled' && 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
                variant === 'outline' && 'border-2',
                error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                success && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
                !error && !success && 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20',
                Icon && 'pl-10',
                showPasswordToggle && 'pr-10',
                inputClassName
            ),
            autoComplete,
            autoFocus,
            min,
            max,
            step,
            pattern,
            ...props
        };

        switch (type) {
            case 'textarea':
                return (
                    <Textarea
                        {...commonProps}
                        rows={rows}
                        className={cn(commonProps.className, 'resize-none')}
                    />
                );

            case 'select':
                return (
                    <Select value={value} onValueChange={onChange} disabled={disabled}>
                        <SelectTrigger className={commonProps.className}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={inputId}
                            checked={value}
                            onCheckedChange={onChange}
                            disabled={disabled}
                        />
                        {label && (
                            <Label
                                htmlFor={inputId}
                                className={cn(
                                    'text-sm font-medium cursor-pointer',
                                    required && 'form-label-required'
                                )}
                            >
                                {label}
                            </Label>
                        )}
                    </div>
                );

            case 'radio':
                return (
                    <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
                        {options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`${inputId}-${option.value}`} />
                                <Label htmlFor={`${inputId}-${option.value}`} className="cursor-pointer">
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case 'switch':
                return (
                    <div className="flex items-center justify-between">
                        {label && (
                            <Label htmlFor={inputId} className="text-sm font-medium">
                                {label}
                            </Label>
                        )}
                        <Switch
                            id={inputId}
                            checked={value}
                            onCheckedChange={onChange}
                            disabled={disabled}
                        />
                    </div>
                );

            case 'date':
                return (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    commonProps.className,
                                    'text-left font-normal justify-start',
                                    !dateValue && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateValue ? format(dateValue, "PPP") : <span>{placeholder || "Pick a date"}</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={dateValue}
                                onSelect={onDateChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                );

            case 'file':
                return (
                    <div className="space-y-2">
                        <Input
                            {...commonProps}
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            className={cn(commonProps.className, 'file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100')}
                        />
                        {value && (
                            <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    File selected
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onChange({ target: { name, value: null } })}
                                    className="h-6 w-6 p-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                );

            default:
                const inputType = showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type;
                return (
                    <div className="relative">
                        {Icon && (
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                                <Icon className="h-4 w-4" />
                            </div>
                        )}
                        <Input
                            {...commonProps}
                            type={inputType}
                        />
                        {showPasswordToggle && type === 'password' && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-slate-400" />
                                ) : (
                                    <Eye className="h-4 w-4 text-slate-400" />
                                )}
                            </Button>
                        )}
                    </div>
                );
        }
    };

    const renderMessage = () => {
        if (error) {
            return (
                <div className="form-error flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-xs">{error}</span>
                </div>
            );
        }
        if (success) {
            return (
                <div className="form-success flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span className="text-xs">{success}</span>
                </div>
            );
        }
        if (info) {
            return (
                <div className="form-info flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    <span className="text-xs">{info}</span>
                </div>
            );
        }
        if (hint) {
            return (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {hint}
                </p>
            );
        }
        return null;
    };

    // For checkbox, radio, and switch types, label is handled differently
    if (type === 'checkbox' || type === 'radio' || type === 'switch') {
        return (
            <div className={cn(fieldVariants[variant], className)}>
                {renderInput()}
                {renderMessage()}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(fieldVariants[variant], className)}
        >
            {label && (
                <Label
                    htmlFor={inputId}
                    className={cn(
                        'form-label',
                        required && 'form-label-required',
                        disabled && 'text-slate-400 dark:text-slate-500'
                    )}
                >
                    {label}
                </Label>
            )}
            {renderInput()}
            {renderMessage()}
        </motion.div>
    );
};

export default FormField;