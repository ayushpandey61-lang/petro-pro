import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, ChevronsRight, FileWarning, FileWarning as PackageWarning, MailWarning as UserWarning, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useLocalStorage from '@/hooks/useLocalStorage';
import { differenceInDays, parseISO, isToday } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [expiryItems] = useLocalStorage('expiryItems', []);
    const [lubricants] = useLocalStorage('lubricants', []);
    const [creditParties] = useLocalStorage('creditParties', []);
    const [creditSales] = useLocalStorage('creditSales', []);
    const navigate = useNavigate();

    useEffect(() => {
        const checkNotifications = () => {
            const newNotifications = [];

            // 1. Expiry Items
            expiryItems.forEach(item => {
                const daysUntilExpiry = differenceInDays(parseISO(item.expiryDate), new Date());
                if (daysUntilExpiry <= parseInt(item.alertDays) && daysUntilExpiry >= 0) {
                    newNotifications.push({
                        id: `exp-${item.id}`,
                        type: 'expiry',
                        message: `${item.itemName} expires in ${daysUntilExpiry} days.`,
                        icon: <FileWarning className="h-4 w-4 text-orange-500" />,
                        path: '/master/expiry-items'
                    });
                }
            });

            // 2. Low Lubricant Stock
            lubricants.forEach(lube => {
                // Mocking current stock for now, as it's not stored
                const currentStock = Math.floor(Math.random() * (parseInt(lube.minQuantity, 10) + 5)); 
                if (currentStock < parseInt(lube.minQuantity, 10)) {
                    newNotifications.push({
                        id: `lube-${lube.id}`,
                        type: 'stock',
                        message: `Low stock for ${lube.productName}: ${currentStock} units left.`,
                        icon: <PackageWarning className="h-4 w-4 text-red-500" />,
                        path: '/product-stock/minimum-stock'
                    });
                }
            });

            // 3. Credit Limit
            creditParties.forEach(party => {
                const creditLimit = parseFloat(party.creditLimit);
                // Mocking current balance
                const currentBalance = parseFloat(party.openingBalance) + (Math.random() * (creditLimit * 0.4));
                if (currentBalance / creditLimit > 0.9) { // over 90%
                    newNotifications.push({
                        id: `credit-${party.id}`,
                        type: 'credit',
                        message: `${party.organizationName} is near their credit limit.`,
                        icon: <UserWarning className="h-4 w-4 text-yellow-500" />,
                        path: '/master/credit-party'
                    });
                }
            });

            // 4. New Indents/Credit Sales
            const todaySales = creditSales.filter(sale => isToday(parseISO(sale.date)));
            if (todaySales.length > 0) {
                 newNotifications.push({
                    id: `indents-today`,
                    type: 'indent',
                    message: `You have ${todaySales.length} new credit sale(s) today.`,
                    icon: <ShoppingCart className="h-4 w-4 text-blue-500" />,
                    path: '/day-business/credit-sale'
                });
            }

            setNotifications(newNotifications);
        };

        checkNotifications();
        const interval = setInterval(checkNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [expiryItems, lubricants, creditParties, creditSales]);
    
    const handleNavigation = (path) => {
        if(path) navigate(path);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 justify-center items-center text-white text-[8px] font-bold">
                            {notifications.length}
                          </span>
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">{notifications.length}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <DropdownMenuItem key={notif.id} onSelect={() => handleNavigation(notif.path)} className="cursor-pointer">
                                <div className="flex items-start gap-3 py-2">
                                    {notif.icon}
                                    <span className="text-sm flex-1 whitespace-normal">{notif.message}</span>
                                    <ChevronsRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="text-center text-sm text-muted-foreground p-4">
                            You're all caught up!
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;