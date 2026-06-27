// app/page.tsx

import { redirect } from "next/navigation";
// import { auth } from "@/auth"; // Example

export default async function Page() {
  // const session = await auth();

  // if (session) {
  //   redirect("/dashboard");
  // }

  redirect("/signin");
}