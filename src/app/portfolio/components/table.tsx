import React from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaPlus } from "react-icons/fa";
import { Portfolio } from "../type";

interface TableProps {
  portfolio: Portfolio[];
  setSelectedPortfolio: (portfolio: Portfolio) => void;
  setDeleteModalOpen: (open: boolean) => void;
  onEdit: (open: boolean) => void;
}

export default function Table({
  portfolio,
  setSelectedPortfolio,
  setDeleteModalOpen,
  onEdit,
}: TableProps) {
  const actionButtons = (portfolio: Portfolio) => (
    <div className="flex space-x-3">
      <button
        className="text-blue-600 hover:text-blue-300"
        onClick={() => {
          setSelectedPortfolio(portfolio);
          onEdit(true);
        }}
      >
        <FaEdit />
      </button>
      <button
        className=" hover:text-blue-300"
        onClick={() => {
          setSelectedPortfolio(portfolio);
          setDeleteModalOpen(true);
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
  return (
    <div>
      {" "}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                isShow
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolio.map((port) => (
              <tr key={port._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {port.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{port.service}</td>
                <td className="px-6 py-4">
                  {port.isShow ? (
                    <span className="px-2 inline-flex items-center text-xs leading-5 w-[60px] font-semibold rounded-md bg-green-100 text-green-800">
                      <FaEye className="mr-1" /> แสดง
                    </span>
                  ) : (
                    <span className="px-2 inline-flex items-center text-xs leading-5 w-[60px] font-semibold rounded-md bg-red-100 text-red-800">
                      <FaEyeSlash className="mr-1" /> ซ่อน
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={port.image} alt="portfolio" className="w-10 h-10" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {actionButtons(port)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
