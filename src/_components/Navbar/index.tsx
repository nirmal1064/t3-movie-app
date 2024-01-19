"use client";
import { Clapperboard, Flame, Home, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { MdLibraryAddCheck, MdWatchLater } from "react-icons/md";
import { Input } from "~/components/ui/input";
import { AUTH_NAV_ITEMS, DEFAULT_NAV_ITEMS } from "~/lib/constants";
import NavItem from "./NavItem";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";

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
    <>
      <nav
        className={`fixed left-0 top-0 z-50 mx-auto w-full bg-background px-4 shadow-md md:px-[90px]`}
      >
        <div className="flex items-center justify-between p-2 md:gap-1">
          <div className="flex cursor-pointer items-center justify-center gap-1 text-2xl">
            <Clapperboard color="red" />
            <h1
              className={`${toogleSearchBox && "hidden"} text-red-500 md:block`}
            >
              MovieFlix
            </h1>
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
              <span className="cursor-pointer text-lg text-foreground">
                <Search onClick={() => setToogleSearchBox(true)} />
              </span>
            </div>
          )}
          {session.status === "authenticated" && toogleSearchBox && (
            <form
              className="relative rounded-md"
              onBlur={() => setToogleSearchBox(false)}
              onSubmit={handleSearch}
            >
              <span className="absolute bottom-0 top-0 my-auto translate-y-[20%] cursor-pointer text-lg text-foreground">
                <Search />
              </span>
              <Input
                className="w-[300px] border-none pl-8 pr-3 text-foreground md:w-80"
                name="search"
                placeholder="Search Anything..."
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus={true}
              />
            </form>
          )}
        </div>
      </nav>
      {/* {Bottom Mobile Navigation Bar} */}
      <nav className="fixed bottom-0 left-0 z-50 w-full bg-background md:hidden">
        <ul className="flex w-full items-center justify-center gap-4 pb-0.5 pt-3 text-lg text-foreground">
          <li>
            <Link
              href={"/"}
              className="flex flex-col items-center justify-center"
            >
              <Home className="h-6 w-6" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href={"/"}
              className="flex flex-col items-center justify-center"
            >
              <Flame className="h-6 w-6" />
              <span>Trending</span>
            </Link>
          </li>
          <li>
            <Link
              href={"/watchlist"}
              className="flex flex-col items-center justify-center"
            >
              <MdWatchLater className="h-6 w-6" />
              <span>WatchList</span>
            </Link>
          </li>
          <li>
            <Link
              href={"/mylist"}
              className="flex flex-col items-center justify-center"
            >
              <MdLibraryAddCheck className="h-6 w-6" />
              <span>My List</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
