export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800/60 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
      <p>© {currentYear} Christine Wong. All rights reserved.</p>
    </footer>
  );
}
