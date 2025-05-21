import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { API_URL } from "~/api/config";

export default function Footer() {
  const [ serverTime, setServerTime ] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchServerTime() {
      const response = await axios.get(API_URL);
      setServerTime(new Date(response.data.time));
    }
   
    fetchServerTime();
  }, []);

  useEffect(() => {
    if (!serverTime) return;

    const interval = setInterval(() => {
      setServerTime(dayjs(serverTime).add(1, "second").toDate());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [ serverTime ]);

  return (
    <div className="flex flex-col items-center text-center w-full p-6 text-sm gap-2">
      <p className="text-xs">Server Time: { serverTime ? dayjs(serverTime).format("dddd MM YYYY - HH:mm:ss (UTCZ)") : "Loading..." }</p>
      <footer>Copyright (c) 2025 Lemuel Lancaster. All rights reserved.</footer>
    </div>
  );
}