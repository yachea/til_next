import { resolve } from "path";

export async function delay(ms: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
}
