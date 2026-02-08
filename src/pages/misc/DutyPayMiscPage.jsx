import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DutyPayMiscPage = () => {
    return (
        <Card>
            <CardHeader className="form-section-header">
                <CardTitle className="text-white">Duty Pay / Payroll</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">Payroll management module.</p>
                <Button className="mt-4">View Salary Summary</Button>
            </CardContent>
        </Card>
    );
};
export default DutyPayMiscPage;