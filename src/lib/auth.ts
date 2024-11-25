import jwt from "jsonwebtoken";

export const verifyToken = async (token: string) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("กรุณากำหนด JWT_SECRET ใน environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}; 