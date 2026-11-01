import { notFound } from "next/navigation";

// Cualquier ruta desconocida bajo un locale usa el not-found localizado.
export default function CatchAllPage() {
  notFound();
}
