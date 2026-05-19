import React from 'react'

interface JsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
