export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          role: 'registered_user' | 'agency' | 'admin'
          is_banned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          role?: 'registered_user' | 'agency' | 'admin'
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          role?: 'registered_user' | 'agency' | 'admin'
          is_banned?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      agencies: {
        Row: {
          id: string
          slug: string
          name: string
          city: string
          state: string
          location: string
          established: number | null
          trust_level: 'verified' | 'trusted' | 'unverified' | 'scam-reported'
          rating: number | null
          review_count: number
          placement_count: number
          transparency_score: number | null
          countries: string[]
          exams_supported: string[]
          pricing_min_lakhs: number | null
          pricing_max_lakhs: number | null
          pricing_is_approximate: boolean
          hidden_charges_reported: number
          visa_sponsorship: boolean
          average_timeline_months: string | null
          tagline: string | null
          featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          city: string
          state: string
          location: string
          established?: number | null
          trust_level?: 'verified' | 'trusted' | 'unverified' | 'scam-reported'
          rating?: number | null
          review_count?: number
          placement_count?: number
          transparency_score?: number | null
          countries?: string[]
          exams_supported?: string[]
          pricing_min_lakhs?: number | null
          pricing_max_lakhs?: number | null
          pricing_is_approximate?: boolean
          hidden_charges_reported?: number
          visa_sponsorship?: boolean
          average_timeline_months?: string | null
          tagline?: string | null
          featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          city?: string
          state?: string
          trust_level?: 'verified' | 'trusted' | 'unverified' | 'scam-reported'
          rating?: number | null
          review_count?: number
          placement_count?: number
          transparency_score?: number | null
          featured?: boolean
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          agency_id: string | null
          agency_slug: string
          agency_name: string
          user_id: string | null
          author_name: string
          author_from: string
          country_placed: string
          exam_taken: string | null
          timeline_months: number | null
          actual_cost_paid: string | null
          overall_rating: number
          communication_rating: number | null
          transparency_rating: number | null
          speed_rating: number | null
          review_text: string
          surprise_charges: string | null
          advice: string | null
          placed: boolean
          recommends: boolean
          status: 'pending' | 'approved' | 'rejected'
          moderated_by: string | null
          moderated_at: string | null
          reject_reason: string | null
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id?: string | null
          agency_slug: string
          agency_name: string
          user_id?: string | null
          author_name: string
          author_from: string
          country_placed: string
          exam_taken?: string | null
          timeline_months?: number | null
          actual_cost_paid?: string | null
          overall_rating: number
          communication_rating?: number | null
          transparency_rating?: number | null
          speed_rating?: number | null
          review_text: string
          surprise_charges?: string | null
          advice?: string | null
          placed?: boolean
          recommends?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          moderated_by?: string | null
          moderated_at?: string | null
          reject_reason?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'approved' | 'rejected'
          moderated_by?: string | null
          moderated_at?: string | null
          reject_reason?: string | null
          helpful_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_agency_id_fkey'
            columns: ['agency_id']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      scam_reports: {
        Row: {
          id: string
          slug: string
          agency_id: string | null
          agency_slug: string
          agency_name: string
          user_id: string | null
          reporter_name: string
          reporter_from: string
          category: 'fee-fraud' | 'fake-job' | 'document-fraud' | 'visa-fraud' | 'abandonment' | 'other'
          severity: 'critical' | 'high' | 'moderate'
          country_promised: string
          amount_lost: number | null
          amount_paid: number | null
          amount_recovered: number | null
          incident_date: string | null
          incident_text: string
          warning_signs_missed: string[] | null
          lessons_learned: string[] | null
          emotional_experience: string | null
          resolved: boolean
          agency_responded: boolean
          agency_response_text: string | null
          evidence_count: number
          status: 'pending' | 'approved' | 'rejected'
          moderated_by: string | null
          moderated_at: string | null
          reject_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          agency_id?: string | null
          agency_slug: string
          agency_name: string
          user_id?: string | null
          reporter_name: string
          reporter_from: string
          category: 'fee-fraud' | 'fake-job' | 'document-fraud' | 'visa-fraud' | 'abandonment' | 'other'
          severity: 'critical' | 'high' | 'moderate'
          country_promised: string
          amount_lost?: number | null
          amount_paid?: number | null
          amount_recovered?: number | null
          incident_date?: string | null
          incident_text: string
          warning_signs_missed?: string[] | null
          lessons_learned?: string[] | null
          emotional_experience?: string | null
          resolved?: boolean
          agency_responded?: boolean
          agency_response_text?: string | null
          evidence_count?: number
          status?: 'pending' | 'approved' | 'rejected'
          moderated_by?: string | null
          moderated_at?: string | null
          reject_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'approved' | 'rejected'
          moderated_by?: string | null
          moderated_at?: string | null
          reject_reason?: string | null
          resolved?: boolean
          agency_responded?: boolean
          agency_response_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'scam_reports_agency_id_fkey'
            columns: ['agency_id']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'scam_reports_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      scam_evidence: {
        Row: {
          id: string
          scam_report_id: string
          storage_path: string
          file_name: string
          file_type: string
          created_at: string
        }
        Insert: {
          id?: string
          scam_report_id: string
          storage_path: string
          file_name: string
          file_type: string
          created_at?: string
        }
        Update: {
          storage_path?: string
          file_name?: string
          file_type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'scam_evidence_scam_report_id_fkey'
            columns: ['scam_report_id']
            isOneToOne: false
            referencedRelation: 'scam_reports'
            referencedColumns: ['id']
          }
        ]
      }
      jobs: {
        Row: {
          id: string
          title: string
          slug: string
          country: string
          city: string | null
          agency_id: string | null
          posted_by_user_id: string
          job_type: string
          experience_required: string | null
          salary: string | null
          description: string
          status: 'pending' | 'approved' | 'hold' | 'expired' | 'rejected'
          expiry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          country: string
          city?: string | null
          agency_id?: string | null
          posted_by_user_id: string
          job_type: string
          experience_required?: string | null
          salary?: string | null
          description: string
          status?: 'pending' | 'approved' | 'hold' | 'expired' | 'rejected'
          expiry_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          country?: string
          city?: string | null
          agency_id?: string | null
          job_type?: string
          experience_required?: string | null
          salary?: string | null
          description?: string
          status?: 'pending' | 'approved' | 'hold' | 'expired' | 'rejected'
          expiry_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_agency_id_fkey'
            columns: ['agency_id']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'jobs_posted_by_user_id_fkey'
            columns: ['posted_by_user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          user_id: string
          full_name: string
          email: string
          phone: string
          current_country: string
          cv_url: string
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          full_name: string
          email: string
          phone: string
          current_country: string
          cv_url: string
          created_at?: string
        }
        Update: {
          full_name?: string
          email?: string
          phone?: string
          current_country?: string
          cv_url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'job_applications_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'job_applications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
