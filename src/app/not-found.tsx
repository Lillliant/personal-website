import Link from "next/link";
import Typewriter from "@/components/ui/typeWriter";

export default function NotFound() {
  return (
    <main>
      <div className="my-10 flex flex-1 flex-col items-center justify-center px-4">
        <p className="font-mono text-xs uppercase tracking-wider text-amber-500">
          404 · Page not found
        </p>

        <div className="p-4 w-full max-w-xl text-center">
          <Typewriter
            text="Looks like a wrong turn."
            className="font-mono text-3xl font-bold text-center"
          />
        </div>

        <div className="w-full max-w-xl text-center space-y-5">
          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-transform duration-200 hover:scale-105"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
