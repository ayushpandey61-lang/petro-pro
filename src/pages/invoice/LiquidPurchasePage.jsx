import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import LiquidPurchaseForm from '@/pages/invoice/forms/LiquidPurchaseForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Edit, Trash2, Eye, Printer, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SamplePrintForm from '@/pages/invoice/components/SamplePrintForm';

const ViewPurchaseDetails = ({ purchase }) => {
  if (!purchase) return null;

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Invoice Details: {purchase.invoiceNo}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Serial No:</strong> {purchase.id}</div>
          <div><strong>Invoice Date:</strong> {purchase.invoiceDate}</div>
          <div><strong>Vendor:</strong> {purchase.vendorName}</div>
          <div><strong>Total Amount:</strong> ₹{parseFloat(purchase.totalAmount).toLocaleString('en-IN')}</div>
          <div className="col-span-2"><strong>Description:</strong> {purchase.description}</div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Products</h4>
          {purchase.products.map((p, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                <div><strong>Product:</strong> {p.productName}</div>
                <div><strong>Qty:</strong> {p.qty} Liters</div>
                <div><strong>Cost:</strong> ₹{p.cost}</div>
                <div><strong>Rs/Liter:</strong> ₹{p.rsPerLiter}</div>
                <div><strong>Invoice Density:</strong> {p.invoiceDensity} KG/M³</div>
                <div><strong>Observed Temp:</strong> {p.observedTemperature}°C</div>
                <div><strong>Observed Density:</strong> {p.observedDensity} KG/M³</div>
                <div className="font-bold"><strong>Density at 15°C:</strong> {p.densityAt15C} KG/M³</div>
                <div><strong>Variation:</strong> {p.variation}</div>
                <div><strong>Tank Lorry No:</strong> {p.tankLorryNo}</div>
                <div><strong>Decanted Tank No:</strong> {p.decantedTankNo}</div>
                <div className="font-bold"><strong>Inclusive Rate (Rs/Liter):</strong> {p.inclRate}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DialogContent>
  );
}

const ViewInvoiceImage = ({ purchase }) => {
    if (!purchase || !purchase.image) return null;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Invoice - ${purchase.invoiceNo}</title></head><body style="margin:0;"><img src="${purchase.image}" style="width:100%;"></body></html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Invoice Image: {purchase.invoiceNo}</DialogTitle>
            </DialogHeader>
            <div className="my-4">
                <img src={purchase.image} alt={`Invoice ${purchase.invoiceNo}`} className="w-full h-auto object-contain rounded-md" />
            </div>
            <Button onClick={handlePrint} className="w-full"><Printer className="mr-2 h-4 w-4" /> Print Image</Button>
        </DialogContent>
    );
};


const LiquidPurchasePage = () => {
  const [purchases, setPurchases] = useLocalStorage('liquidPurchases', []);
  const [firmProfile] = useLocalStorage('firmProfile', {});
  const [orgDetails] = useLocalStorage('orgDetails', {});
  const [viewingPurchase, setViewingPurchase] = useState(null);
  const [printingPurchase, setPrintingPurchase] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const { toast } = useToast();

  const handleSave = (purchaseData) => {
    if (purchaseData.id) { // Editing existing
      const updatedPurchases = purchases.map(p => p.id === purchaseData.id ? { ...purchaseData, updated: new Date().toLocaleString() } : p);
      setPurchases(updatedPurchases);
      toast({ title: "Success", description: "Liquid purchase updated successfully." });
    } else { // Creating new
      const newPurchase = { ...purchaseData, id: `LP-${Date.now()}`, created: new Date().toLocaleString() };
      setPurchases([...purchases, newPurchase]);
      toast({ title: "Success", description: "Liquid purchase saved successfully." });
      setPrintingPurchase(newPurchase);
    }
    setEditingPurchase(null);
  };

  const handleEdit = (purchase) => {
    setEditingPurchase(purchase);
    setViewingPurchase(null);
    setPrintingPurchase(null);
    setViewingImage(null);
  };
  
  const handleDelete = (id) => {
    setPurchases(purchases.filter(p => p.id !== id));
    toast({ variant: "destructive", title: "Deleted", description: "Purchase record deleted." });
  }

  const columns = [
    { accessorKey: "id", header: "Serial No." },
    { accessorKey: "invoiceDate", header: "Invoice Date" },
    { accessorKey: "invoiceNo", header: "Invoice No." },
    { 
      accessorKey: "image", 
      header: "Image",
      cell: ({ row }) => row.original.image ? <img src={row.original.image} alt="invoice" className="h-10 w-10 object-cover rounded-md" /> : 'No Image'
    },
    { accessorKey: "vendorName", header: "Vendor" },
    { accessorKey: "description", header: "Description" },
    { 
      id: 'amount',
      header: 'Amount',
      cell: ({ row }) => `₹${parseFloat(row.original.totalAmount).toLocaleString('en-IN')}`
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild><DropdownMenuItem onClick={() => setViewingPurchase(row.original)}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem></DialogTrigger>
              {row.original.image && <DialogTrigger asChild><DropdownMenuItem onClick={() => setViewingImage(row.original)}><FileImage className="mr-2 h-4 w-4" /> View Image</DropdownMenuItem></DialogTrigger>}
              <DialogTrigger asChild><DropdownMenuItem onClick={() => setPrintingPurchase(row.original)}><Printer className="mr-2 h-4 w-4" /> Print Sample Form</DropdownMenuItem></DialogTrigger>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.original.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {viewingPurchase && viewingPurchase.id === row.original.id && <ViewPurchaseDetails purchase={viewingPurchase} />}
          {printingPurchase && printingPurchase.id === row.original.id && <SamplePrintForm purchase={printingPurchase} firmProfile={firmProfile} />}
          {viewingImage && viewingImage.id === row.original.id && <ViewInvoiceImage purchase={viewingImage} />}
        </Dialog>
      )
    },
    {
      id: 'userlog',
      header: 'User Log',
      cell: ({ row }) => <div className="text-xs">
          <div>Created: {row.original.created}</div>
          {row.original.updated && <div>Updated: {row.original.updated}</div>}
        </div>
    }
  ];

  return (
    <>
      <Helmet>
        <title>Liquid Purchase - PetroPro</title>
        <meta name="description" content="Manage liquid (fuel) purchases and invoices." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <LiquidPurchaseForm key={editingPurchase ? editingPurchase.id : 'new'} onSave={handleSave} initialData={editingPurchase} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable columns={columns} data={purchases} filterColumn="vendorName" orgDetails={orgDetails} reportTitle="Liquid Purchases" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default LiquidPurchasePage;