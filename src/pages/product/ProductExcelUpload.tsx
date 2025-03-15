import ProductImportForm from "@/components/product/ProductImportForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import axiosConfig from "@/lib/axiosConfig";
import { useAppContext } from "@/contexts/AppContext";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const fetchTemplateDownloadUrl = async (token: string) => {
    try {
        const response = await axiosConfig({
            method: "get",
            url: "/products/import-template",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data.download_url;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to download template");
    }
};



const ProductExcelUpload = () => {
    const { authenticated_token } = useAppContext();
    const { toast } = useToast();


    const downloadMutation = useMutation({
        mutationKey: ["downloadTemplateOfProducts"],
        mutationFn: () => fetchTemplateDownloadUrl(authenticated_token),
        onSuccess: (downloadUrl) => {
            if (downloadUrl) {
                window.open(downloadUrl);
            } else {
                toast({ title: "Error", description: "Invalid download URL", variant: "destructive" });
            }
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to download template",
                variant: "destructive",
            });
        },
    });

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold mb-8">Import Products</h1>
                <Button onClick={() => downloadMutation.mutate()} disabled={downloadMutation.isPending}>
                    <Download className="w-4 h-4 mr-2" />
                    {downloadMutation.isPending ? "Downloading..." : "Download Template"}
                </Button>
            </div>
            <Card className="p-6">
                <ProductImportForm />
            </Card>
        </div>
    );
};

export default ProductExcelUpload;