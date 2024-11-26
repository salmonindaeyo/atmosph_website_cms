"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import { Portfolio } from "../type";
import { storage } from "@/config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const style = {
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

interface CreateModalProps {
  isEdit?: boolean;
  open: boolean;
  onClose: () => void;
  onCreate?: (
    portfolioData: Omit<Portfolio, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onEdit?: (
    portfolioData: Omit<Portfolio, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  selectedPortfolio?: Portfolio;
}

export default function CreateModal({
  isEdit,
  open,
  onClose,
  onEdit,
  onCreate,
  selectedPortfolio,
}: CreateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    isShow: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedPortfolio) {
      setFormData({
        name: selectedPortfolio.name ?? "",
        service: selectedPortfolio.service ?? "",
        isShow: selectedPortfolio.isShow ?? true,
      });

      if (selectedPortfolio.image) {
        setImageUrl(selectedPortfolio.image);
        setImagePreview(selectedPortfolio.image);
      }
    }
  }, [selectedPortfolio]);

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        service: "",
        isShow: true,
      });
      setImage(null);
      setImagePreview("");
      setImageUrl("");
    } else {
      if (!isEdit) {
        setFormData({
          name: "",
          service: "",
          isShow: true,
        });
        setImage(null);
        setImagePreview("");
        setImageUrl("");
      }
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = async () => {
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
    setImage(null);
    setImagePreview("");
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("create 3");
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = imageUrl;
      if (image) {
        const storageRef = ref(
          storage,
          `portfolio/${Date.now()}_${image.name}`
        );
        const snapshot = await uploadBytes(storageRef, image);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const portfolioData = {
        ...formData,
        image: finalImageUrl,
      };
      console.log("create 5555");

      if (isEdit) {
        await onEdit(portfolioData);
      } else {
        console.log("create 1");
        await onCreate(portfolioData);
      }

      // Reset form
      setFormData({
        name: "",
        service: "",
        isShow: true,
      });
      setImage(null);
      setImagePreview("");
      setImageUrl("");
      onClose();
    } catch (error) {
      console.error("Error handling portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          {isEdit ? "Edit Portfolio" : "Add Portfolio"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Portfolio Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Service"
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isShow}
                onChange={handleInputChange}
                name="isShow"
              />
            }
            label="Show Portfolio"
          />
          <Box my={2}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              fullWidth
            >
              Upload Image
            </Button>
          </Box>
          {(imagePreview || imageUrl) && (
            <Box my={2} position="relative">
              <img
                src={imagePreview || imageUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={handleRemoveImage}
                style={{ position: "absolute", top: 8, right: 8 }}
              >
                Remove
              </Button>
            </Box>
          )}
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
