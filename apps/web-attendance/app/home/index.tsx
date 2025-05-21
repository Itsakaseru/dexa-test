import { redirect } from "react-router";

export function clientLoader() {
    if (localStorage.getItem("isLoggedIn") !== "1") {
      return redirect("/login");
    }

    return redirect("/dashboard");
}

export default function Home() { }