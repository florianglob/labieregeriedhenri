import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidatePath("/");
  revalidatePath("/bieres");
  revalidatePath("/carte");
  return NextResponse.json({ revalidated: true });
}
