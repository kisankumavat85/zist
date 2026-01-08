"use client";

import { FileInput } from "@/components/file-input";
import { StatusIndictor } from "@/components/status-indicator";
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
import { useState } from "react";

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
    type: "TXT",
    date: "14 Dec 2025",
    status: "completed",
  },
] as const;

const DataPage = () => {
  const [fileId, setFileId] = useState<string | null>(null);

  const handleFileSelect = (id: string) => {
    console.log(id);
    setFileId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-8 text-purple-500-500">
      <FileInput />
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 id="uploaded-files" className="text-2xl font-semibold">
            Uploaded Files ({dummyDataList.length})
          </h2>
          <Button disabled={!fileId}>Use File</Button>
        </div>
        <RadioGroup
          className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4"
          onValueChange={handleFileSelect}
          value={fileId}
        >
          {dummyDataList.map((item) => (
            <Label key={item.fileName} className="block" htmlFor={item.id}>
              <Card className="p-4 gap-2 shadow-none">
                <CardHeader className="p-0">
                  <CardTitle className="flex gap-1">{item.fileName}</CardTitle>
                  <CardDescription>
                    <StatusIndictor variant={item.status} />
                  </CardDescription>
                  <CardAction className="flex flex-col items-end gap-2">
                    {item.status === "completed" && (
                      <RadioGroupItem
                        value={item.id}
                        id={item.id}
                        checked={Boolean(item.id === fileId)}
                      />
                    )}
                  </CardAction>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription>
                    <b>File type:</b> {item.type}
                  </CardDescription>
                  <CardDescription>
                    <b>Uploaded on:</b> {item.date}
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
