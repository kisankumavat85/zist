"use client";

import clsx from "clsx";
import { ChangeEvent, DragEvent } from "react";
import { CloudUpload, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { formatBytes } from "@/utils/file";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type Props = {
  onFileChange: (file: File | null) => void;
  file: File | null;
  error?: string;
  accept?: string;
  maxSize?: number;
  onFileDelete: () => void;
};

export const FileInput = (props: Props) => {
  const {
    onFileChange,
    file,
    error,
    accept,
    maxSize = MAX_FILE_SIZE,
    onFileDelete,
  } = props;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files", e.target.files);
    if (!e.target.files) return;
    const file = e.target.files[0];
    onFileChange(file);
  };

  const fileSize = file?.size && formatBytes(file.size);
  const maxFileSize = formatBytes(maxSize);

  const handleOnDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    onFileChange(file);
  };

  const handleOnDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        id="drag-zone"
        onDrop={handleOnDrop}
        onDragOver={handleOnDragOver}
        htmlFor="file-input"
        className={clsx(
          "h-28 flex items-center justify-center border  border-dashed rounded-xl",
          {
            "border-secondary-foreground bg-secondary": !error,
            "border-red-400 bg-red-50 dark:bg-red-900/5": error,
          }
        )}
      >
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept={accept}
          hidden
        />
        <div className="flex flex-col items-center gap-1">
          <CloudUpload />
          {file && file.name ? (
            <p>{file.name}</p>
          ) : (
            <p>
              <span className="underline">Browse files</span> or drag and drop
              file
            </p>
          )}
          <p className="text-[14px]">{fileSize && fileSize}</p>
        </div>
      </label>
      <div className="h-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Maximum size: {maxFileSize}</p>
          {error && (
            <p className="text-sm text-red-500 dark:text-red-500/75">{error}</p>
          )}
        </div>
        {file && (
          <Button variant="ghost" onClick={onFileDelete}>
            <Trash className="text-red-500 dark:text-red-500/75" />
          </Button>
        )}
      </div>
    </div>
  );
};
