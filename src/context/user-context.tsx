"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

type UserContextType = {
  isLoginContext: boolean;
  setIsLoginContext: (value: boolean) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  isLoginContext: false,
  setIsLoginContext: () => {},
  logout: () => {},
});

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [isLoginContext, setIsLoginContext] = useState(false);

  useEffect(() => {
    // เช็ค token จาก cookie เมื่อ component mount
    const token = Cookies.get("token_atmosph");
    setIsLoginContext(!!token);
  }, []);

  const logout = () => {
    // ลบ token และอัพเดทสถานะ
    Cookies.remove("token_atmosph");
    setIsLoginContext(false);
  };

  return (
    <UserContext.Provider
      value={{
        isLoginContext,
        setIsLoginContext,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
