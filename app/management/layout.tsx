export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="text-foreground bg-background">{children}</main>;
}
