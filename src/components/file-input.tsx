"use client";

import clsx from "clsx";
import { ChangeEvent, useRef, useState } from "react";
import { FileUp, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { formatBytes } from "@/utils/file";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const FileInput = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onFileInoutClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setFile(file);
  };

  const fileSize = file?.size && formatBytes(file.size);
  const fileError = Boolean(file?.size && file.size > MAX_FILE_SIZE);

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
        />
        <div
          className="h-28 flex items-center justify-center border border-secondary-foreground border-dashed rounded-xl bg-secondary"
          onClick={onFileInoutClick}
        >
          <div className="flex flex-col items-center">
            <FileUp />
            <p>{file && file.name ? file.name : "Click here to select file"}</p>
            <p className="text-[14px]">{fileSize && fileSize}</p>
          </div>
        </div>
        <div className="h-8 flex items-center justify-between">
          <p
            className={clsx("text-[14px] text-gray-400", {
              "text-red-500": fileError,
            })}
          >
            Maximum size: 2.0MB
          </p>
          {file && (
            <Button variant="ghost" onClick={() => setFile(null)}>
              <Trash className="text-red-500" />
            </Button>
          )}
        </div>
        <Button disabled={!file || fileError}>Upload</Button>
      </CardContent>
    </Card>
  );
};
