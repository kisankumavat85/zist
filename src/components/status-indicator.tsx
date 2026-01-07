import { cva } from "class-variance-authority";

const statusMap = {
  completed: "Ready to use",
  queued: "Queued",
  "in-progress": "In progress",
  failed: "Failed",
};

const statusIndicator = cva(["text-[10px] px-3 py-1 rounded-2xl"], {
  variants: {
    intent: {
      "in-progress": "text-purple-500 bg-purple-100",
      completed: "text-green-500 bg-green-100",
      queued: "text-blue-500 bg-blue-100",
      failed: "text-red-500 bg-red-100",
    },
  },
});

type Props = {
  variant: "in-progress" | "completed" | "queued" | "failed";
};

export const StatusIndictor = (props: Props) => {
  const { variant } = props;
  const className = statusIndicator({
    intent: variant,
  });
  return <span className={className}>{statusMap[variant]}</span>;
};
