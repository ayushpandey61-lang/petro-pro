import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Smile, Frown, Meh } from 'lucide-react';

const FeedbackMiscPage = () => {
    return (
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader className="form-section-header text-center">
                    <CardTitle className="text-white">Give us your feedback</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-center gap-4 text-4xl">
                        <Smile className="text-green-500 hover:scale-125 transition-transform cursor-pointer" />
                        <Meh className="text-yellow-500 hover:scale-125 transition-transform cursor-pointer" />
                        <Frown className="text-red-500 hover:scale-125 transition-transform cursor-pointer" />
                    </div>
                    <Textarea placeholder="Enter your vehicle number and feedback..." />
                    <Button>Send feedback</Button>
                </CardContent>
            </Card>
        </div>
    );
};
export default FeedbackMiscPage;