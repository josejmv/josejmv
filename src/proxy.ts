import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Next 16 renombró `middleware.ts` a `proxy.ts`. next-intl expone el handler como `createMiddleware`.
export default createMiddleware(routing);

export const config = {
  // Todo menos API, internos de Next/Vercel y archivos con extensión (assets de public/).
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
