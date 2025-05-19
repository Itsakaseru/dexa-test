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
import { Form } from "react-router";
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import { CameraIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  const inputHtml = useRef<HTMLInputElement>(null);

  const [ inputFile, setInputFiddle ] = useState<File | null>(null);
  const [ previewUrl, setPreviewUrl ] = useState<string | null>(null);

  function onPhotoClick() {
    inputHtml.current?.click();
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const tempUrl = URL.createObjectURL(e.target.files[0]);
    setPreviewUrl(tempUrl);
    setInputFiddle(e.target.files[0]);
  }

  return (
    <main className="flex flex-col h-full justify-center items-center gap-10">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center bg-white rounded-md p-6">
          <div>Locale Time (UTC+X)</div>
          <div className="font-extrabold text-xl">HH:MM:SS</div>
        </div>
        <div className="flex flex-col items-center bg-white rounded-md p-6">
          <div>Attendance Time (Monday)</div>
          <div className="font-extrabold text-xl">08.00 - 15.00 WIB</div>
        </div>
        <div className="relative col-span-2 flex flex-col bg-white rounded-md px-6 py-8">
          <div className="flex flex-row">
            <div className="flex-1/2 max-w-1/2 text-center">
              <div className="">Check In</div>
              <div className="font-extrabold text-xl">HH:MM:SS</div>
              <div className="text-sm text-green-700">On Time</div>
            </div>
            <div className="flex w-0.5 rounded-full h-full bg-neutral-200" />
            <div className="flex-1/2 max-w-1/2 text-center">
              <div>Check Out</div>
              <div className="font-extrabold text-xl">HH:MM:SS</div>
              <div className="text-sm text-neutral-800">-</div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger>
              <div className="absolute left-50 font-extrabold text-md bg-green-950 hover:bg-green-800 transition-colors duration-200 text-white rounded-full px-8 py-4 cursor-pointer">Check In</div>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Check In Form</DialogTitle>
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
                  <Button className="m-auto cursor-pointer" size="lg" disabled={ !inputFile }>Check In</Button>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}