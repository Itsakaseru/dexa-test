import { Form, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import {Select, SelectContent, SelectItem, SelectValue} from "~/components/ui/select";
import {SelectTrigger} from "~/components/ui/select";
import { DepartmentMap, PositionMap, type TargetAttendanceData, type TargetAttendanceFormData, type TargetAttendanceRegisterData, type UserEmployeeAttendanceData } from "@repo/shared-types";
import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import InputTime from "./input-time";
import axios from "axios";
import { API_URL } from "~/api/config";

export default function EmployeeForm({ editMode = false, employeeData }: { editMode?: boolean, employeeData?: UserEmployeeAttendanceData }) {
  const name = useRef<HTMLInputElement>(null);
  const [ gender, setGender ] = useState<string | undefined>();
  const dob = useRef<HTMLInputElement>(null);
  const [ departmentId, setDepartmentId ] = useState<string | undefined>();
  const [ positionId, setPositionId ] = useState<string | undefined>();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const mondayAttendanceStart = useRef<HTMLInputElement>(null);
  const mondayAttendanceEnd = useRef<HTMLInputElement>(null);
  const tuesdayAttendanceStart = useRef<HTMLInputElement>(null);
  const tuesdayAttendanceEnd = useRef<HTMLInputElement>(null);
  const wednesdayAttendanceStart = useRef<HTMLInputElement>(null);
  const wednesdayAttendanceEnd = useRef<HTMLInputElement>(null);
  const thursdayAttendanceStart = useRef<HTMLInputElement>(null);
  const thursdayAttendanceEnd = useRef<HTMLInputElement>(null);
  const fridayAttendanceStart = useRef<HTMLInputElement>(null);
  const fridayAttendanceEnd = useRef<HTMLInputElement>(null);
  const saturdayAttendanceStart = useRef<HTMLInputElement>(null);
  const saturdayAttendanceEnd = useRef<HTMLInputElement>(null);
  const sundayAttendanceStart = useRef<HTMLInputElement>(null);
  const sundayAttendanceEnd = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!editMode) return;
    if (!employeeData) return;

    name.current!.value = employeeData.name;
    setGender("M");
    dob.current!.value = dayjs(employeeData.dob).format("YYYY-MM-DD");
    setDepartmentId(employeeData.departmentId.toString());
    setPositionId(employeeData.positionId.toString());
    email.current!.value = employeeData.email.split("@")[0];
    
    if (!employeeData.targetAttendance) return;
    employeeData.targetAttendance.map((target) => {
      switch (target.weekday) {
        case 1:
          mondayAttendanceStart.current!.value = dayjs(target.startTime).format("HH:mm");
          mondayAttendanceEnd.current!.value = dayjs(target.endTime).format("HH:mm");
          break;
        case 2:
          tuesdayAttendanceStart.current!.value = dayjs(target.startTime).format("HH:mm");
          tuesdayAttendanceEnd.current!.value = dayjs(target.endTime).format("HH:mm");
          break;
        case 3:
          wednesdayAttendanceStart.current!.value = dayjs(target.startTime).format("HH:mm");
          wednesdayAttendanceEnd.current!.value = dayjs(target.endTime).format("HH:mm");
          break;
        case 4:
          thursdayAttendanceStart.current!.value = dayjs(target.startTime).format("HH:mm");
          thursdayAttendanceEnd.current!.value = dayjs(target.endTime).format("HH:mm");
          break;
        case 5:
          fridayAttendanceStart.current!.value = dayjs(target.startTime).format("HH:mm");
          fridayAttendanceEnd.current!.value = dayjs(target.endTime).format("HH:mm");
          break;
        case 6:
          saturdayAttendanceStart.current!.value = dayjs(target.startTime).format("HH:mm");
          saturdayAttendanceEnd.current!.value = dayjs(target.endTime).format("HH:mm");
          break;
        case 7:
          sundayAttendanceStart.current!.value = dayjs(target.startTime).format("HH:mm");
          sundayAttendanceEnd.current!.value = dayjs(target.endTime).format("HH:mm");
          break;
      }
    });
  }, [ gender ]);

  async function handleSubmit() {
    const formData = new FormData();

    formData.append("name", name.current?.value || "");
    formData.append("gender", gender || "");
    formData.append("dob", dayjs(dob.current?.value).toISOString() || "");
    formData.append("departmentId", departmentId || "");
    formData.append("positionId", positionId || "");
    formData.append("email", `${email.current?.value}@dexagroup.com` || "");
    formData.append("password", password.current?.value || "");

    const targetAttendance: TargetAttendanceFormData[] = [];

    if (mondayAttendanceStart.current?.value && mondayAttendanceEnd.current?.value) {
      const [ startHours, startMinutes ] = mondayAttendanceStart.current.value.split(":");
      const [ endHours, endMinutes ] = mondayAttendanceEnd.current.value.split(":");
      targetAttendance.push({
        weekday: 1,
        startTime: dayjs().hour(Number(startHours)).minute(Number(startMinutes)).toDate(),
        endTime: dayjs().hour(Number(endHours)).minute(Number(endMinutes)).toDate(),
      });
      console.log(mondayAttendanceStart.current.value);
    }
    if (tuesdayAttendanceStart.current?.value && tuesdayAttendanceEnd.current?.value) {
      const [ startHours, startMinutes ] = tuesdayAttendanceStart.current.value.split(":");
      const [ endHours, endMinutes ] = tuesdayAttendanceEnd.current.value.split(":");
      targetAttendance.push({
        weekday: 2,
        startTime: dayjs().hour(Number(startHours)).minute(Number(startMinutes)).toDate(),
        endTime: dayjs().hour(Number(endHours)).minute(Number(endMinutes)).toDate(),
      });
    }
    if (wednesdayAttendanceStart.current?.value && wednesdayAttendanceEnd.current?.value) {
      const [ startHours, startMinutes ] = wednesdayAttendanceStart.current.value.split(":");
      const [ endHours, endMinutes ] = wednesdayAttendanceEnd.current.value.split(":");
      targetAttendance.push({
        weekday: 3,
        startTime: dayjs().hour(Number(startHours)).minute(Number(startMinutes)).toDate(),
        endTime: dayjs().hour(Number(endHours)).minute(Number(endMinutes)).toDate(),
      });
    }
    if (thursdayAttendanceStart.current?.value && thursdayAttendanceEnd.current?.value) {
      const [ startHours, startMinutes ] = thursdayAttendanceStart.current.value.split(":");
      const [ endHours, endMinutes ] = thursdayAttendanceEnd.current.value.split(":");
      targetAttendance.push({
        weekday: 4,
        startTime: dayjs().hour(Number(startHours)).minute(Number(startMinutes)).toDate(),
        endTime: dayjs().hour(Number(endHours)).minute(Number(endMinutes)).toDate(),
      });
    }
    if (fridayAttendanceStart.current?.value && fridayAttendanceEnd.current?.value) {
      const [ startHours, startMinutes ] = fridayAttendanceStart.current.value.split(":");
      const [ endHours, endMinutes ] = fridayAttendanceEnd.current.value.split(":");
      targetAttendance.push({
        weekday: 5,
        startTime: dayjs().hour(Number(startHours)).minute(Number(startMinutes)).toDate(),
        endTime: dayjs().hour(Number(endHours)).minute(Number(endMinutes)).toDate(),
      });
    }
    if (saturdayAttendanceStart.current?.value && saturdayAttendanceEnd.current?.value) {
      const [ startHours, startMinutes ] = saturdayAttendanceStart.current.value.split(":");
      const [ endHours, endMinutes ] = saturdayAttendanceEnd.current.value.split(":");
      targetAttendance.push({
        weekday: 6,
        startTime: dayjs().hour(Number(startHours)).minute(Number(startMinutes)).toDate(),
        endTime: dayjs().hour(Number(endHours)).minute(Number(endMinutes)).toDate(),
      });
    }
    if (sundayAttendanceStart.current?.value && sundayAttendanceEnd.current?.value) {
      const [ startHours, startMinutes ] = sundayAttendanceStart.current.value.split(":");
      const [ endHours, endMinutes ] = sundayAttendanceEnd.current.value.split(":");
      targetAttendance.push({
        weekday: 7,
        startTime: dayjs().hour(Number(startHours)).minute(Number(startMinutes)).toDate(),
        endTime: dayjs().hour(Number(endHours)).minute(Number(endMinutes)).toDate(),
      });
    }

    formData.append("targetAttendance", JSON.stringify(targetAttendance));

    if (editMode && employeeData) {
      formData.append("userId", employeeData.userId.toString());
      
      await axios.post(`${API_URL}/employee/update/${employeeData.id}`, formData, {
        withCredentials: true,
      });

      navigate("/employee");
    }
    else {
      await axios.post(`${API_URL}/employee/create`, formData, {
        withCredentials: true,
      });

      navigate("/employee");
    }
  }

  return (
    <div className="w-fit m-0 mx-auto md:m-5 p-10 items-center md:mx-auto bg-white rounded-xl">
      <h1 className="text-2xl font-extrabold text-center">
        {
          editMode ?
          "Edit Employee" :
          "Add Employee"
        }
      </h1>
      <Form className="flex flex-col md:flex-row py-8 gap-x-20 gap-y-8 md:gap-y-0 text-sm" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:gap-y-0">
          <div className="flex flex-col col-span-2">
            <h2 className="text-lg">Employee Data</h2>
            <hr className="col-span-2" />
          </div>
          <label className="col-span-2">
            Full Name*
            <Input name="name" type="text" ref={ name } />
          </label>
          <label className="col-span-1">
            Gender*
            <Select value={ gender } onValueChange={ setGender }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="col-span-1">
            Date of Birth*
            <Input className="flex" name="dob" type="date" ref={ dob } />
          </label>
          <label>
            Department*
            <Select value={ departmentId } onValueChange={ setDepartmentId }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {
                  Object.values(DepartmentMap).map((department, index) => (
                    <SelectItem key={ index } value={ (index + 1).toString() }>{ department }</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </label>
          <label>
            Position*
            <Select value={ positionId } onValueChange={ setPositionId }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                {
                  Object.values(PositionMap).map((position, index) => (
                    <SelectItem key={ index } value={ (index + 1).toString() }>{ position }</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </label>
          <div className="flex flex-col col-span-2">
            <h2 className="text-lg mt-4">User Data</h2>
            <hr className="mb-2" />
          </div>
          <label className="col-span-2">
            Email*
            <div className="flex justify-items-center gap-4">
              <Input name="email" type="email" ref={ email } />
              <div className="font-semibold my-auto">@dexagroup.com</div>
            </div>
          </label>
          <label className="col-span-2">
            Password*
            <Input name="password" type="password" ref={ password } />
          </label>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg">Employee Target Attendance</h2>
          <hr className="mb-2" />
          <div className="w-full flex flex-col px-0 md:px-8 py-4 items-center gap-y-4">
            <InputTime label="Monday" startTimeRef={ mondayAttendanceStart } endTimeRef={ mondayAttendanceEnd } />
            <InputTime label="Tuesday" startTimeRef={ tuesdayAttendanceStart } endTimeRef={ tuesdayAttendanceEnd } />
            <InputTime label="Wednesday" startTimeRef={ wednesdayAttendanceStart } endTimeRef={ wednesdayAttendanceEnd } />
            <InputTime label="Thursday" startTimeRef={ thursdayAttendanceStart } endTimeRef={ thursdayAttendanceEnd } />
            <InputTime label="Friday" startTimeRef={ fridayAttendanceStart } endTimeRef={ fridayAttendanceEnd } />
            <InputTime label="Saturday" startTimeRef={ saturdayAttendanceStart } endTimeRef={ saturdayAttendanceEnd } />
            <InputTime label="Sunday" startTimeRef={ sundayAttendanceStart } endTimeRef={ sundayAttendanceEnd } />
          </div>
        </div>
      </Form>
      <div className="flex flex-row w-full justify-center gap-4">
        <Button className="cursor-pointer" variant="outline" onClick={() => { navigate(-1) }}>Cancel</Button>
        <Button className="cursor-pointer" onClick={() => handleSubmit()}>
          {
            editMode ? "Update Employee" : "Add Employee"
          }
        </Button>
      </div>
    </div>
  );
}