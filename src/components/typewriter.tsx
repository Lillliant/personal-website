"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  className?: string;
  /** Milliseconds per character */
  speed?: number;
};

export default function Typewriter({
  text,
  className = "",
  speed = 80,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;

    const id = window.setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
      }
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <h1 className={className} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      <span
        className="inline border-r-4 border-amber-500 pr-1 animate-blink"
        aria-hidden
      />
    </h1>
  );
}
