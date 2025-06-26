import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Footer from "~/components/ui/footer";
import { Form, redirect, useOutletContext } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import * as auth from "~/api/auth";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import type { Route } from "../login/+types";
import type { LoginData } from "@repo/shared-types";

export async function clientAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as unknown as LoginData;

  try {
    if (!data.email || !data.password) {
      return { statusCode: StatusCodes.BAD_REQUEST, message: "Email and password are required!" };
    }

    const res = await auth.login(data);

    localStorage.setItem("isLoggedIn", "1");
    localStorage.setItem("hasAdminAccess", res.data.hasAdminAccess ? "1" : "0");

    return redirect("/dashboard");
  }
  catch (err) {
    if (axios.isAxiosError(err)) {
      switch (err.status) {
        case StatusCodes.UNAUTHORIZED:
          return { statusCode: StatusCodes.UNAUTHORIZED,message: "Invalid email or password!" };

        default:
          return { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: "Internal server error!" };
      }
    }
  }

  return { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, message: "An unknown error occured!" };
}

export default function Index({ actionData }: Route.ComponentProps) {
  const { statusCode, message } = actionData || {};

  return (
    <main className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="flex flex-col md:flex-row w-screen grow items-center justify-center gap-16 md:gap-32">
        <div className="flex flex-col">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold">Attendee</h1>
          <p className="md:text-xl">
            Attendance Portal
          </p>
        </div>
        <div className="bg-white rounded-2xl md:w-4/12 lg:w-3/12 px-8 py-8">
          <Form method="POST" action="/login" className="flex flex-col gap-4">
            {
              message && (
                <Alert className="border-red-400 text-red-400">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    { message }
                  </AlertDescription>
                </Alert>
              )
            }
            <Input name="email" type="email" placeholder="Email" />
            <Input name="password" type="password" placeholder="Password" />
            <Button className="cursor-pointer mt-2">Login</Button>
          </Form>
        </div>
      </div>
      <Footer />
    </main>
  );
}