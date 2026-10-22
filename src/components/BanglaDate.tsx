
"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getDateSnapshot() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

function getServerSnapshot() {
  return "";
}

export default function BanglaDate() {
  const date = useSyncExternalStore(
    subscribe,
    getDateSnapshot,
    getServerSnapshot,
  );

  if (!date) return null;

  return <span>{date}</span>;
}
