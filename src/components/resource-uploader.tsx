"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { FileInput } from "./file-input";
import { uploadResource } from "@/actions/resources";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { SelectResource } from "@/db/schema";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

type Props = {
  onSuccess?: (resource: SelectResource) => void;
};

const ResourceUploader = (props: Props) => {
  const { onSuccess } = props;
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setFileError("");
      return;
    }

    setFile(file);

    if (file.type !== "application/pdf") {
      setFileError("File type is not PDF");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size is too big");
      return;
    }
    setFileError("");
  };

  const handleFileDelete = () => {
    setFile(null);
    setFileError("");
  };

  const onUploadClick = async (file: File) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("resource", file);
    const { success, resource, message } = await uploadResource(formData);

    if (success) {
      setFile(null);
      toast.success("File uploaded successfully");
      if (onSuccess && resource) onSuccess(resource);
    } else {
      toast.error(message);
    }

    setIsUploading(false);
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="px-6 pb-3">Upload File</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="px-9 flex flex-col gap-2">
        <FileInput
          onFileChange={handleFileChange}
          file={file}
          error={fileError}
          maxSize={MAX_FILE_SIZE}
          accept="application/pdf"
          onFileDelete={handleFileDelete}
        />
        <Button
          disabled={!file || !!fileError || isUploading}
          onClick={() => file && onUploadClick(file)}
        >
          {isUploading && <Spinner />}Upload
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourceUploader;
