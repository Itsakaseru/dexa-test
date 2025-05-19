import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Footer from "~/components/ui/footer";
import { Form } from "react-router";

export default function Index() {
  return (
    <main className="flex flex-col w-screen h-screen items-center justify-center">
      <div className="flex w-screen grow items-center justify-center gap-32">
        <div className="flex flex-col">
          <h1 className="text-7xl font-extrabold">DexaGroup</h1>
          <p className="text-xl">
            Attendance Portal
          </p>
        </div>
        <div className="bg-white rounded-2xl w-2/12 px-8 py-8">
          <Form method="post" action="/" className="flex flex-col gap-4">
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