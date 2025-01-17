import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Upload, Eye, Pencil, Trash2, Plus } from "lucide-react";
import * as XLSX from 'xlsx';
import Layout from "@/components/layout/Layout";

interface Dealer {
  id: string;
  dealer_name: string;
  company_name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

const DealerDirectory = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch dealers
  const { data: dealers, isLoading, refetch } = useQuery({
    queryKey: ['dealers'],
    queryFn: async () => {
      console.log('Fetching dealers...');
      const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching dealers:', error);
        throw error;
      }

      console.log('Dealers fetched:', data);
      return data as Dealer[];
    },
  });

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Parsed Excel data:', jsonData);

        // Insert dealers from Excel
        const { error } = await supabase
          .from('dealers')
          .insert(jsonData);

        if (error) {
          console.error('Error uploading dealers:', error);
          toast({
            title: "Upload Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Upload Successful",
            description: `${jsonData.length} dealers imported`,
          });
          refetch();
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error processing Excel file:', error);
      toast({
        title: "Upload Failed",
        description: "Error processing Excel file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
        title: "Dealer Deleted",
        description: "The dealer has been removed successfully",
      });
      refetch();
    } catch (error) {
      console.error('Error deleting dealer:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the dealer",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading dealers...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dealer Directory</h1>
          <div className="flex gap-4">
            <Button asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import Excel
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  disabled={isUploading}
                />
              </label>
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Dealer
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dealer Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealers?.map((dealer) => (
                <TableRow key={dealer.id}>
                  <TableCell>{dealer.dealer_name}</TableCell>
                  <TableCell>{dealer.company_name}</TableCell>
                  <TableCell>{dealer.phone}</TableCell>
                  <TableCell>{dealer.email}</TableCell>
                  <TableCell>{dealer.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
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
    </Layout>
  );
};

export default DealerDirectory;