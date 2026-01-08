import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="min-h-dvh flex h-full justify-center items-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;
