import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <h1 className="text-5xl">Landing Page</h1>
      <p>
        <Link href="/sign-in">Sign In</Link>
      </p>
      <p>
        <Link href="/sign-up">Sign Up</Link>
      </p>
      <p>
        <Link href="/chat">App</Link>
      </p>
    </div>
  );
}
