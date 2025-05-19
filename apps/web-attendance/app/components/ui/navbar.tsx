import { NavLink } from "react-router";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";

const Links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  }
];

const LinksAdmin = [
  {
    name: "Employee",
    href: "/employee"
  },
];

const linkClass = "text-sm font-medium transition-colors hover:text-primary";

export default function Navbar() {
  return (
    <nav
      className="flex flex-row justify-between items-center w-full pl-5 pr-8 py-4 text-sm bg-white border-b-1 border-gray-100"
    >
      <h1 className="font-extrabold text-xl">DexaGroup</h1>
      <div className={"flex xl:flex-row gap-8 items-center " + "flex-col"}>
        {
          Links.map(({ name, href }) => (
            <NavLink
              key={name}
              to={href}
              className={
              ({ isActive, isPending }) =>
                isActive ? linkClass : `${linkClass} text-muted-foreground` }
            >
              { name }
            </NavLink>
          ))
        }
        {
          LinksAdmin.map(({ name, href }) => (
            <NavLink
              key={name}
              to={href}
              className={
                ({ isActive }) =>
                  isActive ? linkClass : `${linkClass} text-muted-foreground` }
            >
              { name }
            </NavLink>
          ))
        }
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-black px-4 py-2 text-white rounded-sm cursor-pointer">
            Lemuel Lancaster
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={5} side="bottom">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <div>Lemuel Lancaster</div>
                <div className="font-light text-muted-foreground">lemuel.lancaster@dexagroup.com</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}