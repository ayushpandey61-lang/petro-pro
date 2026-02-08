import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';

const FormSection = ({
    title,
    subtitle,
    icon: Icon,
    children,
    collapsible = false,
    defaultOpen = true,
    variant = 'default', // default, card, minimal
    className = '',
    badge,
    action,
    required = false
}) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    const sectionVariants = {
        default: 'form-section',
        card: 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-lg p-4 shadow-sm',
        minimal: 'space-y-4'
    };

    const headerVariants = {
        default: 'flex items-center justify-between mb-4',
        card: 'flex items-center justify-between mb-4',
        minimal: 'flex items-center justify-between mb-3'
    };

    const titleVariants = {
        default: 'form-subtitle flex items-center gap-2',
        card: 'text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2',
        minimal: 'text-base font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2'
    };

    if (collapsible) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${sectionVariants[variant]} ${className}`}
            >
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full p-0 hover:bg-transparent justify-between text-left"
                        >
                            <div className="flex items-center space-x-3">
                                {Icon && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                        <Icon className="h-4 w-4 text-white" />
                                    </div>
                                )}
                                <div>
                                    <h3 className={`${titleVariants[variant]} ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}`}>
                                        {title}
                                    </h3>
                                    {subtitle && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {badge && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        {badge}
                                    </Badge>
                                )}
                                {action && (
                                    <div onClick={(e) => e.stopPropagation()}>
                                        {action}
                                    </div>
                                )}
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                        <div className="space-y-4">
                            {children}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${sectionVariants[variant]} ${className}`}
        >
            <div className={headerVariants[variant]}>
                <div className="flex items-center space-x-3">
                    {Icon && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-white" />
                        </div>
                    )}
                    <div>
                        <h3 className={`${titleVariants[variant]} ${required ? 'after:content-["*"] after:text-red-500 after:ml-1' : ''}`}>
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {badge && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {badge}
                        </Badge>
                    )}
                    {action}
                </div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </motion.div>
    );
};

export default FormSection;