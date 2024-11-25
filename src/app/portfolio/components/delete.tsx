"use client";

import React from "react";
import type { Portfolio } from "../type";
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

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  portfolioName: string;
}

export default function Delete({
  open,
  onClose,
  onConfirm,
  portfolioName,
}: DeleteModalProps) {
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
        <p className="mb-4">you want to delete "{portfolioName}" ?</p>
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
}
