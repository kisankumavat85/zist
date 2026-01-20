"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { StatusIndictor } from "./status-indicator";
import { Badge } from "./ui/badge";
import { SelectResource } from "@/db/schema/resources";
import dayjs from "dayjs";
import Link from "next/link";

type Props = {
  resources: SelectResource[];
};

const ResourcePicker = (props: Props) => {
  const { resources } = props;
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const handleFileSelect = (id: string) => {
    setSelectedFileId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 id="uploaded-files" className="text-2xl font-semibold">
          Resource files ({resources?.length})
        </h2>
        <Button disabled={!selectedFileId}>
          <Link href={`/chat?r=${selectedFileId}`}>Use resource</Link>
        </Button>
      </div>
      <RadioGroup
        className="grid grid-cols-2 gap-4"
        onValueChange={handleFileSelect}
        value={selectedFileId}
      >
        {resources?.map((item) => (
          <Label key={item.id} className="block" htmlFor={item.id + ""}>
            <Card className="p-4 gap-2 shadow-none">
              <CardHeader className="p-0">
                <CardTitle className="flex gap-1">{item.name}</CardTitle>
                <CardDescription>
                  <p>{dayjs(item.createdAt).format("DD MMM YYYY, hh:mm A")}</p>
                </CardDescription>
                <CardAction className="flex flex-col items-end gap-2">
                  {item.status === "ready" && (
                    <RadioGroupItem
                      value={item.id + ""}
                      id={item.id + ""}
                      checked={Boolean(item.id + "" === selectedFileId)}
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
  );
};

export default ResourcePicker;
