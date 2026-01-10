"use client";

import { uploadResource } from "@/actions/resources";
import { FileInput } from "@/components/file-input";
import { StatusIndictor } from "@/components/status-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const dummyDataList = [
  {
    id: "1",
    fileName: "Resume",
    type: "pdf",
    date: "14 Dec 2025",
    status: "in-progress",
  },
  {
    id: "2",
    fileName: "Customers",
    type: "csv",
    date: "14 Dec 2025",
    status: "queued",
  },
  {
    id: "3",
    fileName: "File",
    type: "txt",
    date: "14 Dec 2025",
    status: "failed",
  },
  {
    id: "4",
    fileName: "Report",
    type: "docx",
    date: "14 Dec 2025",
    status: "completed",
  },
  {
    id: "5",
    fileName: "File 2",
    type: "txt",
    date: "14 Dec 2025",
    status: "completed",
  },
] as const;

const DataPage = () => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (id: string) => {
    console.log(id);
    setSelectedFileId((prevId) => (prevId === id ? null : id));
  };

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

    console.log("result", result);

    if (result.success) {
      setFile(null);
      toast.success("File uploaded successfully");
    } else {
      toast.error(result.message);
    }

    setIsUploading(false);
  };

  return (
    <div className="flex flex-col gap-8 text-purple-500-500">
      <FileInput
        onFileChange={handleFileChange}
        file={file}
        error={fileError}
        maxSize={MAX_FILE_SIZE}
        actions={({ file }) => (
          <Button
            disabled={!file || !!fileError || isUploading}
            onClick={() => file && onUploadClick(file)}
          >
            {isUploading && <Spinner />}Upload
          </Button>
        )}
      />
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 id="uploaded-files" className="text-2xl font-semibold">
            Resource files ({dummyDataList.length})
          </h2>
          <Button disabled={!selectedFileId}>Use resource</Button>
        </div>
        <RadioGroup
          className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4"
          onValueChange={handleFileSelect}
          value={selectedFileId}
        >
          {dummyDataList.map((item) => (
            <Label key={item.fileName} className="block" htmlFor={item.id}>
              <Card className="p-4 gap-2 shadow-none">
                <CardHeader className="p-0">
                  <CardTitle className="flex gap-1">{item.fileName}</CardTitle>
                  <CardDescription>
                    <p>
                      <b>Uploaded on:</b> {item.date}
                    </p>
                  </CardDescription>
                  <CardAction className="flex flex-col items-end gap-2">
                    {item.status === "completed" && (
                      <RadioGroupItem
                        value={item.id}
                        id={item.id}
                        checked={Boolean(item.id === selectedFileId)}
                      />
                    )}
                  </CardAction>
                </CardHeader>
                <CardContent className="px-0 pt-2">
                  <CardDescription>
                    <div className="flex justify-between">
                      <StatusIndictor variant={item.status} />
                      <Badge variant="secondary">{item.type}</Badge>
                    </div>
                  </CardDescription>
                </CardContent>
              </Card>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default DataPage;
