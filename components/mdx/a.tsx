export default function A({
  children,
  href,
}: {
  children?: React.ReactNode;
  href?: string | undefined;
}) {
  return (
    <a
      href={href}
      className="font-medium text-blue-500 underline underline-offset-4"
      target="_blank"
    >
      {children}
    </a>
  );
}
