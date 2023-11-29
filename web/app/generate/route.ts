import OpenAI from "openai";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "You must be signed in to call this endpoint",
      },
      { status: 401 }
    );
  }

  const data = await request.json();
  const { n: _n, style: _style, prompt } = data;

  if (!prompt) {
    return NextResponse.json(
      {
        error: "Bad Request",
        message: "You must provide a prompt",
      },
      { status: 400 }
    );
  }

  const __n = Number(_n ?? 1) ?? 1;
  const n = Math.min(Math.max(__n, 1), 5);
  const style = _style === "vivid" ? "vivid" : "natural";

  const prompt_v2 = `"${prompt}" styles: [render, 4k, realistic, octane, c4d, white-bg, minimalistic, for-ui]`;

  // TODO: enhence the prompt
  // openai.chat.completions.create({
  //   'model': 'gpt-4-1106-preview',
  //   'messages': [
  //     {
  //       'role': 'system',
  //     }
  //   ]
  // })

  const { data: generated } = await openai.images.generate({
    prompt: prompt_v2,
    model: "dall-e-3",
    n: n,
    quality: "hd",
    response_format: "url",
    size: "1024x1792",
    style,
    user: user.id,
  });
  console.log(generated);

  return NextResponse.json(generated);
}
