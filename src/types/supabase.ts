export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          details: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          signature: string | null
          status: string | null
          timestamp: string
          user_email: string | null
          user_id: string | null
          username: string | null
          verified: boolean | null
        }
        Insert: {
          action: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          signature?: string | null
          status?: string | null
          timestamp?: string
          user_email?: string | null
          user_id?: string | null
          username?: string | null
          verified?: boolean | null
        }
        Update: {
          action?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          signature?: string | null
          status?: string | null
          timestamp?: string
          user_email?: string | null
          user_id?: string | null
          username?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      auth_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cap_table_investors: {
        Row: {
          cap_table_id: string | null
          created_at: string | null
          id: string
          investor_id: string
        }
        Insert: {
          cap_table_id?: string | null
          created_at?: string | null
          id?: string
          investor_id: string
        }
        Update: {
          cap_table_id?: string | null
          created_at?: string | null
          id?: string
          investor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cap_table_investors_cap_table_id_fkey"
            columns: ["cap_table_id"]
            isOneToOne: false
            referencedRelation: "cap_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cap_table_investors_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["investor_id"]
          },
        ]
      }
      cap_tables: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cap_tables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checks: {
        Row: {
          created_at: string
          id: string
          investor_id: string
          project_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          risk_level: string
          risk_reason: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          investor_id: string
          project_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level: string
          risk_reason: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          investor_id?: string
          project_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string
          risk_reason?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_checks_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["investor_id"]
          },
          {
            foreignKeyName: "compliance_checks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_settings: {
        Row: {
          created_at: string
          id: string
          investor_count: number
          jurisdictions: string[] | null
          kyc_status: string
          minimum_investment: number
          organization_id: string
          require_accreditation: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          investor_count?: number
          jurisdictions?: string[] | null
          kyc_status?: string
          minimum_investment?: number
          organization_id: string
          require_accreditation?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          investor_count?: number
          jurisdictions?: string[] | null
          kyc_status?: string
          minimum_investment?: number
          organization_id?: string
          require_accreditation?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          date_updated: string
          description: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          name: string
          organization_id: string
          rejection_reason: string | null
          required: boolean | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_updated?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          name: string
          organization_id: string
          rejection_reason?: string | null
          required?: boolean | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_updated?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          name?: string
          organization_id?: string
          rejection_reason?: string | null
          required?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investor_group_members: {
        Row: {
          created_at: string
          group_id: string
          investor_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          investor_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          investor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_group_members_group_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "investor_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_group_members_investor_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["investor_id"]
          },
        ]
      }
      investor_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          member_count: number
          name: string
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          member_count?: number
          name: string
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          member_count?: number
          name?: string
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investor_groups_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_groups_investors: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          investor_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          investor_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          investor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_groups_investors_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "investor_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_groups_investors_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["investor_id"]
          },
        ]
      }
      investors: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          investor_id: string
          kyc_expiry_date: string | null
          kyc_status: string
          lastUpdated: string | null
          name: string
          notes: string | null
          type: string
          updated_at: string | null
          verification_details: Json | null
          wallet_address: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          investor_id?: string
          kyc_expiry_date?: string | null
          kyc_status: string
          lastUpdated?: string | null
          name: string
          notes?: string | null
          type: string
          updated_at?: string | null
          verification_details?: Json | null
          wallet_address?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          investor_id?: string
          kyc_expiry_date?: string | null
          kyc_status?: string
          lastUpdated?: string | null
          name?: string
          notes?: string | null
          type?: string
          updated_at?: string | null
          verification_details?: Json | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      kyc_screening_logs: {
        Row: {
          created_at: string | null
          id: string
          investor_id: string
          method: string
          new_status: string | null
          notes: string | null
          performed_by: string | null
          previous_status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          investor_id: string
          method: string
          new_status?: string | null
          notes?: string | null
          performed_by?: string | null
          previous_status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          investor_id?: string
          method?: string
          new_status?: string | null
          notes?: string | null
          performed_by?: string | null
          previous_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_screening_logs_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["investor_id"]
          },
        ]
      }
      multi_sig_confirmations: {
        Row: {
          created_at: string | null
          id: string
          owner: string
          signature: string
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          owner: string
          signature: string
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          owner?: string
          signature?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multi_sig_confirmations_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "multi_sig_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      multi_sig_transactions: {
        Row: {
          blockchain: string
          blockchain_specific_data: Json | null
          confirmations: number
          created_at: string | null
          data: string
          destination_wallet_address: string
          executed: boolean
          hash: string
          id: string
          nonce: number
          token_address: string | null
          token_symbol: string | null
          updated_at: string | null
          value: string
          wallet_id: string | null
        }
        Insert: {
          blockchain: string
          blockchain_specific_data?: Json | null
          confirmations?: number
          created_at?: string | null
          data?: string
          destination_wallet_address: string
          executed?: boolean
          hash: string
          id?: string
          nonce: number
          token_address?: string | null
          token_symbol?: string | null
          updated_at?: string | null
          value: string
          wallet_id?: string | null
        }
        Update: {
          blockchain?: string
          blockchain_specific_data?: Json | null
          confirmations?: number
          created_at?: string | null
          data?: string
          destination_wallet_address?: string
          executed?: boolean
          hash?: string
          id?: string
          nonce?: number
          token_address?: string | null
          token_symbol?: string | null
          updated_at?: string | null
          value?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multi_sig_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "multi_sig_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      multi_sig_wallets: {
        Row: {
          address: string
          blockchain: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          owners: string[]
          threshold: number
          updated_at: string | null
        }
        Insert: {
          address: string
          blockchain: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          owners: string[]
          threshold: number
          updated_at?: string | null
        }
        Update: {
          address?: string
          blockchain?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          owners?: string[]
          threshold?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_required: boolean
          action_url: string | null
          created_at: string
          date: string
          description: string
          id: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_required?: boolean
          action_url?: string | null
          created_at?: string
          date?: string
          description: string
          id?: string
          metadata?: Json | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_required?: boolean
          action_url?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      redemption_approvers: {
        Row: {
          approved: boolean
          approved_at: string | null
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          redemption_id: string
          role: string
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          redemption_id: string
          role: string
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          redemption_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemption_approvers_redemption_id_fkey"
            columns: ["redemption_id"]
            isOneToOne: false
            referencedRelation: "redemption_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      redemption_requests: {
        Row: {
          conversion_rate: number
          created_at: string
          destination_wallet_address: string
          id: string
          investor_count: number | null
          investor_id: string | null
          investor_name: string | null
          is_bulk_redemption: boolean | null
          redemption_type: string
          rejected_by: string | null
          rejection_reason: string | null
          rejection_timestamp: string | null
          required_approvals: number
          source_wallet_address: string
          status: string
          token_amount: number
          token_type: string
          updated_at: string
        }
        Insert: {
          conversion_rate: number
          created_at?: string
          destination_wallet_address: string
          id?: string
          investor_count?: number | null
          investor_id?: string | null
          investor_name?: string | null
          is_bulk_redemption?: boolean | null
          redemption_type: string
          rejected_by?: string | null
          rejection_reason?: string | null
          rejection_timestamp?: string | null
          required_approvals?: number
          source_wallet_address: string
          status: string
          token_amount: number
          token_type: string
          updated_at?: string
        }
        Update: {
          conversion_rate?: number
          created_at?: string
          destination_wallet_address?: string
          id?: string
          investor_count?: number | null
          investor_id?: string | null
          investor_name?: string | null
          is_bulk_redemption?: boolean | null
          redemption_type?: string
          rejected_by?: string | null
          rejection_reason?: string | null
          rejection_timestamp?: string | null
          required_approvals?: number
          source_wallet_address?: string
          status?: string
          token_amount?: number
          token_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      redemption_rules: {
        Row: {
          allow_any_time_redemption: boolean | null
          created_at: string | null
          enable_admin_override: boolean | null
          enable_pro_rata_distribution: boolean | null
          id: string
          immediate_execution: boolean | null
          lock_tokens_on_request: boolean | null
          lock_up_period: number | null
          notify_investors: boolean | null
          queue_unprocessed_requests: boolean | null
          redemption_type: string
          repurchase_frequency: string | null
          require_multi_sig_approval: boolean | null
          required_approvers: number | null
          rule_id: string | null
          settlement_method: string | null
          submission_window_days: number | null
          total_approvers: number | null
          updated_at: string | null
          use_latest_nav: boolean | null
          use_window_nav: boolean | null
        }
        Insert: {
          allow_any_time_redemption?: boolean | null
          created_at?: string | null
          enable_admin_override?: boolean | null
          enable_pro_rata_distribution?: boolean | null
          id?: string
          immediate_execution?: boolean | null
          lock_tokens_on_request?: boolean | null
          lock_up_period?: number | null
          notify_investors?: boolean | null
          queue_unprocessed_requests?: boolean | null
          redemption_type: string
          repurchase_frequency?: string | null
          require_multi_sig_approval?: boolean | null
          required_approvers?: number | null
          rule_id?: string | null
          settlement_method?: string | null
          submission_window_days?: number | null
          total_approvers?: number | null
          updated_at?: string | null
          use_latest_nav?: boolean | null
          use_window_nav?: boolean | null
        }
        Update: {
          allow_any_time_redemption?: boolean | null
          created_at?: string | null
          enable_admin_override?: boolean | null
          enable_pro_rata_distribution?: boolean | null
          id?: string
          immediate_execution?: boolean | null
          lock_tokens_on_request?: boolean | null
          lock_up_period?: number | null
          notify_investors?: boolean | null
          queue_unprocessed_requests?: boolean | null
          redemption_type?: string
          repurchase_frequency?: string | null
          require_multi_sig_approval?: boolean | null
          required_approvers?: number | null
          rule_id?: string | null
          settlement_method?: string | null
          submission_window_days?: number | null
          total_approvers?: number | null
          updated_at?: string | null
          use_latest_nav?: boolean | null
          use_window_nav?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "redemption_rules_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rules"
            referencedColumns: ["rule_id"]
          },
        ]
      }
      rules: {
        Row: {
          created_at: string | null
          created_by: string
          rule_details: Json | null
          rule_id: string
          rule_name: string
          rule_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          rule_details?: Json | null
          rule_id?: string
          rule_name: string
          rule_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          rule_details?: Json | null
          rule_id?: string
          rule_name?: string
          rule_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      stage_requirements: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          failure_reason: string | null
          id: string
          name: string
          order: number
          stage_id: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          failure_reason?: string | null
          id?: string
          name: string
          order: number
          stage_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          failure_reason?: string | null
          id?: string
          name?: string
          order?: number
          stage_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stage_requirements_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          allocated: boolean
          confirmed: boolean
          created_at: string | null
          currency: string
          distributed: boolean
          fiat_amount: number
          id: string
          investor_id: string
          notes: string | null
          project_id: string | null
          subscription_date: string | null
          subscription_id: string
          updated_at: string | null
        }
        Insert: {
          allocated?: boolean
          confirmed?: boolean
          created_at?: string | null
          currency: string
          distributed?: boolean
          fiat_amount: number
          id?: string
          investor_id: string
          notes?: string | null
          project_id?: string | null
          subscription_date?: string | null
          subscription_id: string
          updated_at?: string | null
        }
        Update: {
          allocated?: boolean
          confirmed?: boolean
          created_at?: string | null
          currency?: string
          distributed?: boolean
          fiat_amount?: number
          id?: string
          investor_id?: string
          notes?: string | null
          project_id?: string | null
          subscription_date?: string | null
          subscription_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["investor_id"]
          },
          {
            foreignKeyName: "subscriptions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      token_allocations: {
        Row: {
          allocation_date: string | null
          created_at: string
          distributed: boolean
          distribution_date: string | null
          distribution_tx_hash: string | null
          id: string
          investor_id: string
          minted: boolean
          minting_date: string | null
          minting_tx_hash: string | null
          notes: string | null
          project_id: string | null
          subscription_id: string
          token_amount: number
          token_type: string
          updated_at: string | null
        }
        Insert: {
          allocation_date?: string | null
          created_at?: string
          distributed?: boolean
          distribution_date?: string | null
          distribution_tx_hash?: string | null
          id?: string
          investor_id: string
          minted?: boolean
          minting_date?: string | null
          minting_tx_hash?: string | null
          notes?: string | null
          project_id?: string | null
          subscription_id: string
          token_amount: number
          token_type: string
          updated_at?: string | null
        }
        Update: {
          allocation_date?: string | null
          created_at?: string
          distributed?: boolean
          distribution_date?: string | null
          distribution_tx_hash?: string | null
          id?: string
          investor_id?: string
          minted?: boolean
          minting_date?: string | null
          minting_tx_hash?: string | null
          notes?: string | null
          project_id?: string | null
          subscription_id?: string
          token_amount?: number
          token_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_allocations_investor_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["investor_id"]
          },
          {
            foreignKeyName: "token_allocations_project_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_allocations_subscription_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      token_comments: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          token_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          token_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          token_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_comments_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      token_deployments: {
        Row: {
          contract_address: string
          deployed_at: string | null
          deployed_by: string
          deployment_data: Json | null
          id: string
          network: string
          status: string
          token_id: string
          transaction_hash: string
        }
        Insert: {
          contract_address: string
          deployed_at?: string | null
          deployed_by: string
          deployment_data?: Json | null
          id?: string
          network: string
          status?: string
          token_id: string
          transaction_hash: string
        }
        Update: {
          contract_address?: string
          deployed_at?: string | null
          deployed_by?: string
          deployment_data?: Json | null
          id?: string
          network?: string
          status?: string
          token_id?: string
          transaction_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_deployments_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      token_designs: {
        Row: {
          contract_address: string | null
          created_at: string | null
          deployment_date: string | null
          id: string
          name: string
          status: string
          total_supply: number
          type: string
        }
        Insert: {
          contract_address?: string | null
          created_at?: string | null
          deployment_date?: string | null
          id?: string
          name: string
          status?: string
          total_supply: number
          type: string
        }
        Update: {
          contract_address?: string | null
          created_at?: string | null
          deployment_date?: string | null
          id?: string
          name?: string
          status?: string
          total_supply?: number
          type?: string
        }
        Relationships: []
      }
      token_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          data: Json
          id: string
          token_id: string
          version: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data: Json
          id?: string
          token_id: string
          version: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data?: Json
          id?: string
          token_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "token_versions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          approvals: string[] | null
          blocks: Json
          contract_preview: string | null
          created_at: string | null
          decimals: number
          id: string
          metadata: Json | null
          name: string
          project_id: string
          reviewers: string[] | null
          standard: string
          status: string
          symbol: string
          updated_at: string | null
        }
        Insert: {
          approvals?: string[] | null
          blocks: Json
          contract_preview?: string | null
          created_at?: string | null
          decimals?: number
          id?: string
          metadata?: Json | null
          name: string
          project_id: string
          reviewers?: string[] | null
          standard: string
          status?: string
          symbol: string
          updated_at?: string | null
        }
        Update: {
          approvals?: string[] | null
          blocks?: Json
          contract_preview?: string | null
          created_at?: string | null
          decimals?: number
          id?: string
          metadata?: Json | null
          name?: string
          project_id?: string
          reviewers?: string[] | null
          standard?: string
          status?: string
          symbol?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tokens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_events: {
        Row: {
          actor: string | null
          actor_role: string | null
          created_at: string
          data: Json
          event_type: string
          id: string
          request_id: string
          timestamp: string
        }
        Insert: {
          actor?: string | null
          actor_role?: string | null
          created_at?: string
          data: Json
          event_type: string
          id?: string
          request_id: string
          timestamp?: string
        }
        Update: {
          actor?: string | null
          actor_role?: string | null
          created_at?: string
          data?: Json
          event_type?: string
          id?: string
          request_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          ip_address: string | null
          last_active_at: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          last_active_at?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          last_active_at?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          encrypted_private_key: string | null
          id: string
          name: string
          public_key: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          encrypted_private_key?: string | null
          id?: string
          name: string
          public_key?: string | null
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          encrypted_private_key?: string | null
          id?: string
          name?: string
          public_key?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      wallet_signatories: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string
          status: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          role: string
          status?: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          status?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          activated_at: string | null
          address: string
          block_reason: string | null
          blocked_at: string | null
          created_at: string
          id: string
          label: string
          organization_id: string
          status: string
          updated_at: string
          wallet_type: string
        }
        Insert: {
          activated_at?: string | null
          address: string
          block_reason?: string | null
          blocked_at?: string | null
          created_at?: string
          id?: string
          label: string
          organization_id: string
          status?: string
          updated_at?: string
          wallet_type: string
        }
        Update: {
          activated_at?: string | null
          address?: string
          block_reason?: string | null
          blocked_at?: string | null
          created_at?: string
          id?: string
          label?: string
          organization_id?: string
          status?: string
          updated_at?: string
          wallet_type?: string
        }
        Relationships: []
      }
      whitelist_entries: {
        Row: {
          active: boolean
          added_at: string
          added_by: string | null
          address: string
          id: string
          label: string | null
          organization_id: string
          removed_at: string | null
        }
        Insert: {
          active?: boolean
          added_at?: string
          added_by?: string | null
          address: string
          id?: string
          label?: string | null
          organization_id: string
          removed_at?: string | null
        }
        Update: {
          active?: boolean
          added_at?: string
          added_by?: string | null
          address?: string
          id?: string
          label?: string | null
          organization_id?: string
          removed_at?: string | null
        }
        Relationships: []
      }
      whitelist_settings: {
        Row: {
          address_labels: Json | null
          addresses: string[] | null
          created_at: string
          enabled: boolean
          id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          address_labels?: Json | null
          addresses?: string[] | null
          created_at?: string
          enabled?: boolean
          id?: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          address_labels?: Json | null
          addresses?: string[] | null
          created_at?: string
          enabled?: boolean
          id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      workflow_stages: {
        Row: {
          completion_percentage: number
          created_at: string
          description: string | null
          id: string
          name: string
          order: number
          organization_id: string
          status: string
          updated_at: string
        }
        Insert: {
          completion_percentage?: number
          created_at?: string
          description?: string | null
          id: string
          name: string
          order: number
          organization_id: string
          status: string
          updated_at?: string
        }
        Update: {
          completion_percentage?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order?: number
          organization_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_table_to_realtime: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      create_transaction_events_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_blockchain_address: {
        Args: {
          blockchain: string
          address: string
        }
        Returns: boolean
      }
    }
    Enums: {
      kyc_status: "approved" | "pending" | "failed" | "not_started" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
