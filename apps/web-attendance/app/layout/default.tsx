import { Outlet } from "react-router";
import { Toaster } from "sonner";
import Footer from "~/components/ui/footer";
import Navbar from "~/components/ui/navbar";

export default function DefaultLayout() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <Toaster richColors />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
