"use client";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Paperclip, Send } from "lucide-react";
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
    <Card className="max-w-180 w-180 p-6 gap-2">
      <Textarea
        className="text-2xl resize-none"
        placeholder="Ask anything about files"
      />
      <div className="flex justify-between items-center">
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
          <Paperclip /> Add files
        </Button>
        <Button size="icon">
          <Send />
        </Button>
      </div>
    </Card>
  );
};

export default PromptInput;
