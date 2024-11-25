"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaPlus } from "react-icons/fa";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import Cookies from "js-cookie";

interface Career {
  _id: string;
  name: string;
  isShow: boolean;
  qualifications: string[];
  responsibilities: string[];
  createdAt: string;
  updatedAt: string;
}

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: string[];
}

// Modal component
const DetailModal = ({ open, onClose, title, items }: DetailModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <div className="text-lg font-bold mb-4 text-primary">{title}</div>
        <List>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${index + 1}. ${item}`}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "0.8rem",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

// Modal component สำหรับแก้ไขข้อมูล
interface EditModalProps {
  open: boolean;
  onClose: () => void;
  career: Career | null;
  onSave: (careerData: Partial<Career>) => void;
}

const EditModal = ({ open, onClose, career, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    isShow: true,
    qualifications: [""] as string[],
    responsibilities: [""] as string[],
  });

  useEffect(() => {
    if (career) {
      setFormData({
        name: career.name,
        isShow: career.isShow,
        qualifications:
          career.qualifications.length > 0 ? career.qualifications : [""],
        responsibilities:
          career.responsibilities.length > 0 ? career.responsibilities : [""],
      });
    }
  }, [career]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("กรุณากรอกชื่อตำแหน่งงาน");
      return;
    }
    // กรองเอาค่าว่างออก
    const filteredData = {
      ...formData,
      qualifications: formData.qualifications.filter(
        (item) => item.trim() !== ""
      ),
      responsibilities: formData.responsibilities.filter(
        (item) => item.trim() !== ""
      ),
    };
    onSave(filteredData);
  };

  // เพิ่มฟิลด์ใหม่
  const handleAddField = (field: "qualifications" | "responsibilities") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // ลบฟิลด์
  const handleRemoveField = (
    field: "qualifications" | "responsibilities",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // อัพเดทค่าในฟิลด์
  const handleFieldChange = (
    field: "qualifications" | "responsibilities",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Edit position
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Position name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            error={!formData.name.trim()}
            helperText={!formData.name.trim() ? "กรุณากรอกชื่อตำแหน่งงาน" : ""}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isShow}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isShow: e.target.checked }))
                }
                color="primary"
              />
            }
            label="Show on website"
          />

          {/* คุณสมบัติ */}
          <div className="space-y-2">
            <Typography variant="subtitle1" gutterBottom>
              Qualifications
            </Typography>
            {formData.qualifications.map((qual, index) => (
              <div key={index} className="flex gap-2 items-start">
                <TextField
                  fullWidth
                  value={qual}
                  onChange={(e) =>
                    handleFieldChange("qualifications", index, e.target.value)
                  }
                  placeholder={`Qualification ${index + 1}`}
                  size="small"
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleRemoveField("qualifications", index)}
                  sx={{ minWidth: "40px", height: "40px" }}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              variant="outlined"
              onClick={() => handleAddField("qualifications")}
              startIcon={<FaPlus />}
              size="small"
            >
              Add Qualification
            </Button>
          </div>

          {/* ความรับผิดชอบ */}
          <div className="space-y-2">
            <Typography variant="subtitle1" gutterBottom>
              Responsibilities
            </Typography>
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2 items-start">
                <TextField
                  fullWidth
                  value={resp}
                  onChange={(e) =>
                    handleFieldChange("responsibilities", index, e.target.value)
                  }
                  placeholder={`Responsibility ${index + 1}`}
                  size="small"
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleRemoveField("responsibilities", index)}
                  sx={{ minWidth: "40px", height: "40px" }}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              variant="outlined"
              onClick={() => handleAddField("responsibilities")}
              startIcon={<FaPlus />}
              size="small"
            >
              Add Responsibility
            </Button>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!formData.name.trim()}
            >
              Save
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

// Modal component สำหรับยืนยันการลบ
interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  careerName: string;
}

const DeleteModal = ({
  open,
  onClose,
  onConfirm,
  careerName,
}: DeleteModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">you want to delete "{careerName}" ?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

// เพิ่ม interface สำหรับ CreateModal
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (careerData: Omit<Career, "_id" | "createdAt" | "updatedAt">) => void;
}

// เพิ่ม Component CreateModal
const CreateModal = ({ open, onClose, onSave }: CreateModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    isShow: true,
    qualifications: [""] as string[],
    responsibilities: [""] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("กรุณากรอกชื่อตำแหน่งงาน");
      return;
    }
    // กรองเอาค่าว่างออก
    const filteredData = {
      ...formData,
      qualifications: formData.qualifications.filter(
        (item) => item.trim() !== ""
      ),
      responsibilities: formData.responsibilities.filter(
        (item) => item.trim() !== ""
      ),
    };
    onSave(filteredData);
  };

  // เพิ่มฟิลด์ใหม่
  const handleAddField = (field: "qualifications" | "responsibilities") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // ลบฟิลด์
  const handleRemoveField = (
    field: "qualifications" | "responsibilities",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // อัพเดทค่าในฟิลด์
  const handleFieldChange = (
    field: "qualifications" | "responsibilities",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
          Add new position
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Position name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            error={!formData.name.trim()}
            helperText={
              !formData.name.trim() ? "Please enter the position name" : ""
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isShow}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isShow: e.target.checked }))
                }
                color="primary"
              />
            }
            label="Show on website"
          />

          {/* คุณสมบัติ */}
          <div className="space-y-2">
            <Typography variant="subtitle1" gutterBottom>
              Qualifications
            </Typography>
            {formData.qualifications.map((qual, index) => (
              <div key={index} className="flex gap-2 items-start">
                <TextField
                  fullWidth
                  value={qual}
                  onChange={(e) =>
                    handleFieldChange("qualifications", index, e.target.value)
                  }
                  placeholder={`Qualification ${index + 1}`}
                  size="small"
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleRemoveField("qualifications", index)}
                  sx={{ minWidth: "40px", height: "40px" }}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              variant="outlined"
              onClick={() => handleAddField("qualifications")}
              startIcon={<FaPlus />}
              size="small"
            >
              Add Qualification
            </Button>
          </div>

          {/* ความรับผิดชอบ */}
          <div className="space-y-2">
            <Typography variant="subtitle1" gutterBottom>
              Responsibilities
            </Typography>
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2 items-start">
                <TextField
                  fullWidth
                  value={resp}
                  onChange={(e) =>
                    handleFieldChange("responsibilities", index, e.target.value)
                  }
                  placeholder={`Responsibility ${index + 1}`}
                  size="small"
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleRemoveField("responsibilities", index)}
                  sx={{ minWidth: "40px", height: "40px" }}
                >
                  X
                </Button>
              </div>
            ))}
            <Button
              variant="outlined"
              onClick={() => handleAddField("responsibilities")}
              startIcon={<FaPlus />}
              size="small"
            >
              Add Responsibility
            </Button>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outlined" onClick={onClose}>
              cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!formData.name.trim()}
            >
              save
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default function Career() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    items: string[];
  }>({ title: "", items: [] });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch("/api/careers");
      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
      const data = await response.json();
      setCareers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูล"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (title: string, items: string[]) => {
    setModalContent({ title, items });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleEdit = async (careerData: Partial<Career>) => {
    try {
      const token = Cookies.get("token_atmosph");
      if (!token || !selectedCareer) {
        showSnackbar("กรุณาเข้าสู่ระบบ", "error");
        return;
      }

      const response = await fetch(`/api/careers/${selectedCareer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(careerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
      }

      await fetchCareers();
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

  const handleDelete = async () => {
    try {
      const token = Cookies.get("token_atmosph");
      if (!token || !selectedCareer) {
        showSnackbar("กรุณาเข้าสู่ระบบ", "error");
        return;
      }

      const response = await fetch(`/api/careers/${selectedCareer._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
      }

      await fetchCareers();
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

  // แก้ไขส่วนของปุ่มในตาราง
  const actionButtons = (career: Career) => (
    <div className="flex space-x-3">
      <button
        className="text-blue-600 hover:text-blue-300"
        onClick={() => {
          setSelectedCareer(career);
          setEditModalOpen(true);
        }}
      >
        <FaEdit />
      </button>
      <button
        className=" hover:text-blue-300"
        onClick={() => {
          setSelectedCareer(career);
          setDeleteModalOpen(true);
        }}
      >
        <FaTrash />
      </button>
    </div>
  );

  // เพิ่มฟังก์ชัน handleCreate
  const handleCreate = async (
    careerData: Omit<Career, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const token = Cookies.get("token_atmosph");
      if (!token) {
        showSnackbar("กรุณาเข้าสู่ระบบ", "error");
        return;
      }

      const response = await fetch("/api/careers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(careerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      }

      await fetchCareers();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-black">Join Our Team</div>

        <div
          className="bg-primary hover:bg-blue-400 cursor-pointer transition-colors duration-300 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCreateModalOpen(true)}
        >
          add position
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                isShow
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                qualifications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                responsibilities
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {careers.map((career) => (
              <tr key={career._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {career.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {career.isShow ? (
                    <span className="px-2 inline-flex items-center text-xs leading-5 w-[60px] font-semibold rounded-md bg-green-100 text-green-800">
                      <FaEye className="mr-1" /> แสดง
                    </span>
                  ) : (
                    <span className="px-2 inline-flex items-center text-xs leading-5 w-[60px] font-semibold rounded-md bg-red-100 text-red-800">
                      <FaEyeSlash className="mr-1" /> ซ่อน
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      handleOpenModal("qualifications", career.qualifications)
                    }
                    className="text-sm text-blue-600 underline  hover:text-blue-400 hover:underline"
                  >
                    {career.qualifications.length} items
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() =>
                      handleOpenModal(
                        "responsibilities",
                        career.responsibilities
                      )
                    }
                    className="text-sm text-blue-600 underline  hover:text-blue-400 hover:underline"
                  >
                    {career.responsibilities.length} items
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {actionButtons(career)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={modalContent.title}
        items={modalContent.items}
      />

      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        career={selectedCareer}
        onSave={handleEdit}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        careerName={selectedCareer?.name || ""}
      />

      <CreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreate}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
