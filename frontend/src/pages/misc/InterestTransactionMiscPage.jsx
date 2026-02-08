import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const InterestTransactionMiscPage = () => {
    return (
        <Card>
            <CardHeader className="form-section-header">
                <CardTitle className="text-white">Interest Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div><Label>Date</Label><Input type="date" /></div>
                         <div><Label>Credit/Debit</Label><Input /></div>
                         <div><Label>Choose</Label><Input /></div>
                         <div><Label>Description</Label><Textarea /></div>
                    </div>
                     <Button>Save</Button>
                </form>
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Saved Transactions</h3>
                    {/* Placeholder for table */}
                    <div className="border rounded-md p-4 text-center text-muted-foreground">
                        Transaction data will appear here.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
export default InterestTransactionMiscPage;