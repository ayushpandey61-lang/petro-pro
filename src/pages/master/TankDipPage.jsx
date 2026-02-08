import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import TankLorryForm from '@/pages/master/forms/TankLorryForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

const TankDipPage = () => {
  const [tankLorries, setTankLorries] = useLocalStorage('tankLorries', []);
  const [tanks] = useLocalStorage('tanks', []);
  const [editingLorry, setEditingLorry] = useState(null);
  const { toast } = useToast();

  const handleSave = (lorryData) => {
    if (editingLorry) {
      setTankLorries(tankLorries.map(l => l.id === editingLorry.id ? { ...l, ...lorryData } : l));
      toast({ title: "Success", description: "Tank dip details updated successfully." });
    } else {
      setTankLorries([...tankLorries, { ...lorryData, id: `TL-${Date.now()}` }]);
      toast({ title: "Success", description: "Tank dip details added successfully." });
    }
    setEditingLorry(null);
  };

  const handleEdit = (lorry) => {
    setEditingLorry(lorry);
  };

  const handleDelete = (id) => {
    setTankLorries(tankLorries.filter(l => l.id !== id));
    toast({ title: "Success", description: "Tank dip details deleted successfully." });
  };
  
  const getTankName = (tankId) => {
    const tank = tanks.find(t => t.id === tankId);
    return tank ? tank.tankName : 'N/A';
  }

  const columns = [
    { accessorKey: "id", header: "S.No" },
    { 
      accessorKey: "tankId", 
      header: "Tank Name",
      cell: ({ row }) => getTankName(row.original.tankId)
    },
    { accessorKey: "dipInMM", header: "Dip in MM" },
    { accessorKey: "volumeInLtrs", header: "Volume in Ltrs" },
    { accessorKey: "type", header: "Type" },
    {
      id: "actions",
      cell: ({ row }) => {
        const lorry = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(lorry)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(lorry.id)} className="text-destructive">
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
        <title>Tank Dip Management - PetroPro</title>
        <meta name="description" content="Manage your tank dip and volume details." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <TankLorryForm onSave={handleSave} lorry={editingLorry} />
        <Card className="glass">
           <CardHeader>
            <CardTitle>Tank Dip List</CardTitle>
            <CardDescription>A list of all tank dip records.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={tankLorries} filterColumn="tankId" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default TankDipPage;