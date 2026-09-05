import Link from "next/link";
import ThemeToggler from "@/components/themetoggler";

export default function Navbar() {
  return (
    <header>
      <nav className="grid grid-cols-2 [&>*]:border [&>*]:border-red-500">
        <div>
          {/* Logo will go here */}
          Lillliant
        </div>
        <div className="flex flex-row justify-end gap-4 pr-4 [&>*]:border [&>*]:border-green-500">
          <div className="flex flex-row justify-end justify-items-center pr-2 [&>*]:border [&>*]:border-blue-500">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>{/* Theme toggle button will go here */}<ThemeToggler /></div>
        </div>
      </nav>
    </header>
  );
}
