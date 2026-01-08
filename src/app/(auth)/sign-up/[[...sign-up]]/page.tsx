import { SignUp } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="min-h-dvh flex h-full justify-center items-center">
      <SignUp />
    </div>
  );
};

export default SignInPage;
