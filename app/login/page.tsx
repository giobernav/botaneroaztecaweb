import Login from "@/app/components/Login";
import { AuthGetCurrentUserServer } from "../utils/amplify-utils";
import { redirect } from "next/navigation";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function LoginPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const next_url = searchParams.next_url;
  const user = await AuthGetCurrentUserServer();
  console.log("LoginPage user:", user);

  return !user ? (
    <Login nextUrl={next_url} />
  ) : (
    redirect(next_url || "/loyalty")
  );
}
