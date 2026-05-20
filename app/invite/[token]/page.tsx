export default async function InvitePage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 24 }}>
      <h1>Accept invite</h1>
      <p>
        Invite token:
      </p>
      <pre>{token}</pre>
      <p>
        Invite acceptance will be wired to Supabase after deployment.
      </p>
      <a href="/">Back to app</a>
    </main>
  );
}
