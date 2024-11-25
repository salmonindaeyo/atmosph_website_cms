"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Home, ContactRound, BookUser, SquareLibrary } from "lucide-react";
import { usePathname } from "next/navigation";

type SidebarRoute = {
  icon: React.ElementType;
  text: string;
  href: string;
};

const SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    icon: Home,
    text: "Home",
    href: "/",
  },
  {
    icon: ContactRound,
    text: "Career",
    href: "/career",
  },
  {
    icon: SquareLibrary,
    text: "Portfolio",
    href: "/portfolio",
  },
];

type SidebarContextType = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  routes: SidebarRoute[];
  currentPath: string;
  setCurrentPath: (path: string) => void;
};

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: true,
  setIsExpanded: () => {},
  routes: SIDEBAR_ROUTES,
  currentPath: "",
  setCurrentPath: () => {},
});

type SidebarProviderProps = {
  children: ReactNode;
};

export function SidebarProvider({
  children,
}: SidebarProviderProps): JSX.Element {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        routes: SIDEBAR_ROUTES,
        currentPath,
        setCurrentPath,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
