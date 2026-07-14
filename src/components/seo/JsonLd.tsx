import React from 'react'

interface JsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a literal "</script>" inside any interpolated string
      // can't break out of this tag — Google's recommended defensive pattern.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  )
}

export function MultiJsonLd({ schemas }: { schemas: Record<string, unknown>[] }) {
  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} schema={schema} />
      ))}
    </>
  )
}
