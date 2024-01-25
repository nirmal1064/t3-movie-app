"use client";
import { Clapperboard, Flame, Heart, LogOut, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { MdOutlineLibraryAddCheck, MdOutlineWatchLater } from "react-icons/md";
import { Input } from "~/components/ui/input";
import { AUTH_NAV_ITEMS, DEFAULT_NAV_ITEMS, ROUTES } from "~/lib/constants";
import NavItem from "./NavItem";
import { ThemeIcon } from "./icons";

export default function Navbar() {
  const session = useSession();
  const navItems = useMemo(
    () =>
      session.status === "authenticated" ? AUTH_NAV_ITEMS : DEFAULT_NAV_ITEMS,
    [session.status],
  );
  const [toogleSearchBox, setToogleSearchBox] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
          <Link href={"/"}>
            <div className="flex cursor-pointer items-center justify-center gap-1 text-2xl">
              <Clapperboard color="red" />
              <h1
                className={`${toogleSearchBox && "hidden"} uppercase text-red-500 md:block`}
              >
                MovieFlix
              </h1>
            </div>
          </Link>
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
              <ThemeIcon />
              <span
                className="ml-[-2] cursor-pointer text-lg text-foreground"
                title="Search"
              >
                <Search onClick={() => setToogleSearchBox(true)} />
              </span>
              <span
                className="cursor-pointer text-lg text-foreground"
                title="Logout"
              >
                <LogOut onClick={() => signOut({ callbackUrl: "/" })} />
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
              <Flame className="h-6 w-6" />
              <span>Trending</span>
            </Link>
          </li>
          <li>
            <Link
              href={ROUTES.FAVORITES}
              className="flex flex-col items-center justify-center"
            >
              <Heart className="h-6 w-6" />
              <span>Favorites</span>
            </Link>
          </li>
          <li>
            <Link
              href={ROUTES.WATCH_LIST}
              className="flex flex-col items-center justify-center"
            >
              <MdOutlineWatchLater className="h-6 w-6" />
              <span>WatchList</span>
            </Link>
          </li>
          <li>
            <Link
              href={ROUTES.MY_LIST}
              className="flex flex-col items-center justify-center "
            >
              <MdOutlineLibraryAddCheck className="h-6 w-6" />
              <span>My List</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
