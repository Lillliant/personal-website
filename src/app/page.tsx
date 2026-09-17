import Image from "next/image";
import Link from "next/link";
import Typewriter from "@/components/typeWriter";
import { Metadata } from "next";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Home | Christine Wong",
  description: "CS graduate building for the web and exploring AI/ML.",
};

export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center px-4">
        <div className="h-50 w-50 overflow-hidden rounded-full bg-amber-200">
          <Image
            src="/avatar.png"
            alt="Christine's avatar"
            width={200}
            height={200}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="p-4 w-full max-w-xl text-center">
          <Typewriter
            text="Hi, I'm Christine."
            className="font-mono text-3xl font-bold text-center"
          />
        </div>

        <div className="w-full max-w-xl text-center space-y-5">
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            I recently finished my CS degree and spend most of my time around
            web development and machine learning. I&apos;ve worked on full-stack
            apps, autonomous agent tools, and intrusion detection pipelines.
          </p>

          <ul className="flex flex-wrap items-center justify-center font-mono text-sm text-zinc-500 dark:text-zinc-300">
            {["Web Development", "AI / ML", "Agentic Systems"].map((item) => (
              <li
                key={item}
                className="inline-flex items-center before:mx-2 before:content-['·'] before:text-zinc-400 first:before:content-none dark:before:text-zinc-600"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/project"
              className="inline-flex items-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-transform duration-200 hover:scale-105"
            >
              See what I&apos;ve built
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 transition-transform duration-200 hover:scale-105 dark:border-zinc-600 dark:text-zinc-100"
            >
              Read what I&apos;ve written
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2 pt-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Find me on
            </span>
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://github.com/Lillliant"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:transition-all hover:duration-200 hover:scale-110 hover:border-amber-400 hover:text-amber-500 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-amber-400 dark:hover:text-amber-400"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/christine-wong-6828b0193"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:transition-all hover:duration-200 hover:scale-110 hover:border-amber-400 hover:text-amber-500 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-amber-400 dark:hover:text-amber-400"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href="mailto:christinewong.dev@outlook.com"
                aria-label="Email"
                title="Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 hover:transition-all hover:duration-200 hover:scale-110 hover:border-amber-400 hover:text-amber-500 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-amber-400 dark:hover:text-amber-400"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
