import Image from "next/image";
import Typewriter from "@/components/typewriter";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="relative h-50 w-50 rounded-full bg-amber-200">
          <Image
            src="/avatar.png"
            alt="My Avatar"
            fill
            sizes="(max-width: 100px) 25vw, 25vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="mt-4 w-full max-w-xl px-4">
          <Typewriter
            text="Hello, Welcome to My Website!"
            className="font-mono text-3xl font-bold text-center"
          />
        </div>
      </div>
    </main>
  );
}
