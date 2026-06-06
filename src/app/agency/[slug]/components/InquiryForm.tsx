'use client'

import React, { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import type { AgencyDetail } from '@/types/agencyDetail'
import { COUNTRY_FORM_OPTIONS } from '@/lib/data/countryList'

const COUNTRIES = COUNTRY_FORM_OPTIONS

interface InquiryFormProps {
  agency: AgencyDetail
}

export function InquiryForm({ agency }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    country: '',
    message: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="inquiry" aria-labelledby="inquiry-heading">
        <h2 id="inquiry-heading" className="text-[22px] font-bold text-slate-800 mb-6">
          Contact {agency.name}
        </h2>
        <div className="flex items-center gap-4 p-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl">
          <div className="w-12 h-12 bg-[#DCFCE7] rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle size={22} className="text-[#166534]" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#166534]">Inquiry sent successfully!</p>
            <p className="text-[13.5px] text-[#166534]/80 mt-0.5">
              {agency.name} will typically respond within 24–48 hours. Check WhatsApp for faster response.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="inquiry" aria-labelledby="inquiry-heading">
      <h2 id="inquiry-heading" className="text-[22px] font-bold text-slate-800 mb-2">
        Send an Inquiry
      </h2>
      <p className="text-[14px] text-slate-500 mb-6">
        Ask {agency.name} about eligibility, process, or pricing. Responses typically within 24–48 hours.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              WhatsApp / Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Target Country
          </label>
          <select
            id="country"
            name="country"
            required
            value={form.country}
            onChange={handleChange}
            className="w-full h-11 px-4 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors appearance-none"
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Tell us about your experience, target country, exam status, or any specific questions…"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-[15px] font-semibold rounded-xl transition-colors"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={15} />
              Send Inquiry
            </>
          )}
        </button>

        <p className="text-[12px] text-slate-400 text-center">
          Your inquiry is sent directly to {agency.name}. OverseasNursing.com does not share your details with third parties.
        </p>
      </form>
    </section>
  )
}
