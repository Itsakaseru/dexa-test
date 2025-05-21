import { Button } from "../button";
import { Input } from "../input";

export default function InputTime(
  { label, startTimeRef, endTimeRef }:
    { label: string, startTimeRef: React.RefObject<HTMLInputElement | null>; endTimeRef: React.RefObject<HTMLInputElement | null> },
) {
  function handleClear() {
    if (startTimeRef.current) {
      startTimeRef.current.value = "";
    }
    if (endTimeRef.current) {
      endTimeRef.current.value = "";
    }
  }

  return (
    <label>
      { label }
      <div className="flex flex-row gap-4">
        <div className="flex flex-row gap-2">
          <Input className="w-auto" name="tuesdayAttendanceStart" type="time" ref={ startTimeRef } />
          <div className="my-auto">-</div>
          <Input className="w-auto" name="tuesdayAttendanceEnd" type="time" ref={ endTimeRef } />
        </div>
        <Button variant="outline" onClick={handleClear}>Clear</Button>
      </div>
    </label>
  );
}