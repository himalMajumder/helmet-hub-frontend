import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

interface Dealer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const DealerDirectory = () => {
  const { toast } = useToast();
  const [dealers, setDealers] = useState<Dealer[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Here you would typically process and validate the data before inserting
        console.log('Parsed Excel data:', jsonData);
        
        toast({
          title: "Success",
          description: "Dealers uploaded successfully",
        });
      } catch (error) {
        console.error('Error processing Excel file:', error);
        toast({
          title: "Error",
          description: "Failed to process Excel file",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleEdit = (dealer: Dealer) => {
    console.log("Editing dealer:", dealer);
    toast({
      title: "Edit Dealer",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleView = (dealer: Dealer) => {
    console.log("Viewing dealer:", dealer);
    toast({
      title: "View Dealer",
      description: `Viewing details for ${dealer.name}`,
    });
  };

  const handleDelete = async (dealer: Dealer) => {
    try {
      const { error } = await supabase
        .from('dealers')
        .delete()
        .eq('id', dealer.id);

      if (error) throw error;

      setDealers(dealers.filter((d) => d.id !== dealer.id));
      toast({
        title: "Dealer Deleted",
        description: `${dealer.name} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting dealer:', error);
      toast({
        title: "Error",
        description: "Failed to delete dealer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dealer Directory</h1>
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="excel-upload"
          />
          <label htmlFor="excel-upload">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload Excel
            </Button>
          </label>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dealers.map((dealer) => (
            <TableRow key={dealer.id}>
              <TableCell>{dealer.name}</TableCell>
              <TableCell>{dealer.email}</TableCell>
              <TableCell>{dealer.phone}</TableCell>
              <TableCell>{dealer.address}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(dealer)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(dealer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(dealer)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DealerDirectory;