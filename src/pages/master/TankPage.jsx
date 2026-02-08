import React, { useState, useCallback } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { DataTable } from '@/components/ui/data-table';
    import { MoreHorizontal, Edit, Trash2, Download } from 'lucide-react';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
    import { Checkbox } from '@/components/ui/checkbox';
    import TankForm from '@/pages/master/forms/TankForm';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';
    import { useOrg } from '@/hooks/useOrg';
    import { generateDipChartPdf } from '@/lib/dipChartGenerator';

    const TankPage = () => {
      const [tanks, setTanks] = useLocalStorage('tanks', []);
      const [fuelProducts] = useLocalStorage('fuelProducts', []);
      const [editingTank, setEditingTank] = useState(null);
      const { toast } = useToast();
      const { orgDetails } = useOrg();

      const handleSave = (tankData) => {
        if (editingTank) {
          setTanks(tanks.map(t => t.id === editingTank.id ? { ...t, ...tankData } : t));
          toast({ title: "Success", description: "Tank updated successfully." });
        } else {
          setTanks([...tanks, { ...tankData, id: `TNK-${Date.now()}` }]);
          toast({ title: "Success", description: "Tank added successfully." });
        }
        setEditingTank(null);
      };

      const handleEdit = (tank) => {
        setEditingTank(tank);
      };

      const handleDelete = (id) => {
        setTanks(tanks.filter(t => t.id !== id));
        toast({ title: "Success", description: "Tank deleted successfully." });
      };

      const handleDownloadDipChart = useCallback(async (tank) => {
        if (!tank.inside_diameter_m || !tank.inside_length_m) {
          toast({
            variant: "destructive",
            title: "Missing Dimensions",
            description: "Please edit the tank and provide inside diameter and length in meters to generate a dip chart.",
          });
          return;
        }
        try {
          await generateDipChartPdf(tank, orgDetails);
          toast({ title: "Success", description: "Dip chart is being downloaded." });
        } catch (error) {
          console.error("Failed to generate dip chart PDF:", error);
          toast({ variant: "destructive", title: "Error", description: "Failed to generate dip chart." });
        }
      }, [orgDetails, toast]);
      
      const getProductName = (productId) => {
        const product = fuelProducts.find(p => p.id === productId);
        return product ? product.productName : 'N/A';
      }

      const columns = [
        {
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: "id",
          header: "S.No",
          cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <span className="font-mono text-sm">{pageIndex * pageSize + row.index + 1}</span>;
          }
        },
        { accessorKey: "tankName", header: "Tank Name" },
        {
          accessorKey: "productId",
          header: "Product",
          cell: ({ row }) => getProductName(row.original.productId)
        },
        { accessorKey: "capacity", header: "Capacity (L)" },
        { accessorKey: "inside_diameter_m", header: "Diameter (M)" },
        { accessorKey: "inside_length_m", header: "Length (M)" },
        {
          id: "actions",
          cell: ({ row }) => {
            const tank = row.original;
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(tank)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadDipChart(tank)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download Dip Chart</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(tank.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ];

      return (
        <>
          <Helmet>
            <title>Tank Management - PetroPro</title>
            <meta name="description" content="Manage your fuel storage tanks." />
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 space-y-6"
          >
            <TankForm onSave={handleSave} tank={editingTank} />
            <Card className="glass">
               <CardHeader>
                <CardTitle>Tank List</CardTitle>
                <CardDescription>A list of all fuel tanks.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-96">
                  <div className="min-w-max">
                    <DataTable columns={columns} data={tanks} filterColumn="tankName" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      );
    };

    export default TankPage;