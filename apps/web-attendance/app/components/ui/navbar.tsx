import {NavLink, redirect, useNavigate, useNavigation, useOutletContext} from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import {Bars3Icon} from "@heroicons/react/24/solid";
import type { SelfUserInfo } from "@repo/shared-types";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "~/api/config";

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
  {
    name: "Attendance",
    href: "/attendance"
  }
];

const linkClass = "text-sm font-medium transition-colors hover:text-primary";

export default function Navbar() {
  const [ userInfo, setUserInfo ] = useState<SelfUserInfo>();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const response = await axios.get(`${API_URL}/user/me`, {
        withCredentials: true,
      });

      setUserInfo(response.data);
    }

    fetchUser();
  }, []);

  async function handleLogout() {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true,
    });

    localStorage?.setItem("isLoggedIn", "0");
    localStorage?.setItem("hasAdminAccess", "0");

    navigate("/");
  }

  return (
    <nav
      className="flex flex-row justify-between items-center w-full pl-5 pr-8 py-4 text-sm bg-white border-b-1 border-gray-100"
    >
      <h1 className="font-extrabold text-xl cursor-pointer" onClick={() => navigate("/dashboard")}>DexaGroup</h1>
      <div className={"hidden sm:flex flex-row gap-8 items-center "}>
        {
          Links.map(({ name, href }) => (
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
        {
          typeof window !== "undefined" && localStorage?.getItem("hasAdminAccess") === "1" &&
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
            { userInfo?.name }
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={5} side="bottom">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <div>{ userInfo?.name }</div>
                <div className="font-light text-muted-foreground">{ userInfo?.email }</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="sm:hidden flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-black px-4 py-2 text-white rounded-sm cursor-pointer">
            <Bars3Icon className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={5} side="bottom">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <div>{ userInfo?.name }</div>
                <div className="font-light text-muted-foreground">{ userInfo?.email }</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
            {
              typeof window !== "undefined" && localStorage?.getItem("hasAdminAccess") === "1" && (
                <>
                  <DropdownMenuItem onClick={() => navigate("/employee")}>Employee</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/attendance")}>Attendance</DropdownMenuItem>
                </>
              )
            }
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}