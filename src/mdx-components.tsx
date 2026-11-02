import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/projects/mdx/callout";
import { Flow } from "@/components/projects/mdx/flow";

/**
 * Estilos de los case studies (MDX). Todo con tokens: el contenido MDX no lleva clases ni colores.
 * Los `##` reciben `id` con rehype-slug y alimentan el índice (TableOfContents).
 */
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-12 scroll-mt-28 font-display text-2xl font-semibold first:mt-0" {...props} />
  ),
  h3: (props) => <h3 className="mt-8 font-display text-lg font-semibold" {...props} />,
  p: (props) => <p className="mt-4 leading-[1.8] text-text-2" {...props} />,
  ul: (props) => (
    <ul
      className="mt-4 flex list-disc flex-col gap-2 pl-5 leading-[1.7] text-text-2 marker:text-accent-text"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-4 flex list-decimal flex-col gap-2 pl-5 leading-[1.7] text-text-2 marker:text-accent-text"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-text" {...props} />,
  a: (props) => (
    <a className="text-accent-text underline underline-offset-4 hover:no-underline" {...props} />
  ),
  code: (props) => (
    <code
      className="rounded-md bg-chip px-1.5 py-0.5 font-mono text-[0.9em] text-text"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-accent-text pl-4 font-display text-lg text-text"
      {...props}
    />
  ),
  Callout,
  Flow,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
