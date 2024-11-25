import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET - ดึงข้อมูล career ตาม ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("atmosph_website");

    const career = await db.collection("careers").findOne({
      _id: new ObjectId(params.id),
    });

    if (!career) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูล career" },
        { status: 404 }
      );
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล career" },
      { status: 500 }
    );
  }
}

// PUT - แก้ไขข้อมูล career
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { name, qualifications, responsibilities, isShow } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อตำแหน่งงาน" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("atmosph_website");

    const result = await db.collection("careers").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name,
          isShow: isShow ?? true,
          qualifications: qualifications || [],
          responsibilities: responsibilities || [],
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูล career" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "แก้ไขข้อมูลสำเร็จ" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูล career
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const client = await clientPromise;
    const db = client.db("atmosph_website");

    const result = await db.collection("careers").deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูล career" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
} 