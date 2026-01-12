import { cva } from "class-variance-authority";

const statusMap = {
  ready: "Ready to use",
  queued: "Queued",
  processing: "Processing",
  failed: "Failed",
};

const statusIndicator = cva(["text-xs px-3 py-1 rounded-2xl"], {
  variants: {
    intent: {
      processing:
        "text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-800/30",
      ready:
        "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-800/30",
      queued:
        "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-800/30",
      failed: "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-800/30",
    },
  },
});

type Props = {
  variant: "queued" | "processing" | "ready" | "failed";
};

export const StatusIndictor = (props: Props) => {
  const { variant } = props;
  const className = statusIndicator({
    intent: variant,
  });
  return <span className={className}>{statusMap[variant]}</span>;
};
