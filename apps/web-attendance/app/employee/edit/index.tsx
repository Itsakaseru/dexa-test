import EmployeeForm from "~/components/ui/employee/employee-form";
import type { Route } from "../../employee/edit/+types";
import type { EmployeeData, UserEmployeeAttendanceData } from "@repo/shared-types";
import { API_URL } from "~/api/config";
import axios from "axios";
import { handleAuthError } from "~/api/auth";
import { redirect } from "react-router";

export async function clientLoader({ params }: Route.LoaderArgs) {
  if (localStorage.getItem("hasAdminAccess") !== "1") {
    return redirect("/dashboard");
  }

  const { id } = params || {};
  
  try {
    const resEmployeeData = await axios.get<UserEmployeeAttendanceData>(`${API_URL}/employee/${id}`, {
      withCredentials: true,
    });

    return {
      employeeData: resEmployeeData.data,
    }
  }
  catch (err) {
    return await handleAuthError(err);
  }
}

export default function EditEmployee({ loaderData }: Route.ComponentProps) {
  const { employeeData } = loaderData || {};
  
  return (
    <main>
      <EmployeeForm editMode employeeData={employeeData} />
    </main>
  );
}