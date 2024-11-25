"use client";
import React from "react";
import Link from "next/link";
import { useSidebar } from "@/context/sidebar-context";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUser } from "@/context/user-context";
export function AppSidebar() {
  const { setIsLoginContext, isLoginContext } = useUser();

  const { isExpanded, setIsExpanded, routes, setCurrentPath } = useSidebar();
  const router = useRouter();

  function logout() {
    Cookies.remove("token_atmosph");
    setIsLoginContext(false);
    router.push("/auth");
  }

  function SidebarItem({
    icon,
    text,
    href,
    isExpanded,
    setIsExpanded,
    setCurrentPath,
  }) {
    const handleClick = (e) => {
      if (isLoginContext) {
        if (!isExpanded) {
          e.preventDefault();
          setIsExpanded(true);
        } else {
          setCurrentPath(href);
          router.push(href);
        }
      }
    };

    return (
      <div
        className="flex items-center text-[14px text-gray-600 gap-4 hover:bg-blue-100 transition-all duration-300 p-2 rounded-lg cursor-pointer"
        onClick={handleClick}
      >
        {icon}
        {isExpanded && <span>{text}</span>}
      </div>
    );
  }

  return (
    <div
      className={`relative h-svh border text-sidebar-foreground transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div
        className={`flex fixed p-3.5   bg-white w-full top-0 left-0 flex-col h-full ${
          isExpanded ? "w-[260px]" : "w-16"
        }`}
      >
        <div className="flex items-center">
          <img src="/logo.jpg" alt="logo" className={` ${"w-10 h-10"}`} />
          {isExpanded && (
            <span className="text-primary font-bold">Atmosph</span>
          )}
        </div>
        {
          <div className={`space-y-4 mt-4 ${isExpanded ? "w-[230px]" : "w-9"}`}>
            {routes.map((route) => (
              <SidebarItem
                key={route.href}
                icon={<route.icon size={20} />}
                text={route.text}
                href={route.href}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                setCurrentPath={setCurrentPath}
              />
            ))}
            {isLoginContext && (
              <div
                className="flex items-center text-[14px text-gray-600 gap-4 hover:bg-gray-200 transition-all duration-300 p-2 rounded-lg cursor-pointer"
                onClick={logout}
              >
                <MeetingRoomIcon />
                {isExpanded && <span>Log out</span>}
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}
