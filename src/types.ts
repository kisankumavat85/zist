export type ServerAction<Input, Output, OtherArgs = null> = (
  args: Input,
  otherArgs?: OtherArgs,
) => Promise<Output>;
