import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET - ดึงข้อมูล portfolios ทั้งหมด
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("atmosph_website");
    
    const portfolios = await db.collection("portfolios").find({}).toArray();
    
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล portfolios" },
      { status: 500 }
    );
  }
}

// POST - เพิ่มข้อมูล portfolio ใหม่
export async function POST(request: Request) {
  try {
    // ตรวจสอบ token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "ไม่พบ token" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "token ไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const { name, service, image, isShow = true } = await request.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !service || !image) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("atmosph_website");

    const result = await db.collection("portfolios").insertOne({
      name,
      service,
      image,
      isShow,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "เพิ่มข้อมูลสำเร็จ",
      portfolioId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" },
      { status: 500 }
    );
  }
} 