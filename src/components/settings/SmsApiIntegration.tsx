import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

const SmsApiIntegration = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("52y$105KkJ4nc1owXyWNqZKGkH7SOPIYyltyy0lYs7GfBggCdXcLYO1DiB2K");

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: message,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">SMS API Integration</h2>

      <Card>
        <CardHeader>
          <CardTitle>Text SMS API</CardTitle>
          <CardDescription>Configure your SMS API integration settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your API Key:</label>
            <div className="flex gap-2 mt-1">
              <Input value={apiKey} readOnly />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(apiKey, "API Key copied to clipboard")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Alert>
            <AlertTitle>API URL Non Masking (GET & POST)</AlertTitle>
            <AlertDescription className="break-all">
              http://portal.jadusms.com/smsapi/non-masking?api_key=52y$105KkJ4nc1owXyWNqZKGkH7SOPIYyltyy0lYs7GfBggCdXcLYO1DiB2K&smsType=text&mobileNo=(NUMBER)&smsContent=(Message Content)
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTitle>API URL Masking (GET & POST)</AlertTitle>
            <AlertDescription className="break-all">
              http://portal.jadusms.com/smsapi/masking?api_key=52y$105KkJ4nc1owXyWNqZKGkH7SOPIYyltyy0lYs7GfBggCdXcLYO1DiB2K&smsType=text&maskingID=(MASKING)&mobileNo=(NUMBER)&smsContent=(Message Content)
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Parameter Name</div>
                <div className="font-medium">Meaning/Value</div>
                <div className="font-medium">Description</div>

                <div>api_key</div>
                <div>API Key</div>
                <div>Your API Key: 52y$105KkJ4nc1owXyWNqZKGkH7SOPIYyltyy0lYs7GfBggCdXcLYO1DiB2K</div>

                <div>type</div>
                <div>text/unicode</div>
                <div>text for normal SMS/unicode for Bangla SMS</div>

                <div>contacts</div>
                <div>mobile number</div>
                <div>Exp: 88017XXXXXXXX,88018XXXXXXXX,88019XXXXXXXX...</div>

                <div>msg</div>
                <div>SMS body</div>
                <div>N.B: Please use url encoding to send some special characters like &, $, @ etc</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credit Balance API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="break-all">
                http://portal.jadusms.com/api/balance?api_key=52y$105KkJ4nc1owXyWNqZKGkH7SOPIYyltyy0lYs7GfBggCdXcLYO1DiB2K
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="font-medium">Error Code</div>
                <div className="font-medium">Meaning</div>
                <div>1003</div>
                <div>API Not Found</div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmsApiIntegration;