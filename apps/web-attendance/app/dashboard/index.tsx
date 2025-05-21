import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Form, redirect, useNavigate } from "react-router";
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import { CameraIcon } from "@heroicons/react/24/solid";
import type { Route } from "../dashboard/+types";
import dayjs from "dayjs";
import axios from "axios";
import type { AttendanceDataToday } from "@repo/shared-types";
import { API_URL } from "~/api/config";
import { handleAuthError } from "~/api/auth";

export async function clientLoader() {
  try {
    const resCurrent = await axios.get<AttendanceDataToday>(`${API_URL}/attendance/current`, {
      withCredentials: true,
    });

    return {
      todayAttendanceData: resCurrent.data
    };
  } catch (error) {
    return await handleAuthError(error);
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { todayAttendanceData } = loaderData || {};

  const inputHtml = useRef<HTMLInputElement>(null);

  const [ open, setOpen ] = useState(false);
  const [ inputFile, setInputFile ] = useState<File | null>(null);
  const [ previewUrl, setPreviewUrl ] = useState<string | null>(null);

  const [ time, setTime ] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [ time ])

  function onPhotoClick() {
    inputHtml.current?.click();
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const tempUrl = URL.createObjectURL(e.target.files[0]);
    setPreviewUrl(tempUrl);
    setInputFile(e.target.files[0]);
  }

  function checkLate(time: Date, targetTime: Date) {
    const newTime = dayjs()
      .set("hours", dayjs(time).get("hour"))
      .set("minutes", dayjs(time).get("minute"))

    const newTargetTime = dayjs()
      .set("hours", dayjs(targetTime).get("hour"))
      .set("minutes", dayjs(targetTime).get("minute"))

    const diff = newTime.diff(newTargetTime, "minute");

    if (diff > 0) {
      return <span className="text-red-700">Late { diff } minutes</span>;
    }
    else if (diff < 0) {
      return <span>-</span>
    }
    return <span className="text-green-700">On Time</span>;
  }

  async function submit(status: "checkIn" | "checkOut") {
    if (!inputFile) return;

    const formData = new FormData();
    formData.append("photo", inputFile);
    
    try {
      switch (status) {
        case "checkIn":
          await axios.post(`${API_URL}/attendance/check/in`, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          break;

        case "checkOut":
          await axios.post(`${API_URL}/attendance/check/out`, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          break;
      }
    }
    catch (err) {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 401:
            return redirect("/login");

          default:
            return redirect("/dashboard");
        }
      }
    }

    setOpen(false);
    setInputFile(null);
    setPreviewUrl(null);
    navigate("/dashboard");
  }

  return (
    <main className="flex flex-col my-20 justify-center items-center gap-10">
      <div className="grid w-full p-10 md:w-auto md:p-0 grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center bg-white rounded-md p-6">
          <div>Locale Time (UTC{dayjs(time).format("Z") })</div>
          <div className="font-extrabold text-xl">{ dayjs(time).format("HH:mm:ss") }</div>
        </div>
        <div className="flex flex-col items-center bg-white rounded-md p-6">
          <div>Attendance Time ({dayjs(time).format("dddd")})</div>
          <div className="font-extrabold text-xl">
            {
              todayAttendanceData ?
              `${ dayjs(todayAttendanceData?.target?.startTime).format("HH:mm") } - ${ dayjs(todayAttendanceData?.target?.endTime).format("HH:mm") }`
              :
              "Holiday"
            }
            </div>
        </div>
        <div className="md:col-span-2 flex flex-col bg-white rounded-md px-6 py-8 gap-6">
          <div className="flex flex-row">
            <div className="flex-1/2 max-w-1/2 text-center">
              <div className="">Check In</div>
              <div className="font-extrabold text-xl">
                {
                  todayAttendanceData ?
                  dayjs(todayAttendanceData?.attendance.checkIn?.dateTime).format("HH:mm:ss")
                  :
                  "Holiday"
                }
                </div>
              <div className="text-sm">
                {
                  todayAttendanceData ?
                  checkLate(
                    dayjs(todayAttendanceData?.attendance.checkIn?.dateTime).toDate(),
                    dayjs(todayAttendanceData?.target?.startTime).toDate()
                  )
                  :
                  "-"
                }
              </div>
            </div>
            <div className="flex w-0.5 rounded-full h-full bg-neutral-200" />
            <div className="flex-1/2 max-w-1/2 text-center">
              <div>Check Out</div>
              <div className="font-extrabold text-xl">
                {
                  todayAttendanceData ?
                  dayjs(todayAttendanceData?.attendance.checkOut?.dateTime).format("HH:mm:ss")
                  :
                  "Holiday"
                }
              </div>
              <div className="text-sm text-neutral-800">
                {
                  todayAttendanceData ?
                  checkLate(
                    dayjs(todayAttendanceData?.attendance.checkOut?.dateTime).toDate(),
                    dayjs(todayAttendanceData?.target?.endTime).toDate()
                  )
                  :
                  "-"
                }
              </div>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            {
              !todayAttendanceData ? (
                <div className="font-extrabold text-md bg-neutral-600 transition-colors duration-200 text-white rounded-full py-4 text-center">Holiday</div>
              ) :
              !todayAttendanceData?.attendance.checkIn ? (
                <DialogTrigger>
                  <div className="font-extrabold text-md bg-green-950 hover:bg-green-800 transition-colors duration-200 text-white rounded-full py-4 cursor-pointer">Check In</div>
                </DialogTrigger>
              ) : 
              !todayAttendanceData?.attendance.checkOut ? (
                <DialogTrigger>
                  <div className="font-extrabold text-md bg-red-950 hover:bg-red-800 transition-colors duration-200 text-white rounded-full py-4 cursor-pointer">Check Out</div>
                </DialogTrigger>
              ) :
                <div className = "font-extrabold text-md bg-neutral-600 transition-colors duration-200 text-white rounded-full py-4 text-center">Thank you!</div>
            }
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>
                  {
                    !todayAttendanceData?.attendance.checkIn ?
                    "Check In Form"
                    :
                    "Check Out Form"
                  }
                </DialogTitle>
                <div
                  className={`flex flex-col h-72 justify-center items-center outline-2 outline-dashed gap-2 mt-4 text-neutral-400 cursor-pointer ${ previewUrl ? "hidden" : "block" }`}
                  onClick={onPhotoClick}>
                  <CameraIcon className="w-16 h-16"/>
                  <span className="text-xl">Take a photo</span>
                </div>
                <img
                  className={`max-h-72 object-contain aspect-16/9 cursor-pointer ${ previewUrl ? "block" : "hidden" }`}
                  src={ previewUrl ? previewUrl : undefined }
                  alt="User's photo input"
                  onClick={onPhotoClick}
                />
                <Form>
                  <input
                    className="hidden"
                    type="file"
                    placeholder="Name"
                    accept="image/*"
                    capture={true}
                    ref={inputHtml}
                    onChange={onFileChange}
                  />
                </Form>
                <DialogFooter>
                  <Button className="m-auto cursor-pointer" size="lg" disabled={ !inputFile } onClick={
                    !todayAttendanceData?.attendance.checkIn ?
                      () => { submit("checkIn") }
                      :
                      () => { submit("checkOut") }
                  }>
                    {
                      !todayAttendanceData?.attendance.checkIn ?
                      "Check In"
                      :
                      "Check Out"
                    }
                  </Button>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}