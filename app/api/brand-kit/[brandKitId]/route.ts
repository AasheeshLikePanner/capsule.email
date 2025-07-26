import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { brandKitId: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brandKitId } = params;

  if (!brandKitId) {
    return NextResponse.json({ error: "Brand kit ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("brandkits")
      .select("*")
      .eq("id", brandKitId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching brand kit:", error);
      return NextResponse.json({ error: "Failed to fetch brand kit" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching brand kit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { brandKitId: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brandKitId } = params;

  if (!brandKitId) {
    return NextResponse.json({ error: "Brand kit ID is required" }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from("brandkits")
      .delete()
      .eq("id", brandKitId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting brand kit:", error);
      return NextResponse.json({ error: "Failed to delete brand kit" }, { status: 500 });
    }

    return NextResponse.json({ message: "Brand kit deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand kit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}