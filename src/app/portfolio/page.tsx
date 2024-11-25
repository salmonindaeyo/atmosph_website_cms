"use client";
import React, { useEffect, useState } from "react";
import type { Portfolio } from "./type";
import Table from "./components/table";
import Cookies from "js-cookie";
import DeleteModal from "./components/delete";
import CreateModal from "./components/create";
export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const fetchPortfolio = async () => {
    try {
      const response = await fetch("/api/portfolio");
      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
      const data = await response.json();
      console.log(data);
      setPortfolio(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูล"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get("token_atmosph");
      if (!token || !selectedPortfolio) {
        showSnackbar("กรุณาเข้าสู่ระบบ", "error");
        return;
      }

      const response = await fetch(`/api/portfolio/${selectedPortfolio._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
      }

      await fetchPortfolio();
      setDeleteModalOpen(false);
      showSnackbar("ลบข้อมูลสำเร็จ", "success");
    } catch (error) {
      console.error(error);
      showSnackbar(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลบข้อมูล",
        "error"
      );
    }
  };

  useEffect(() => {
    if (!createModalOpen) {
      setSelectedPortfolio(null);
    }
  }, [createModalOpen]);

  const handleCreate = async (
    portfolioData: Omit<Portfolio, "_id" | "createdAt" | "updatedAt">
  ) => {
    console.log("create 2");

    try {
      const token = Cookies.get("token_atmosph");
      if (!token) {
        showSnackbar("กรุณาเข้าสู่ระบบ", "error");
        return;
      }

      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(portfolioData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      }

      await fetchPortfolio();
      setCreateModalOpen(false);
      showSnackbar("เพิ่มข้อมูลสำเร็จ", "success");
    } catch (error) {
      console.error(error);
      showSnackbar(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
        "error"
      );
    }
  };

  const handleEdit = async (portfolioData: Partial<Portfolio>) => {
    try {
      const token = Cookies.get("token_atmosph");
      if (!token || !selectedPortfolio) {
        showSnackbar("กรุณาเข้าสู่ระบบ", "error");
        return;
      }

      const response = await fetch(`/api/portfolio/${selectedPortfolio._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(portfolioData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
      }

      await fetchPortfolio();
      setEditModalOpen(false);
      showSnackbar("แก้ไขข้อมูลสำเร็จ", "success");
    } catch (error) {
      console.error(error);
      showSnackbar(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-black">
          Portfolio
          <div className="text-sm text-gray-500">
            <span
              className={`${
                portfolio.filter((item) => item.isShow).length > 9
                  ? "text-red-500"
                  : ""
              }`}
            >
              {portfolio.filter((item) => item.isShow).length}
            </span>
            {" / 9 portfolios (Showing/Total)"}
          </div>
        </div>

        <div
          className="bg-primary hover:bg-blue-400 cursor-pointer transition-colors duration-300 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateModalOpen(true)}
        >
          add portfolio
        </div>
      </div>
      <Table
        portfolio={portfolio}
        setSelectedPortfolio={setSelectedPortfolio}
        setDeleteModalOpen={setDeleteModalOpen}
        onEdit={setCreateModalOpen}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        portfolioName={selectedPortfolio?.name || ""}
      />

      <CreateModal
        isEdit={selectedPortfolio ? true : false}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onEdit={handleEdit}
        onCreate={handleCreate}
        selectedPortfolio={selectedPortfolio}
      />
    </div>
  );
}
