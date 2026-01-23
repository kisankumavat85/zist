import { memo } from "react";

// 150: Prompt input height
// 60 : Header
// 12 : Padding around message container
// 6  : White space on top after scroll
const height = 150 + 60 + 12 + 6;

export const ChatSpace = memo(() => {
  return (
    <div
      style={{
        marginBottom: `calc(${height}px - 100vh)`,
        height: `calc(100vh - ${height}px)`,
      }}
      className={`invisible pointer-events-none p-3`}
    />
  );
});

ChatSpace.displayName = "ChatSpace";
