import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ExpiryItemMiscPage = () => {
    return (
        <Card>
            <CardHeader className="form-section-header">
                <CardTitle className="text-white">Expiry Items</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">Manage and track item expiry dates.</p>
                 <Button className="mt-4">Add New Expiry Item</Button>
            </CardContent>
        </Card>
    );
};
export default ExpiryItemMiscPage;