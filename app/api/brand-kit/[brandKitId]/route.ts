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

  const { brandKitId } = await params;

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

export async function PUT(
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

  const { brandKitId } = await params;

  if (!brandKitId) {
    return NextResponse.json({ error: "Brand kit ID is required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();


    let logoUrl: string | null = null;
    const logoPrimaryField = formData.get("logo_primary");

    if (logoPrimaryField instanceof File) {
      // It's a new file upload
      if (logoPrimaryField.size > 0) { // Check if a file was actually selected
        const fileExt = logoPrimaryField.name.split(".").pop();
        const filePath = `${user.id}/${brandKitId}/logo.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("brand-kit-logos") // Assuming you have a bucket named 'brand-kit-logos'
          .upload(filePath, logoPrimaryField, {
            contentType: logoPrimaryField.type,
            upsert: true,
          });

        if (uploadError) {
          return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage
          .from("brand-kit-logos")
          .getPublicUrl(filePath);
        logoUrl = publicUrlData.publicUrl;
      } 
    } else if (typeof logoPrimaryField === 'string' && logoPrimaryField.startsWith('http')) {
      logoUrl = logoPrimaryField;
    } else if (logoPrimaryField === 'null' || logoPrimaryField === null) {
      logoUrl = null;
    }

    const updateData: Record<string, any> = {};

    // Map incoming formData fields to database columns
    if (formData.has("kit_name")) updateData.kit_name = formData.get("kit_name");
    if (formData.has("website")) updateData.website = formData.get("website");
    if (formData.has("brand_summary")) updateData.brand_summary = formData.get("brand_summary");
    if (formData.has("address")) updateData.address = formData.get("address");
    if (formData.has("tone_of_voice")) updateData.tone_of_voice = formData.get("tone_of_voice");
    if (formData.has("copyright")) updateData.copyright = formData.get("copyright");
    if (formData.has("footer")) updateData.footer = formData.get("footer");
    if (formData.has("disclaimers")) updateData.disclaimers = formData.get("disclaimers");
    if (formData.has("socials")) {
      try {
        updateData.socials = JSON.parse(formData.get("socials") as string); // Assuming socials come as a JSON string
      } catch (e) {
        console.error("Error parsing socials JSON:", e);
        return NextResponse.json({ error: "Invalid socials data" }, { status: 400 });
      }
    }
    if (formData.has("color_background")) updateData.color_background = formData.get("color_background");
    if (formData.has("color_container")) updateData.color_container = formData.get("color_container");
    if (formData.has("color_accent")) updateData.color_accent = formData.get("color_accent");
    if (formData.has("color_button_text")) updateData.color_button_text = formData.get("color_button_text");
    if (formData.has("color_foreground")) updateData.color_foreground = formData.get("color_foreground");

    if (logoUrl) {
      updateData.logo_primary = logoUrl;
      updateData.logo_icon = logoUrl; 
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("brandkits")
      .update(updateData)
      .eq("id", brandKitId)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error("Error updating brand kit in Supabase:", error);
      return NextResponse.json({ error: "Failed to update brand kit" }, { status: 500 });
    }

    
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Caught an unexpected error in PUT handler:", error);
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