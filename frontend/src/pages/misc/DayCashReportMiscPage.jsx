import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DayCashReportMiscPage = () => {
    return (
        <Card>
            <CardHeader className="form-section-header">
                <CardTitle className="text-white">Day Cash Report</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="flex gap-4 items-end">
                    <div className="flex-grow">
                        <label>Flow Date</label>
                        <Input type="date"/>
                    </div>
                     <div className="flex-grow">
                        <label>Flow Type</label>
                        <Input />
                    </div>
                    <Button>Search</Button>
                </div>
                 <div className="border rounded-md p-4 text-center text-muted-foreground">
                    Cash report data will appear here.
                </div>
            </CardContent>
        </Card>
    );
};
export default DayCashReportMiscPage;