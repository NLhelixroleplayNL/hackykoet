import { NextRequest, NextResponse } from "next/server"
import { getTranscript } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return new NextResponse("Niet gevonden", { status: 404 })
  }

  let transcript
  try {
    transcript = await getTranscript(id)
  } catch {
    return new NextResponse("Database fout", { status: 500 })
  }

  if (!transcript) {
    return new NextResponse(notFoundPage(), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  }

  return new NextResponse(transcript.html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  })
}

function notFoundPage(): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Transcript niet gevonden</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#1e1f22;color:#b5bac1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh}
    .card{background:#2b2d31;border-radius:12px;padding:48px 40px;text-align:center;max-width:400px}
    .icon{font-size:48px;margin-bottom:16px}
    h1{color:#f2f3f5;font-size:22px;margin-bottom:8px}
    p{font-size:14px;line-height:1.6}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔍</div>
    <h1>Transcript niet gevonden</h1>
    <p>Dit transcript bestaat niet of is verwijderd.</p>
  </div>
</body>
</html>`
}
