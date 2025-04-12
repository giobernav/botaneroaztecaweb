import Login from "@/app/components/Login";
import { AuthGetCurrentUserServer } from "../utils/amplify-utils";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { next_url } = (await searchParams) || {};
  const user = await AuthGetCurrentUserServer();

  return !user ? (
    <Login nextUrl={next_url} />
  ) : (
    redirect(next_url || "/fidelity-card")
  );
}
