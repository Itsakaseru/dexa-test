import { AttendanceTable } from "~/components/ui/attendance/attendance-table";
import type { Route } from "../../attendance/[id]/+types";
import { AttendanceColumns } from "~/components/ui/attendance/attendance-columns";
import { handleAuthError, refreshAuth } from "~/api/auth";
import { getEmployeeDataByUserId } from "~/api/employee";
import { getAttendanceListByUserId } from "~/api/attendance";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { id } = params;

  try {
    const employeeData = await getEmployeeDataByUserId(id);
    const attendanceList = await getAttendanceListByUserId(id);

    return {
      employee: employeeData.data,
      attendanceList: attendanceList.data,
    }
  }
  catch (err) {
    return await handleAuthError(err)
  }
}

export default function Attendance({ loaderData }: Route.ComponentProps) {
  const { employee, attendanceList } = loaderData;

  return (
    <main className="h-full m-0 md:m-5 p-10 items-center bg-white rounded-xl">
      <div className="container grid grid-cols-3 mx-auto gap-6">
        <div className="flex flex-col col-span-3">
          <h1 className="col-span-3 flex-row text-2xl font-bold">
            Attendance List: { employee && employee.name }
          </h1>
          <div className="text-muted-foreground">
            List of { employee && employee.name } Attendances
          </div>
        </div>
        <div className="col-span-3">
          <AttendanceTable
            data={ attendanceList }
            columns={ AttendanceColumns }
          />
        </div>
      </div>
    </main>
  )
}
