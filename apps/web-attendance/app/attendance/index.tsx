import { AttendanceTable } from "~/components/ui/attendance/attendance-table";
import type { Route } from "../attendance/+types";
import { AttendanceColumns } from "~/components/ui/attendance/attendance-columns";
import type { AttendanceEmployeeTargetData } from "@repo/shared-types";
import { API_URL } from "~/api/config";
import axios from "axios";
import { handleAuthError } from "~/api/auth";

export async function clientLoader() {
  try {
    const attendanceList = await axios.get<AttendanceEmployeeTargetData[]>(`${ API_URL }/attendance/list`, {
      withCredentials: true,
    });

    return attendanceList.data;
  }
  catch (err) {
    return await handleAuthError(err);
  }
}

export default function Attendance({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex flex-col grow w-full">
      <div className="h-full m-0 md:m-5 p-10 items-center bg-white rounded-xl">
        <div className="container grid grid-cols-3 mx-auto gap-6">
          <div className="flex flex-col col-span-3">
            <h1 className="col-span-3 text-2xl font-bold">Attendance List</h1>
            <div className="text-muted-foreground">List of Employee Attendances</div>
          </div>
          <div className="col-span-3">
            <AttendanceTable
              data={ loaderData }
              columns={ AttendanceColumns }
            />
          </div>
        </div>
      </div>
    </main>
  )
}
