import Image from "next/image";
import Typewriter from "@/components/typeWriter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Lillliant",
  description: "Welcome to Lillliant's personal website!",
};

export default function Home() {
  return (
    <main>
      <div className="pt-24 flex flex-col items-center justify-center">
        <div className="h-50 w-50 overflow-hidden rounded-full bg-amber-200">
          <Image
            src="/avatar.png"
            alt="My Avatar"
            width={200}
            height={200}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="p-4 w-full max-w-xl text-center">
          <Typewriter
            text="Hello, Welcome to My Website!"
            className="font-mono text-3xl font-bold text-center"
          />
        </div>
      </div>
    </main>
  );
}
