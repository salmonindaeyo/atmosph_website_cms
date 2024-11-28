import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET - ดึงข้อมูล footers ทั้งหมด
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("atmosph_website");
    
    const footers = await db.collection("footers")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(footers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล footers" },
      { status: 500 }
    );
  }
}

// POST - เพิ่มข้อมูล footer ใหม่
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

    const { address, phone, email } = await request.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!address || !Array.isArray(address) || !phone || !email) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็น (address เป็น array, phone, email)" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("atmosph_website");

    const result = await db.collection("footers").insertOne({
      address,  // address เป็น array
      phone,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "เพิ่มข้อมูลสำเร็จ",
      footerId: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" },
      { status: 500 }
    );
  }
}

// PATCH - แก้ไขข้อมูล footer
export async function PATCH(request: Request) {
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

    const { _id, address, phone, email } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID" },
        { status: 400 }
      );
    }

    // ตรวจสอบ address ถ้ามีการส่งมา
    if (address !== undefined && !Array.isArray(address)) {
      return NextResponse.json(
        { error: "address ต้องเป็น array" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("atmosph_website");

    const updateData: any = {
      updatedAt: new Date()
    };

    // เพิ่มเฉพาะฟิลด์ที่ส่งมาในการอัพเดท
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;

    const result = await db.collection("footers").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "แก้ไขข้อมูลสำเร็จ"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูล footer
export async function DELETE(request: Request) {
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

    const { _id } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("atmosph_website");

    const result = await db.collection("footers").deleteOne({
      _id: new ObjectId(_id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลที่ต้องการลบ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "ลบข้อมูลสำเร็จ"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
