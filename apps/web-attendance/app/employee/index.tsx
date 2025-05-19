import axios from "axios";
import { type EmployeeData } from "@repo/shared-types";
import { type Route } from "../../.react-router/types/app/employee/+types";
import { useEffect } from "react";
import { EmployeeTable } from "~/components/ui/employee/employee-table";
import { EmployeeColumns } from "~/components/ui/employee/employee-columns";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export async function clientLoader() {
  return (await axios.get<EmployeeData[]>("http://localhost:3001/employee/list")).data;
}

export default function Employee({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    console.log(loaderData);
  }, []);

  return (
    <main className="h-full m-5 p-10 items-center bg-white rounded-xl">
      <div className="container grid grid-cols-3 mx-auto gap-6">
        <div className="flex flex-col col-span-3">
          <h1 className="col-span-3 text-2xl font-bold">Employee List</h1>
          <div className="text-muted-foreground">List of DexaGroup Employee</div>
        </div>
        <div className="col-span-3">
          <EmployeeTable
            dataTableProps={{
              data: loaderData,
              columns: EmployeeColumns
            }}
            onAddEmployee={() => console.log("Add Employee")}
          />
        </div>
      </div>
    </main>
  );
}