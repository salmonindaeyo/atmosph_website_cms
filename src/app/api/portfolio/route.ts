import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET - ดึงข้อมูล portfolios ทั้งหมด
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("atmosph_website");
    
    // เพิ่มการเรียงลำดับตาม order จากน้อยไปมาก
    const portfolios = await db.collection("portfolios")
      .find({})
      .sort({ order: 1 })
      .toArray();
    
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

    // ดึงค่า order สูงสุดจาก portfolios collection
    const maxOrderDoc = await db.collection("portfolios")
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    
    const nextOrder = maxOrderDoc.length > 0 ? maxOrderDoc[0].order + 1 : 1;

    const result = await db.collection("portfolios").insertOne({
      name,
      service,
      image,
      isShow,
      order: nextOrder, // เพิ่ม field order
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

// PUT - อัพเดท order ของ portfolios
export async function PUT(request: Request) {
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

    const { portfolios } = await request.json();

    if (!Array.isArray(portfolios)) {
      return NextResponse.json(
        { error: "ข้อมูลต้องเป็น array" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("atmosph_website");

    // ดึงข้อมูล portfolios ทั้งหมดจาก DB
    const allPortfolios = await db.collection("portfolios").find({}).toArray();
    
    // แยก portfolios ที่ไม่ได้อยู่ในการจัดเรียงครั้งนี้
    const orderedIds = portfolios.map((p: any) => new ObjectId(p._id));
    const remainingPortfolios = allPortfolios.filter(
      p => !orderedIds.some(id => id.equals(p._id))
    );

    // อัพเดท order ตาม array ที่ส่งมา
    let order = 1;
    const updateOperations = portfolios.map((portfolio: any) => ({
      updateOne: {
        filter: { _id: new ObjectId(portfolio._id) },
        update: { 
          $set: { 
            order: order++,
            updatedAt: new Date()
          }
        }
      }
    }));

    // อัพเดท order สำหรับ portfolios ที่เหลือ
    const remainingUpdates = remainingPortfolios.map(portfolio => ({
      updateOne: {
        filter: { _id: portfolio._id },
        update: { 
          $set: { 
            order: order++,
            updatedAt: new Date()
          }
        }
      }
    }));

    // รวม operations ทั้งหมดและทำการอัพเดท
    await db.collection("portfolios").bulkWrite([
      ...updateOperations,
      ...remainingUpdates
    ]);

    return NextResponse.json({
      message: "อัพเดทลำดับสำเร็จ"
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัพเดทลำดับ" },
      { status: 500 }
    );
  }
} 