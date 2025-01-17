import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import * as XLSX from 'xlsx';
import { Trash2, Edit, Eye, Upload } from "lucide-react";

interface Dealer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

const BecomeDealer = () => {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const { toast } = useToast();

  const fetchDealers = async () => {
    try {
      const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDealers(data || []);
    } catch (error) {
      console.error('Error fetching dealers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch dealers"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dealers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dealer deleted successfully"
      });
      
      fetchDealers();
    } catch (error) {
      console.error('Error deleting dealer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete dealer"
      });
    }
  };

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Insert dealers from Excel
        const { error } = await supabase
          .from('dealers')
          .insert(jsonData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Dealers uploaded successfully"
        });
        
        fetchDealers();
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error uploading dealers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload dealers"
      });
    }
  };

  // Fetch dealers on component mount
  useState(() => {
    fetchDealers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dealer Directory</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => document.getElementById('excel-upload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Excel
          </Button>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleExcelUpload}
          />
        </div>
      </div>

      <div className="border rounded-lg">
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
                      onClick={() => console.log('View dealer:', dealer.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log('Edit dealer:', dealer.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(dealer.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BecomeDealer;