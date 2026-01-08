"use client";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Paperclip, Plus, Send } from "lucide-react";
import { Card } from "./ui/card";
import { useRef } from "react";

const PromptInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddFileClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Card className="w-full p-6 gap-2">
      <Textarea
        className="text-2xl resize-none"
        placeholder="Ask anything about files"
      />
      <div className="flex justify-between items-center">
        {/* TODO: Remove input and implement menu */}
        <input
          ref={inputRef}
          type="file"
          name="prompt-input"
          id="prompt-input"
          className="hidden"
          onChange={(event) => {
            console.log(event.target.files);
          }}
        />
        <Button variant="outline" onClick={handleAddFileClick}>
          <Plus /> Select files
        </Button>
        <Button size="icon">
          <Send />
        </Button>
      </div>
    </Card>
  );
};

export default PromptInput;
