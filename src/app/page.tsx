import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { faq, howItWorksSteps, whyUseThis } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      {/* Header */}
      <div className="sticky top-0 bg-background shadow px-4 md:px-24 z-10">
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center gap-16">
            <div className="">
              <span className="font-(family-name:--font-bebas-neue) text-3xl">
                ZIST AI
              </span>
            </div>
            <div className="hidden md:flex gap-8">
              <Link href="#">Product</Link>
              <Link href="#">Features</Link>
              <Link href="#">Pricing</Link>
            </div>
          </div>
          <div className="">
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <div className="relative hero-gradient overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        
        <div className="relative z-[1] md:px-24">
          <div className="flex flex-col items-center gap-4 md:gap-8 p-8 md:p-28">
            <h1 className="text-3xl md:text-6xl font-bold text-center animate-fade-in">
              Chat with your Documents. Instantly.
            </h1>
            <p className="text-center md:text-xl animate-fade-in animate-delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
              Transform static PDFs into interactive conversations.
              <br className="hidden md:inline" />
              Powered by RAG and OpenAI to help you extract insights, summaries,
              and answers in seconds.
            </p>
            <div className="flex gap-4 animate-fade-in animate-delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Button asChild className="btn-glow">
                <Link href="/sign-up">Try it Now</Link>
              </Button>
              <Button variant="outline" asChild className="transition-all duration-300 hover:scale-105">
                <Link
                  href="https://github.com/kisankumavat85/zist/"
                  target="_blank"
                >
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full px-4 md:px-20 pt-8 md:pt-0 pb-16 md:pb-24">
            <div className="relative aspect-video md:aspect-16/6 border rounded md:rounded-2xl overflow-hidden image-glow animate-slide-up animate-delay-300 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Image
                src="/zist-dashboard.avif"
                alt="Picture of Zist AI Dashboard"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 md:px-24 py-10 md:py-28">
        <div className="p-4 md:p-18 bg-accent rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center md:items-start gap-4 md:w-[50%]">
              <p className="text-center md:text-left text-xl md:text-2xl">
                How it Works?
              </p>
              <h2 className="text-center md:text-left text-2xl md:text-4xl font-bold">
                From Static File to Intelligent Insight
              </h2>
              <p className="text-center md:text-left">
                Transform static PDFs into interactive conversations. Powered by
                RAG and OpenAI to help you extract insights, summaries, and
                answers in seconds.
              </p>
              <div className="">
                <Button asChild>
                  <Link href="/sign-up">Try it Now</Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:w-[50%]">
              {howItWorksSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 md:gap-3 border rounded-xl md:rounded-2xl p-4 md:p-6 bg-background card-hover"
                >
                  <div className="flex items-center gap-2">
                    <Badge className="md:text-sm bg-gradient-to-r from-purple-500 to-blue-500 border-0">Step {i + 1}</Badge>
                    <h3 className="text-lg md:text-xl font-bold">
                      {step.title}
                    </h3>
                  </div>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Use This? */}
      <div className="px-4 md:px-24 section-gradient">
        <div className="flex flex-col gap-4 md:gap-12 md:px-10">
          <div className="flex flex-col gap-4">
            <p className="text-xl md:text-2xl text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Why Use Zist AI?</p>
            <h2 className="text-2xl md:text-4xl font-bold text-center">
              Smarter than your average PDF Reader
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {whyUseThis.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-xl md:rounded-2xl p-4 md:p-8 bg-accent card-hover border border-transparent hover:border-purple-500/20"
              >
                <p className="text-lg md:text-xl font-bold">{item.title}</p>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-4 md:px-24">
        <div className="flex flex-col items-center gap-4 md:gap-8 py-10 md:py-20">
          <div className="">
            <h2 className="text-4xl font-bold text-center">FAQ</h2>
            <p className="text-center">
              Everything you need to know about Zist AI
            </p>
          </div>

          <Accordion type="single" className="w-full max-w-180">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-24 py-8 bg-accent">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 order-2 md:order-1">
            <div className="">
              <span className="font-(family-name:--font-bebas-neue) text-3xl">
                ZIST AI
              </span>
            </div>
            <div className="">
              <p className="w-full max-w-100">
                Transform static PDFs into interactive conversations. Powered by
                RAG and OpenAI to help you extract insights, summaries, and
                answers in seconds.
              </p>
            </div>
            <p>&#169; 2026 Zist AI.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 order-1 md:order-2">
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Social</span>
              <Link
                href="https://github.com/kisankumavat85/"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/kisan-kumavat/"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                LinkedIn
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Contact</span>
              <Link
                href="mailto:kisankumavat85@gmail.com"
                className="underline"
              >
                kisankumavat85@gmail.com
              </Link>
              <Link href="tel:+919687971417" className="underline">
                +91 96879 71417
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
