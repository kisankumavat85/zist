"use client";

import clsx from "clsx";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FileUp, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { formatBytes } from "@/utils/file";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type Props = {
  onFileChange: (file: File | null) => void;
  file: File | null;
  error?: string;
  accept?: string;
  maxSize?: number;
  actions?: (args: { file: File | null; error?: string }) => React.ReactNode;
};

export const FileInput = (props: Props) => {
  const {
    onFileChange,
    file,
    error,
    accept,
    maxSize = MAX_FILE_SIZE,
    actions,
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(file || null);

  useEffect(() => {
    setSelectedFile(file);
  }, [file]);

  const onFileInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    onFileChange(file);
  };

  const onFileDelete = () => {
    setSelectedFile(null);
    onFileChange(null);
  };

  const fileSize = selectedFile?.size && formatBytes(selectedFile.size);
  const maxFileSize = formatBytes(maxSize);

  return (
    <Card className="shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="px-6 pb-3">Upload File</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="px-9 flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          name="file-input"
          id="file-input"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />
        <div
          className={clsx(
            "h-28 flex items-center justify-center border  border-dashed rounded-xl",
            {
              "border-secondary-foreground bg-secondary": !error,
              "border-red-400 bg-red-50": error,
            }
          )}
          onClick={onFileInputClick}
        >
          <div className="flex flex-col items-center">
            <FileUp />
            <p>
              {selectedFile && selectedFile.name
                ? selectedFile.name
                : "Click here to select file"}
            </p>
            <p className="text-[14px]">{fileSize && fileSize}</p>
          </div>
        </div>
        <div className="h-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Maximum size: {maxFileSize}</p>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          {selectedFile && (
            <Button variant="ghost" onClick={onFileDelete}>
              <Trash className="text-red-500" />
            </Button>
          )}
        </div>
        {actions && actions({ file, error })}
      </CardContent>
    </Card>
  );
};
