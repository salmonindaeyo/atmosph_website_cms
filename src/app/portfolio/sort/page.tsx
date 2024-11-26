"use client";

import React, { useEffect, useState } from "react";
import { Portfolio } from "../type";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Sort() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const fetchPortfolio = async () => {
    try {
      const response = await fetch("/api/portfolio");
      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
      const data = await response.json();
      const sortedData = data.sort(
        (a: Portfolio, b: Portfolio) => a.order - b.order
      );
      setPortfolio(sortedData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูล"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const moveItem = (index: number, direction: "up" | "down") => {
    const newPortfolio = [...portfolio];
    if (direction === "up" && index > 0) {
      [newPortfolio[index], newPortfolio[index - 1]] = [
        newPortfolio[index - 1],
        newPortfolio[index],
      ];
    } else if (direction === "down" && index < portfolio.length - 1) {
      [newPortfolio[index], newPortfolio[index + 1]] = [
        newPortfolio[index + 1],
        newPortfolio[index],
      ];
    }
    setPortfolio(newPortfolio);
  };

  const handleSave = async () => {
    const token = Cookies.get("token_atmosph");
    if (!token) {
      return;
    }

    try {
      setIsSaving(true);
      const visiblePortfolios = portfolio.filter((p) => p.isShow === true);

      const response = await fetch("/api/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          portfolios: visiblePortfolios.map((p) => ({
            _id: p._id,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      router.refresh();
      router.push("/portfolio");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/portfolio");
  };

  if (loading) {
    return <div className="text-center p-4">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-4 flex-col transition-all justify-between items-center mb-6">
        <div>Sort Portfolio</div>
        <AnimatePresence>
          {portfolio
            .filter((port) => port.isShow === true)
            .map((port, index, array) => {
              const opacity = 0.1 + (index / array.length) * 0.3;

              return (
                <motion.div
                  key={port._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
                  className="w-full rounded-md p-4 flex justify-between items-center text-black border border-gray-300"
                >
                  <span>
                    {index + 1} -{" "}
                    <span className="font-bold">{port.name} </span>
                    <span className="text-gray-500 text-sm">
                      {port.service}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-2 hover:bg-blue-500 rounded-full disabled:opacity-50 bg-blue-400 bg-opacity-20"
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === array.length - 1}
                      className="p-2 hover:bg-blue-500 rounded-full disabled:opacity-50 bg-blue-400 bg-opacity-20"
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>

        <div className="w-full flex justify-end gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-blue-400 cursor-pointer text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isSaving ? "กำลังบันทึก..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="bg-red-500 hover:bg-red-400 cursor-pointer text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
