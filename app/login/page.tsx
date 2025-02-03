import Login from "@/app/components/Login";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { next_url } = searchParams || {};
  return <Login nextUrl={next_url} />;
}
