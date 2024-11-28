"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Cookies from "js-cookie";

interface Footer {
  _id: string;
  phone: string;
  address: string[];
  email: string;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function FooterPage() {
  const [footer, setFooter] = useState<Footer | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<Footer | null>(null);

  const fetchFooter = async () => {
    try {
      const response = await fetch("/api/footer");
      const data = await response.json();
      if (data && data.length > 0) {
        setFooter(data[0]);
      }
    } catch (error) {
      console.error("Error fetching footer:", error);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleEdit = () => {
    setEditData(footer);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditData(null);
  };

  const handleAddAddress = () => {
    if (editData) {
      setEditData({
        ...editData,
        address: [...editData.address, ""],
      });
    }
  };

  const handleRemoveAddress = (index: number) => {
    if (editData) {
      const newAddress = editData.address.filter((_, i) => i !== index);
      setEditData({
        ...editData,
        address: newAddress,
      });
    }
  };

  const handleAddressChange = (index: number, value: string) => {
    if (editData) {
      const newAddress = [...editData.address];
      newAddress[index] = value;
      setEditData({
        ...editData,
        address: newAddress,
      });
    }
  };

  const handleSave = async () => {
    if (!editData) return;

    const token = Cookies.get("token_atmosph");
    if (!token) {
      return;
    }

    try {
      const response = await fetch("/api/footer", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: editData._id,
          phone: editData.phone,
          email: editData.email,
          address: editData.address,
        }),
      });

      if (response.ok) {
        await fetchFooter();
        handleClose();
      } else {
        console.error("Failed to update footer");
      }
    } catch (error) {
      console.error("Error updating footer:", error);
    }
  };

  if (!footer) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Atmosph Footer
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>เบอร์โทร:</strong> {footer.phone}
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>อีเมล:</strong> {footer.email}
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>ที่อยู่:</strong>
          </Typography>
          {footer.address.map((addr, index) => (
            <Typography key={index} variant="body2" sx={{ ml: 2 }}>
              {addr}
            </Typography>
          ))}

          <Button variant="contained" onClick={handleEdit} sx={{ mt: 2 }}>
            แก้ไข
          </Button>
        </CardContent>
      </Card>

      <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            แก้ไขข้อมูลการติดต่อ
          </Typography>

          {editData && (
            <Stack spacing={2}>
              <TextField
                label="เบอร์โทร"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                fullWidth
              />

              <TextField
                label="อีเมล"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                fullWidth
              />

              <Typography variant="subtitle1">ที่อยู่:</Typography>

              {editData.address.map((addr, index) => (
                <Paper key={index} sx={{ p: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      value={addr}
                      onChange={(e) =>
                        handleAddressChange(index, e.target.value)
                      }
                      fullWidth
                      size="small"
                    />
                    <IconButton
                      onClick={() => handleRemoveAddress(index)}
                      color="error"
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddAddress}
                variant="outlined"
              >
                เพิ่มที่อยู่
              </Button>

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button variant="contained" onClick={handleSave}>
                  บันทึก
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  ยกเลิก
                </Button>
              </Box>
            </Stack>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
