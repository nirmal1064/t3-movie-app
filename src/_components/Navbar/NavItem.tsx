import Link from "next/link";

export type Props = { label: string; href: string };

export default function NavItem({ label, href }: Props) {
  return (
    <li className="cursor-pointer select-none p-1 hover:text-gray-400">
      <Link href={href}>{label}</Link>
    </li>
  );
}
