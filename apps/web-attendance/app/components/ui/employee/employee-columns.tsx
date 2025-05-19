import { type ColumnDef } from "@tanstack/react-table";
import { DepartmentMap, type EmployeeData, PositionMap } from "@repo/shared-types";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../dropdown-menu";
import { Button } from "~/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const EmployeeColumns: ColumnDef<EmployeeData>[] = [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender");
      return gender === "M" ? "Male" : "Female";
    }
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const dob = row.getValue("dob") as string;
      return dayjs(dob).format("DD MMMM YYYY");
    }
  },
  {
    accessorKey: "departmentId",
    header: "Department",
    cell: ({ row }) => {
      const departmentId = row.getValue("departmentId") as number;
      return DepartmentMap[departmentId];
    }
  },
  {
    accessorKey: "positionId",
    header: "Position",
    cell: ({ row }) => {
      const positionId = row.getValue("positionId") as number;
      return PositionMap[positionId];
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return dayjs(createdAt).format("DD MMMM YYYY - HH:mm:ss");
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Attendances</DropdownMenuItem>
            <DropdownMenuItem>Edit Employee</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-700"
              onClick={() => console.log("Delete Employee")}
            >
              Delete Employee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]