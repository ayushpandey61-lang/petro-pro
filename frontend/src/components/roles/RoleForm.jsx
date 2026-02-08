import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Save, X } from 'lucide-react';

const RoleForm = ({
    onSubmit,
    initialData = null,
    onCancel = null,
    title = "Add New Role",
    description = "Create a new role to assign specific permissions",
    submitButtonText = "Add Role"
}) => {
    const [roleName, setRoleName] = useState(initialData?.name || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roleName.trim()) return;

        setLoading(true);
        try {
            await onSubmit(roleName.trim());
            setRoleName('');
        } catch (error) {
            console.error('Error submitting role:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setRoleName('');
        if (onCancel) onCancel();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="premium-card border-0 overflow-hidden">
                <CardHeader className="pb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="roleName" className="text-sm font-semibold text-foreground">
                                Role Name
                            </Label>
                            <Input
                                id="roleName"
                                type="text"
                                placeholder="Enter role name (e.g., Manager, Accountant, Supervisor)"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                className="h-12 text-base"
                                disabled={loading}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Choose a descriptive name that reflects the role's responsibilities
                            </p>
                        </div>

                        {/* Role Suggestions */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-muted-foreground">
                                Common Role Examples
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {['Manager', 'Supervisor', 'Accountant', 'Operator', 'Analyst', 'Clerk'].map((suggestion) => (
                                    <Button
                                        key={suggestion}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRoleName(suggestion)}
                                        disabled={loading}
                                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200"
                                    >
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={!roleName.trim() || loading}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" />
                                        {submitButtonText}
                                    </>
                                )}
                            </Button>

                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="hover:bg-muted/50 transition-all duration-200 h-12"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default RoleForm;