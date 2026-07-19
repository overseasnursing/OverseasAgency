'use client'

import React, { useRef, useTransition } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExt from '@tiptap/extension-image'
import LinkExt from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { Heading } from '@tiptap/extension-heading'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { uploadBlogImage } from '@/app/actions/blog-upload'
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Link2, Image as ImageIcon, Undo, Redo, Loader2,
  Table as TableIcon, Columns, Trash2,
} from 'lucide-react'

type Props = {
  value:    string
  onChange: (html: string) => void
}

const btn = (active?: boolean) =>
  [
    'w-8 h-8 flex items-center justify-center rounded-lg transition-colors flex-shrink-0',
    active
      ? 'bg-primary text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

const Sep = () => <div className="w-px h-5 bg-slate-200 mx-0.5 flex-shrink-0" />

export function TiptapEditor({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, startUpload] = useTransition()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      ImageExt.configure({ inline: false, allowBase64: false }),
      LinkExt.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({ placeholder: 'Start writing your blog post…' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[400px] px-5 py-4 focus:outline-none text-[14px] leading-relaxed',
      },
    },
  })

  function handleImageClick() {
    fileRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    e.target.value = ''
    startUpload(async () => {
      const fd = new FormData()
      fd.append('file', file)
      const res = await uploadBlogImage(fd)
      if (res.url) {
        editor.chain().focus().setImage({ src: res.url, alt: file.name }).run()
      } else {
        alert(res.error ?? 'Upload failed')
      }
    })
  }

  function handleSetLink() {
    if (!editor) return
    const prev = editor.getAttributes('link').href ?? ''
    const url  = window.prompt('Enter URL', prev)
    if (url === null) return
    url === ''
      ? editor.chain().focus().unsetLink().run()
      : editor.chain().focus().setLink({ href: url, target: '_blank' }).run()
  }

  if (!editor) return null

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-slate-50">

        <button type="button" title="Undo" className={btn()} onClick={() => editor.chain().focus().undo().run()}><Undo size={14} /></button>
        <button type="button" title="Redo" className={btn()} onClick={() => editor.chain().focus().redo().run()}><Redo size={14} /></button>

        <Sep />

        <button type="button" title="Heading 1" className={btn(editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={15} /></button>
        <button type="button" title="Heading 2" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></button>
        <button type="button" title="Heading 3" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></button>

        <Sep />

        <button type="button" title="Bold"      className={btn(editor.isActive('bold'))}      onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></button>
        <button type="button" title="Italic"    className={btn(editor.isActive('italic'))}    onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></button>
        <button type="button" title="Underline" className={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={14} /></button>

        <Sep />

        <button type="button" title="Bullet list"   className={btn(editor.isActive('bulletList'))}  onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></button>
        <button type="button" title="Numbered list" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></button>
        <button type="button" title="Blockquote"    className={btn(editor.isActive('blockquote'))}  onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></button>

        <Sep />

        <button type="button" title="Insert table" className={btn(editor.isActive('table'))} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={14} /></button>
        {editor.isActive('table') && (
          <>
            <button type="button" title="Add column" className={btn()} onClick={() => editor.chain().focus().addColumnAfter().run()}><Columns size={14} /></button>
            <button type="button" title="Delete table" className={btn()} onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 size={14} /></button>
          </>
        )}

        <Sep />

        <button type="button" title="Insert link"  className={btn(editor.isActive('link'))} onClick={handleSetLink}><Link2 size={14} /></button>
        <button type="button" title="Upload image" className={btn()} onClick={handleImageClick} disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
        </button>

      </div>

      {/* ── Content area ── */}
      <EditorContent editor={editor} />

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
