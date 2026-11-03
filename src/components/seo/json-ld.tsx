/** `<script type="application/ld+json">` con un objeto schema.org. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify no escapa `<`: se reemplaza para que ningún texto pueda cerrar el <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
