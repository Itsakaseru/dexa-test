import { redirect } from "react-router";
import EmployeeForm from "~/components/ui/employee/employee-form";

export function clientLoader() {
  if (localStorage.getItem("hasAdminAccess") !== "1") {
    return redirect("/dashboard");
  }
}

export default function CreateEmployee() {
  return (
    <main>
      <EmployeeForm />
    </main>
  );
}