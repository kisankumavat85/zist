export type ServerAction<Args extends unknown[], Output> = (
  ...args: Args
) => Promise<Output>;
