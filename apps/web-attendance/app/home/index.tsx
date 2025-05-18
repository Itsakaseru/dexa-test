import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Form } from "react-router";

export default function Home() {
  return (
    <main className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="flex w-screen grow items-center justify-center gap-32">
        <div className="flex flex-col">
          <h1 className="text-7xl font-extrabold">DexaGroup</h1>
          <p className="text-xl">
            Attendance Portal
          </p>
        </div>
        <div className="w-[1px] h-1/4 rounded-full bg-gray-200"/>
        <Form method="post" action="/" className="flex flex-col w-full max-w-2/12 gap-4">
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <Button className="cursor-pointer">Login</Button>
        </Form>
      </div>
      <div className="flex justify-center w-full border-t-1 border-gray-200 p-3 text-sm">
        Copyright (c) 2025 Lemuel Lancaster. All rights reserved.
      </div>
    </main>
  );
}