"use client";
import React from "react";
import { useSidebar } from "@/context/sidebar-context";
import ViewSidebarRoundedIcon from "@mui/icons-material/ViewSidebarRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
export function AppHeader() {
  const { isExpanded, setIsExpanded, currentPath, routes } = useSidebar();

  return (
    <div className="flex pl-6 items-center gap-3 top-0 z-[100] p-2 py-4 w-full bg-white">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer text-sidebar-accent-foreground"
      >
        <ViewSidebarRoundedIcon />
      </div>
      <div className="text-gray-200">|</div>
      <div className="text-[#8f8f8f]">Atmosph website config</div>
      <ChevronRightRoundedIcon sx={{ color: "#bdbdbd" }} />
      <div className="text-[#8f8f8f]">
        {" "}
        {routes.find((route) => route.href === currentPath)?.text}
      </div>
    </div>
  );
}
