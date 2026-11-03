/**
 * Comprobación en tiempo de compilación: `es` y `en` deben tener exactamente las mismas claves.
 * Si falta una clave en cualquiera de los dos, `tsc` (y por tanto `next build`) falla aquí.
 */
import type en from "../../messages/en.json";
import type es from "../../messages/es.json";

type DeepKeys<T> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? `${K}.${DeepKeys<T[K]>}` : K;
}[keyof T & string];

type Missing<A, B> = Exclude<DeepKeys<A>, DeepKeys<B>>;

type AssertNever<T extends never> = T;

export type MissingInEn = AssertNever<Missing<typeof es, typeof en>>;
export type MissingInEs = AssertNever<Missing<typeof en, typeof es>>;
