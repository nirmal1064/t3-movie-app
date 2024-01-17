"use client";
import { Clapperboard, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { FormEvent, useMemo, useState } from "react";
import { Input } from "~/components/ui/input";
import { AUTH_NAV_ITEMS, DEFAULT_NAV_ITEMS } from "~/lib/constants";
import NavItem from "./NavItem";
import { ModeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [toogleSearchBox, setToogleSearchBox] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const session = useSession();
  const navItems = useMemo(
    () =>
      session.status === "authenticated" ? AUTH_NAV_ITEMS : DEFAULT_NAV_ITEMS,
    [session.status],
  );
  const router = useRouter();

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(searchValue);
    if (searchValue.length < 2) {
      return;
    }
    router.push(`/search?q=${searchValue}`);
  }

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full bg-background px-20 shadow-md md:px-24`}
    >
      <div className="flex items-center justify-between p-2 px-4 md:gap-1 md:px-10">
        <div className="flex cursor-pointer items-center justify-center gap-1 text-2xl">
          <Clapperboard color="red" />
          <h1 className="text-red-500">MovieFlix</h1>
        </div>
        {!toogleSearchBox && (
          <div className="flex items-center gap-4">
            <ul className="hidden gap-4 text-lg text-foreground md:static md:flex md:items-center">
              {navItems.map((navItem) => (
                <NavItem
                  href={navItem.href}
                  label={navItem.label}
                  key={navItem.href}
                />
              ))}
            </ul>
            <ModeToggle />
            {session.status === "authenticated" && (
              <span className="cursor-pointer text-lg text-foreground transition-all">
                <Search onClick={() => setToogleSearchBox(true)} />
              </span>
            )}
          </div>
        )}
        {session.status === "authenticated" && toogleSearchBox && (
          <form
            className="relative rounded-md duration-1000"
            onBlur={() => setToogleSearchBox(false)}
            onSubmit={handleSearch}
          >
            <span className="absolute bottom-0 top-0 my-auto translate-y-[20%] cursor-pointer text-lg text-foreground">
              <Search />
            </span>
            <Input
              className="w-[200px] border-none pl-8 pr-3 text-foreground md:w-80"
              name="search"
              placeholder="Search Anything..."
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              // className="w-[200px] border-none px-3 py-2 text-foreground outline-none focus:border-none focus:outline-none focus-visible:ring-transparent md:w-80"
              autoFocus={true}
            />
          </form>
        )}
      </div>
    </nav>
  );
}
