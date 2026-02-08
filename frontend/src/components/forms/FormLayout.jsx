import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Info, Save, Send, ArrowLeft } from 'lucide-react';

const FormLayout = ({
    title,
    subtitle,
    icon: Icon,
    children,
    actions = [],
    status = null,
    loading = false,
    onBack = null,
    className = '',
    variant = 'default' // default, compact, minimal
}) => {
    const statusConfig = {
        success: {
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'from-green-50 to-emerald-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-800'
        },
        warning: {
            icon: AlertCircle,
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'from-yellow-50 to-orange-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-800'
        },
        error: {
            icon: AlertCircle,
            color: 'from-red-500 to-rose-500',
            bgColor: 'from-red-50 to-rose-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-800'
        },
        info: {
            icon: Info,
            color: 'from-blue-500 to-indigo-500',
            bgColor: 'from-blue-50 to-indigo-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800'
        }
    };

    const StatusIcon = status ? statusConfig[status.type]?.icon : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`form-container premium-card ${className}`}
        >
            {/* Header Section */}
            <div className="form-header relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5"></div>
                <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {onBack && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onBack}
                                    className="text-white/80 hover:text-white hover:bg-white/10"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="flex items-center space-x-3">
                                {Icon && (
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                )}
                                <div>
                                    <h2 className="form-title text-white">{title}</h2>
                                    {subtitle && (
                                        <p className="form-description text-white/90 mt-1">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        {status && (
                            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${statusConfig[status.type]?.bgColor} ${statusConfig[status.type]?.borderColor} border`}>
                                <div className="flex items-center space-x-2">
                                    {StatusIcon && <StatusIcon className={`h-4 w-4 ${statusConfig[status.type]?.textColor}`} />}
                                    <span className={`text-sm font-medium ${statusConfig[status.type]?.textColor}`}>
                                        {status.message}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="form-content">
                {loading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <p className="text-sm text-muted-foreground">Processing...</p>
                        </div>
                    </div>
                )}

                <div className={variant === 'compact' ? 'space-y-4' : variant === 'minimal' ? 'space-y-3' : 'space-y-6'}>
                    {children}
                </div>

                {/* Action Buttons */}
                {actions.length > 0 && (
                    <>
                        {variant !== 'minimal' && <Separator className="my-6" />}
                        <div className="form-button-group">
                            {actions.map((action, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Button
                                        type={action.type || 'button'}
                                        variant={action.variant || 'default'}
                                        onClick={action.onClick}
                                        disabled={action.disabled || loading}
                                        className={action.className || (
                                            action.variant === 'primary' ? 'form-button-primary' :
                                            action.variant === 'secondary' ? 'form-button-secondary' :
                                            action.variant === 'outline' ? 'form-button-outline' : ''
                                        )}
                                    >
                                        {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                                        {action.label}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default FormLayout;