export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Métadata interne Supabase : indique la version Postgrest utilisée par le
  // projet hébergé. Permet à @supabase/postgrest-js de typer correctement les
  // signatures de .insert(), .update(), .upsert() selon les capacités du serveur.
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_periods: {
        Row: {
          academic_year_id: string
          created_at: string | null
          ends_on: string
          id: string
          is_current: boolean | null
          kind: string
          name: string
          ordinal: number
          organization_id: string
          starts_on: string
        }
        Insert: {
          academic_year_id: string
          created_at?: string | null
          ends_on: string
          id?: string
          is_current?: boolean | null
          kind?: string
          name: string
          ordinal: number
          organization_id: string
          starts_on: string
        }
        Update: {
          academic_year_id?: string
          created_at?: string | null
          ends_on?: string
          id?: string
          is_current?: boolean | null
          kind?: string
          name?: string
          ordinal?: number
          organization_id?: string
          starts_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_periods_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_periods_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_years: {
        Row: {
          created_at: string | null
          ends_on: string
          id: string
          is_current: boolean | null
          name: string
          organization_id: string
          starts_on: string
        }
        Insert: {
          created_at?: string | null
          ends_on: string
          id?: string
          is_current?: boolean | null
          name: string
          organization_id: string
          starts_on: string
        }
        Update: {
          created_at?: string | null
          ends_on?: string
          id?: string
          is_current?: boolean | null
          name?: string
          organization_id?: string
          starts_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_years_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          messages: Json
          organization_id: string | null
          task_type: string | null
          title: string | null
          token_usage: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages?: Json
          organization_id?: string | null
          task_type?: string | null
          title?: string | null
          token_usage?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          messages?: Json
          organization_id?: string | null
          task_type?: string | null
          title?: string | null
          token_usage?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          audience: string | null
          author_id: string | null
          body: string
          class_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          organization_id: string
          published_at: string | null
          title: string
        }
        Insert: {
          audience?: string | null
          author_id?: string | null
          body: string
          class_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          organization_id: string
          published_at?: string | null
          title: string
        }
        Update: {
          audience?: string | null
          author_id?: string | null
          body?: string
          class_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          organization_id?: string
          published_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string | null
          created_at: string | null
          date: string
          id: string
          minutes_late: number | null
          notes: string | null
          organization_id: string
          period: string
          recorded_by: string | null
          status: string
          student_id: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          minutes_late?: number | null
          notes?: string | null
          organization_id: string
          period: string
          recorded_by?: string | null
          status: string
          student_id: string
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          minutes_late?: number | null
          notes?: string | null
          organization_id?: string
          period?: string
          recorded_by?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: number
          ip_address: unknown
          organization_id: string | null
          payload: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          ip_address?: unknown
          organization_id?: string | null
          payload?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          ip_address?: unknown
          organization_id?: string | null
          payload?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bulletins: {
        Row: {
          average: number | null
          class_id: string | null
          class_size: number | null
          created_at: string | null
          finalized_at: string | null
          general_comment: string | null
          generated_at: string | null
          id: string
          mention: string | null
          organization_id: string
          pdf_url: string | null
          period_id: string
          rank: number | null
          student_id: string
        }
        Insert: {
          average?: number | null
          class_id?: string | null
          class_size?: number | null
          created_at?: string | null
          finalized_at?: string | null
          general_comment?: string | null
          generated_at?: string | null
          id?: string
          mention?: string | null
          organization_id: string
          pdf_url?: string | null
          period_id: string
          rank?: number | null
          student_id: string
        }
        Update: {
          average?: number | null
          class_id?: string | null
          class_size?: number | null
          created_at?: string | null
          finalized_at?: string | null
          general_comment?: string | null
          generated_at?: string | null
          id?: string
          mention?: string | null
          organization_id?: string
          pdf_url?: string | null
          period_id?: string
          rank?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulletins_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulletins_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulletins_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulletins_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      class_subjects: {
        Row: {
          class_id: string
          coefficient: number | null
          created_at: string | null
          hours_per_week: number | null
          id: string
          subject_id: string
          teacher_id: string | null
        }
        Insert: {
          class_id: string
          coefficient?: number | null
          created_at?: string | null
          hours_per_week?: number | null
          id?: string
          subject_id: string
          teacher_id?: string | null
        }
        Update: {
          class_id?: string
          coefficient?: number | null
          created_at?: string | null
          hours_per_week?: number | null
          id?: string
          subject_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year_id: string
          capacity: number | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          grade_level: string | null
          homeroom_teacher_id: string | null
          id: string
          level: string | null
          name: string
          organization_id: string
          room: string | null
          section: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year_id: string
          capacity?: number | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          grade_level?: string | null
          homeroom_teacher_id?: string | null
          id?: string
          level?: string | null
          name: string
          organization_id: string
          room?: string | null
          section?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string
          capacity?: number | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          grade_level?: string | null
          homeroom_teacher_id?: string | null
          id?: string
          level?: string | null
          name?: string
          organization_id?: string
          room?: string | null
          section?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_homeroom_teacher_id_fkey"
            columns: ["homeroom_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          handled_at: string | null
          handled_by: string | null
          id: string
          is_handled: boolean | null
          message: string
          name: string
          organization_id: string | null
          phone: string | null
          school_slug: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          is_handled?: boolean | null
          message: string
          name: string
          organization_id?: string | null
          phone?: string | null
          school_slug?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          is_handled?: boolean | null
          message?: string
          name?: string
          organization_id?: string | null
          phone?: string | null
          school_slug?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          academic_year_id: string
          class_id: string
          enrolled_at: string | null
          id: string
          left_at: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          academic_year_id: string
          class_id: string
          enrolled_at?: string | null
          id?: string
          left_at?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          academic_year_id?: string
          class_id?: string
          enrolled_at?: string | null
          id?: string
          left_at?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_types: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          recurrence: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          recurrence?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          recurrence?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          answers: Json | null
          duration_seconds: number | null
          id: string
          max_score: number | null
          organization_id: string
          played_at: string | null
          quiz_id: string | null
          score: number
          student_id: string
        }
        Insert: {
          answers?: Json | null
          duration_seconds?: number | null
          id?: string
          max_score?: number | null
          organization_id: string
          played_at?: string | null
          quiz_id?: string | null
          score: number
          student_id: string
        }
        Update: {
          answers?: Json | null
          duration_seconds?: number | null
          id?: string
          max_score?: number | null
          organization_id?: string
          played_at?: string | null
          quiz_id?: string | null
          score?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_scores_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          class_id: string | null
          coefficient: number | null
          comment: string | null
          created_at: string | null
          evaluation_type: string | null
          id: string
          max_value: number
          organization_id: string
          period_id: string | null
          recorded_at: string | null
          student_id: string
          subject_id: string | null
          teacher_id: string | null
          title: string | null
          value: number
        }
        Insert: {
          class_id?: string | null
          coefficient?: number | null
          comment?: string | null
          created_at?: string | null
          evaluation_type?: string | null
          id?: string
          max_value?: number
          organization_id: string
          period_id?: string | null
          recorded_at?: string | null
          student_id: string
          subject_id?: string | null
          teacher_id?: string | null
          title?: string | null
          value: number
        }
        Update: {
          class_id?: string | null
          coefficient?: number | null
          comment?: string | null
          created_at?: string | null
          evaluation_type?: string | null
          id?: string
          max_value?: number
          organization_id?: string
          period_id?: string | null
          recorded_at?: string | null
          student_id?: string
          subject_id?: string | null
          teacher_id?: string | null
          title?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "grades_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_submissions: {
        Row: {
          content: string | null
          feedback: string | null
          file_url: string | null
          graded_at: string | null
          graded_by: string | null
          homework_id: string
          id: string
          is_late: boolean | null
          score: number | null
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          content?: string | null
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          homework_id: string
          id?: string
          is_late?: boolean | null
          score?: number | null
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          content?: string | null
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          homework_id?: string
          id?: string
          is_late?: boolean | null
          score?: number | null
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_submissions_homework_id_fkey"
            columns: ["homework_id"]
            isOneToOne: false
            referencedRelation: "homeworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      homeworks: {
        Row: {
          assigned_at: string | null
          attachments: Json | null
          class_id: string
          created_at: string | null
          description: string | null
          due_at: string
          id: string
          is_published: boolean | null
          organization_id: string
          subject_id: string | null
          teacher_id: string | null
          title: string
        }
        Insert: {
          assigned_at?: string | null
          attachments?: Json | null
          class_id: string
          created_at?: string | null
          description?: string | null
          due_at: string
          id?: string
          is_published?: boolean | null
          organization_id: string
          subject_id?: string | null
          teacher_id?: string | null
          title: string
        }
        Update: {
          assigned_at?: string | null
          attachments?: Json | null
          class_id?: string
          created_at?: string | null
          description?: string | null
          due_at?: string
          id?: string
          is_published?: boolean | null
          organization_id?: string
          subject_id?: string | null
          teacher_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "homeworks_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homeworks_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          id: string
          organization_id: string
          parent_message_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          sent_at: string | null
          subject: string | null
        }
        Insert: {
          body: string
          id?: string
          organization_id: string
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          sent_at?: string | null
          subject?: string | null
        }
        Update: {
          body?: string
          id?: string
          organization_id?: string
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          sent_at?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          author_id: string | null
          body: string | null
          cover_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_published: boolean | null
          organization_id: string
          published_at: string | null
          slug: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          organization_id: string
          published_at?: string | null
          slug?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          organization_id?: string
          published_at?: string | null
          slug?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_articles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string | null
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          id?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string | null
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string | null
          banner_url: string | null
          city: string | null
          colors: Json | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          founded_year: number | null
          id: string
          legal_name: string | null
          logo_url: string | null
          name: string
          phone: string | null
          plan: string | null
          postal_code: string | null
          region: string | null
          slug: string
          status: string | null
          tagline: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          city?: string | null
          colors?: Json | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          founded_year?: number | null
          id?: string
          legal_name?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          plan?: string | null
          postal_code?: string | null
          region?: string | null
          slug: string
          status?: string | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          city?: string | null
          colors?: Json | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          founded_year?: number | null
          id?: string
          legal_name?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          plan?: string | null
          postal_code?: string | null
          region?: string | null
          slug?: string
          status?: string | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      parent_links: {
        Row: {
          can_pickup: boolean | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          parent_profile_id: string
          relation: string
          student_id: string
        }
        Insert: {
          can_pickup?: boolean | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_profile_id: string
          relation: string
          student_id: string
        }
        Update: {
          can_pickup?: boolean | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_profile_id?: string
          relation?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_links_parent_profile_id_fkey"
            columns: ["parent_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_links_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          invoice_id: string | null
          method: string | null
          notes: string | null
          organization_id: string
          paid_at: string | null
          recorded_by: string | null
          reference: string | null
          student_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          method?: string | null
          notes?: string | null
          organization_id: string
          paid_at?: string | null
          recorded_by?: string | null
          reference?: string | null
          student_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_id?: string | null
          method?: string | null
          notes?: string | null
          organization_id?: string
          paid_at?: string | null
          recorded_by?: string | null
          reference?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "student_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          language: string | null
          last_name: string | null
          last_seen_at: string | null
          organization_id: string | null
          phone: string | null
          role: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          language?: string | null
          last_name?: string | null
          last_seen_at?: string | null
          organization_id?: string | null
          phone?: string | null
          role: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_name?: string | null
          last_seen_at?: string | null
          organization_id?: string | null
          phone?: string | null
          role?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          duration: string | null
          id: string
          is_featured: boolean | null
          level: string | null
          organization_id: string
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          level?: string | null
          organization_id: string
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          level?: string | null
          organization_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          created_at: string | null
          device_name: string | null
          last_used_at: string | null
          platform: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_name?: string | null
          last_used_at?: string | null
          platform: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_name?: string | null
          last_used_at?: string | null
          platform?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          class_id: string | null
          cover_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string | null
          estimated_minutes: number | null
          id: string
          is_published: boolean | null
          organization_id: string
          published_at: string | null
          questions: Json
          subject_id: string | null
          title: string
        }
        Insert: {
          class_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          organization_id: string
          published_at?: string | null
          questions?: Json
          subject_id?: string | null
          title: string
        }
        Update: {
          class_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          organization_id?: string
          published_at?: string | null
          questions?: Json
          subject_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_slots: {
        Row: {
          class_id: string
          created_at: string | null
          day_of_week: number
          effective_from: string | null
          effective_until: string | null
          ends_at: string
          id: string
          notes: string | null
          organization_id: string
          room: string | null
          starts_at: string
          subject_id: string | null
          teacher_id: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          day_of_week: number
          effective_from?: string | null
          effective_until?: string | null
          ends_at: string
          id?: string
          notes?: string | null
          organization_id: string
          room?: string | null
          starts_at: string
          subject_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          day_of_week?: number
          effective_from?: string | null
          effective_until?: string | null
          ends_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          room?: string | null
          starts_at?: string
          subject_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_slots_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_slots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_slots_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_slots_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      school_requests: {
        Row: {
          city: string | null
          created_at: string | null
          director_email: string
          director_full_name: string | null
          director_phone: string | null
          estimated_students: number | null
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          school_name: string
          slug_wanted: string
          status: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          director_email: string
          director_full_name?: string | null
          director_phone?: string | null
          estimated_students?: number | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          school_name: string
          slug_wanted: string
          status?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          director_email?: string
          director_full_name?: string | null
          director_phone?: string | null
          estimated_students?: number | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          school_name?: string
          slug_wanted?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_invoices: {
        Row: {
          amount_due: number
          amount_paid: number | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          fee_type_id: string | null
          id: string
          notes: string | null
          organization_id: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          fee_type_id?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          fee_type_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_invoices_fee_type_id_fkey"
            columns: ["fee_type_id"]
            isOneToOne: false
            referencedRelation: "fee_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          city: string | null
          created_at: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          enrolled_on: string | null
          first_name: string
          full_name: string | null
          gender: string | null
          id: string
          last_name: string
          medical_notes: string | null
          organization_id: string
          phone: string | null
          pin_hash: string | null
          status: string | null
          student_code: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          enrolled_on?: string | null
          first_name: string
          full_name?: string | null
          gender?: string | null
          id?: string
          last_name: string
          medical_notes?: string | null
          organization_id: string
          phone?: string | null
          pin_hash?: string | null
          status?: string | null
          student_code: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          enrolled_on?: string | null
          first_name?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string
          medical_notes?: string | null
          organization_id?: string
          phone?: string | null
          pin_hash?: string | null
          status?: string | null
          student_code?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          color: string | null
          created_at: string | null
          default_coefficient: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string | null
          default_coefficient?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string | null
          default_coefficient?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_order: number | null
          email: string | null
          full_name: string
          id: string
          is_published: boolean | null
          organization_id: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          full_name: string
          id?: string
          is_published?: boolean | null
          organization_id: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          full_name?: string
          id?: string
          is_published?: boolean | null
          organization_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vitrine_settings: {
        Row: {
          about_text: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          organization_id: string
          sections_visible: Json | null
          seo_description: string | null
          seo_image_url: string | null
          seo_title: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_youtube: string | null
          updated_at: string | null
        }
        Insert: {
          about_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          organization_id: string
          sections_visible?: Json | null
          seo_description?: string | null
          seo_image_url?: string | null
          seo_title?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_youtube?: string | null
          updated_at?: string | null
        }
        Update: {
          about_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          organization_id?: string
          sections_visible?: Json | null
          seo_description?: string | null
          seo_image_url?: string | null
          seo_title?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_youtube?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vitrine_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_organization_id: { Args: never; Returns: string }
      current_user_role: { Args: never; Returns: string }
      is_parent_of: { Args: { student_uuid: string }; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
