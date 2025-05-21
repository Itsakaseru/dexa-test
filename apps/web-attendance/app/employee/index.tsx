import axios from "axios";
import { type EmployeeData } from "@repo/shared-types";
import { type Route } from "../../.react-router/types/app/employee/+types";
import { EmployeeTable } from "~/components/ui/employee/employee-table";
import { EmployeeColumns } from "~/components/ui/employee/employee-columns";
import { API_URL } from "~/api/config";
import { redirect } from "react-router";
import { handleAuthError } from "~/api/auth";

export async function clientLoader() {
  if (localStorage.getItem("hasAdminAccess") !== "1") {
    return redirect("/dashboard");
  }

  try {
    const employeeList = await axios.get<EmployeeData[]>(`${ API_URL }/employee/list`, {
      withCredentials: true,
    });

    return employeeList.data;
  }
  catch (err) {
    return await handleAuthError(err);
  }
}

export default function Employee({ loaderData }: Route.ComponentProps) {
  return (
    <main className="h-full m-0 md:m-5 p-10 items-center bg-white rounded-xl">
      <div className="container grid grid-cols-3 mx-auto gap-6">
        <div className="flex flex-col col-span-3">
          <h1 className="col-span-3 text-2xl font-bold">Employee List</h1>
          <div className="text-muted-foreground">List of DexaGroup Employee</div>
        </div>
        <div className="col-span-3">
          <EmployeeTable
            data={loaderData}
            columns={EmployeeColumns}
          />
        </div>
      </div>
    </main>
  );
}