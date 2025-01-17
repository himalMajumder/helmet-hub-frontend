import { Check, X } from "lucide-react";

interface FileCheckProps {
  file: File | null;
  accept?: string;
  maxSize?: number; // in bytes
}

export const FileCheck = ({ file, accept, maxSize }: FileCheckProps) => {
  if (!file) return null;

  const isValidType = accept ? accept.split(',').some(type => {
    // Handle mime types and extensions
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.match(new RegExp(type.replace('*', '.*')));
  }) : true;

  const isValidSize = maxSize ? file.size <= maxSize : true;

  const isValid = isValidType && isValidSize;

  return (
    <div className="flex items-center gap-2 text-sm mt-1">
      {isValid ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-green-500">File is valid</span>
        </>
      ) : (
        <>
          <X className="w-4 h-4 text-red-500" />
          <span className="text-red-500">
            {!isValidType ? "Invalid file type" : "File is too large"}
          </span>
        </>
      )}
    </div>
  );
};

export default FileCheck;