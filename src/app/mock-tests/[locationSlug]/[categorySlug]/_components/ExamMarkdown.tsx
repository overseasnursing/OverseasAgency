'use client'

import React from 'react'
import Markdown from 'markdown-to-jsx'

function MarkdownImg({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ''}
        className="w-full rounded-xl border border-slate-200 shadow-sm"
        loading="lazy"
      />
      {alt && (
        <figcaption className="text-center text-[12px] text-slate-400 mt-2 italic">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}

function MarkdownA({
  href,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http')
  return (
    <a
      href={href}
      className="text-primary hover:underline font-medium"
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}

export function ExamMarkdown({ content }: { content: string }) {
  return (
    <Markdown
      options={{
        forceBlock: true,
        overrides: {
          h2: {
            component: ({ children, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
              <h2
                className="text-[21px] font-bold text-slate-800 mt-10 mb-4 pb-3 border-b border-slate-100 scroll-mt-24"
                {...p}
              >
                {children}
              </h2>
            ),
          },
          h3: {
            component: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
              <h3 className="text-[16px] font-bold text-slate-700 mt-7 mb-3">{children}</h3>
            ),
          },
          h4: {
            component: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
              <h4 className="text-[14px] font-semibold text-slate-700 mt-5 mb-2">{children}</h4>
            ),
          },
          p: {
            component: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
              <p className="text-[14.5px] text-slate-600 leading-[1.8] mb-4">{children}</p>
            ),
          },
          ul: {
            component: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
              <ul className="mb-5 ml-5 space-y-2 list-disc text-[14px] text-slate-600">{children}</ul>
            ),
          },
          ol: {
            component: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
              <ol className="mb-5 ml-5 space-y-2 list-decimal text-[14px] text-slate-600">{children}</ol>
            ),
          },
          li: {
            component: ({ children }: React.HTMLAttributes<HTMLLIElement>) => (
              <li className="leading-relaxed pl-1">{children}</li>
            ),
          },
          strong: {
            component: ({ children }: React.HTMLAttributes<HTMLElement>) => (
              <strong className="font-semibold text-slate-800">{children}</strong>
            ),
          },
          em: {
            component: ({ children }: React.HTMLAttributes<HTMLElement>) => (
              <em className="italic text-slate-600">{children}</em>
            ),
          },
          blockquote: {
            component: ({ children }: React.HTMLAttributes<HTMLElement>) => (
              <blockquote className="my-5 border-l-4 border-primary/40 pl-5 py-1 bg-primary/[0.04] rounded-r-xl text-[14px] text-slate-600 italic">
                {children}
              </blockquote>
            ),
          },
          table: {
            component: ({ children }: React.HTMLAttributes<HTMLTableElement>) => (
              <div className="overflow-x-auto mb-7 rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-[13.5px] border-collapse">{children}</table>
              </div>
            ),
          },
          thead: {
            component: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
              <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>
            ),
          },
          tbody: {
            component: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
              <tbody>{children}</tbody>
            ),
          },
          tr: {
            component: ({ children }: React.HTMLAttributes<HTMLTableRowElement>) => (
              <tr className="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition-colors">
                {children}
              </tr>
            ),
          },
          th: {
            component: ({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
              <th className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap">
                {children}
              </th>
            ),
          },
          td: {
            component: ({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
              <td className="px-4 py-3 text-slate-600">{children}</td>
            ),
          },
          a:   { component: MarkdownA },
          img: { component: MarkdownImg },
          hr: {
            component: () => <hr className="my-8 border-slate-200" />,
          },
        },
      }}
    >
      {content}
    </Markdown>
  )
}
