"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteAction(_: any, formData: FormData) {
  //   const goodId = formData.get("goodid") as string;
  const goodId = formData.get("goodid")?.toString();
  if (!goodId) {
    return { status: false, message: `해당하는 ${goodId}가 없습니다.` };
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${goodId}`,
      { method: "DELETE" }
    );
    const { id } = await response.json();
    revalidatePath(`/good/${id}`);
    revalidateTag(`good-${id}`);
    return {
      status: true,
      message: `${id} 삭제에 성공하였습니다.`,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      messsage: `해당하는 ${goodId}가 삭제에 실패했습니다. 다시 시도해주세요.`,
    };
  }
}
