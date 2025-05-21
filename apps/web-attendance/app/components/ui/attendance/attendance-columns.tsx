import { type ColumnDef } from "@tanstack/react-table";
import { type AttendanceData } from "@repo/shared-types";
import dayjs from "dayjs";
import { API_URL } from "~/api/config";
import { LinkIcon } from "@heroicons/react/24/solid";
import { Button } from "../button";
import { ArrowUpDown } from "lucide-react";
import { useEffect } from "react";

export const AttendanceColumns: ColumnDef<AttendanceData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "dateTime",
    header: ({ column }) => {
      useEffect(() => {
        column.toggleSorting(true);
      }, [])

      return (
        <Button
          variant="ghost"
          onClick={ () => column.toggleSorting(column.getIsSorted() === "asc") }
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("dateTime") as string;
      return dayjs(createdAt).format("dddd, DD MMMM YYYY - HH:mm:ss");
    }
  },
  {
    accessorKey: "targetTime",
    header: "Target Time",
    cell: ({ row }) => {
      const targetTime = row.getValue("targetTime") as string;
      return dayjs(targetTime).format("HH:mm");
    }
  },
  {
    accessorKey: "typeId",
    header: "Type",
    cell: ({ row }) => {
      const typeId = row.getValue("typeId") as number;
      return typeId === 1 ? "Check In" : "Check Out";
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const timeData = row.getValue("dateTime") as number;
      const typeId = row.getValue("typeId") as number;
      const targetTimeData = row.getValue("targetTime") as number;

      const [ timeHours, timeMinutes ] = dayjs(timeData).format("HH:mm").split(":");
      const [ targetHours, targetMinutes ] = dayjs(targetTimeData).format("HH:mm").split(":");

      // If the time is the same as the target then, show on time
      // If the time is greater than the target then, show late
      // If the time is less than the target then, show early
      // Reverse the logic if check out

      let status = "";

      // If check in
      if (timeHours === targetHours && timeMinutes === targetMinutes) {
        status = "On Time";
      } else if (timeHours > targetHours || (timeHours === targetHours && timeMinutes > targetMinutes)) {
        status = "Late";
      } else {
        status = "Early";
      }

      return (
        <div className="flex items-center">
          {
            status === "On Time" ? (
              <div className="bg-green-500 w-2 h-2 rounded-full mr-2" />
            ) : status === "Early" ? (
              <div className={`${ typeId === 1 ? "bg-green-700" : "bg-red-500" } w-2 h-2 rounded-full mr-2`} />
            ) : (
              <div className={ `${ typeId === 2 ? "bg-green-700" : "bg-red-500" } w-2 h-2 rounded-full mr-2`} />
            )
          }
          { status }
        </div>
      )

    }
  },
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const userId = row.getValue("userId") as string;
      const photo = row.getValue("photo") as string;

      return (
          photo == null ?
          <div>-</div>
          :
          <a
            className="text-neutral-400 underline"
            href={ `${ API_URL }/uploads/${userId}/${ photo }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon className="h-4 w-4 inline-block ml-1" />
            Uploaded Photo
          </a>
      )
    },
  },
]