"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { FileInput } from "./file-input";
import { uploadResource } from "@/actions/resources";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ResourceUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = (file: File | null) => {
    if (!file) {
      setFileError("");
      return;
    }

    if (file.type !== "application/pdf") {
      setFileError("File type is not PDF");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size is too big");
      return;
    }
    setFileError("");
    setFile(file);
  };

  const onUploadClick = async (file: File) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("resource", file);
    const result = await uploadResource(formData);

    if (result.success) {
      setFile(null);
      toast.success("File uploaded successfully");
    } else {
      toast.error(result.message);
    }

    setIsUploading(false);
  };
  return (
    <FileInput
      onFileChange={handleFileChange}
      file={file}
      error={fileError}
      maxSize={MAX_FILE_SIZE}
      accept=".pdf"
      actions={({ file }) => (
        <Button
          disabled={!file || !!fileError || isUploading}
          onClick={() => file && onUploadClick(file)}
        >
          {isUploading && <Spinner />}Upload
        </Button>
      )}
    />
  );
};

export default ResourceUploader;
