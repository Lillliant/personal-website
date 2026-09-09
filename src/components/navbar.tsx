import Link from "next/link";
import Image from "next/image";
import ThemeToggler from "@/components/themeToggler";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed w-full flex flex-row justify-center items-center my-2 py-1 px-2">
      <nav className="grid grid-cols-4 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <div className="inline-flex items-center">
          <div className="relative h-10 w-10 rounded-full bg-amber-200">
            <Image
              src="/avatar.png"
              alt="My Avatar"
              fill
              sizes="(max-width: 250px) 25vw, 25vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="col-span-2 inline-flex justify-center gap-4">
          <div className="flex flex-row justify-end items-center gap-4 px-2 [&>*]:transition-transform [&>*]:duration-300 [&>*]:hover:scale-105 [&>*]:hover:opacity-50">
            <Link href="/">Home</Link>
            <Link href="/projects">Portfolio</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
        <div className="inline-flex justify-end">
          <ThemeToggler />
        </div>
      </nav>
    </header>
  );
}
