import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { classifyPath, NOT_FOUND_SEGMENT } from "./i18n/known-paths";
import { routing } from "./i18n/routing";

// Next 16 renombró `middleware.ts` a `proxy.ts`. next-intl expone el handler como `createMiddleware`.
const intl = createMiddleware(routing);

/**
 * 404 real para URLs desconocidas bajo un locale.
 *
 * Con `cacheComponents`, una ruta dinámica emite su shell (200) antes de que la página llame a
 * `notFound()`, y una página prerenderizada ignora el `status` de un rewrite. Por eso el proxy
 * decide aquí: pide la página 404 estática del locale (`/[locale]/not-found-page`) y devuelve su
 * HTML con status 404. Así el contenido sale completo del servidor y el buscador ve un 404.
 */
async function notFoundResponse(request: NextRequest, locale: string) {
  const url = new URL(`/${locale}/${NOT_FOUND_SEGMENT}`, request.nextUrl.origin);
  try {
    // La cookie viaja para que las previews con Deployment Protection también respondan.
    const page = await fetch(url, { headers: { cookie: request.headers.get("cookie") ?? "" } });
    if (page.ok) {
      return new NextResponse(page.body, {
        status: 404,
        headers: { "content-type": page.headers.get("content-type") ?? "text/html; charset=utf-8" },
      });
    }
  } catch {
    // Si el fetch falla, al menos el status es el correcto.
  }
  return NextResponse.rewrite(url, { status: 404 });
}

export default function proxy(request: NextRequest) {
  const verdict = classifyPath(request.nextUrl.pathname);
  if (verdict.kind === "unknown") return notFoundResponse(request, verdict.locale);
  return intl(request);
}

export const config = {
  // Todo menos API, internos de Next/Vercel, imágenes OG y archivos con extensión (assets de public/).
  matcher: "/((?!api|trpc|_next|_vercel|.*opengraph-image|.*\\..*).*)",
};
