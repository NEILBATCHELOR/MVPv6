export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string;
          details: string | null;
          entity_id: string | null;
          entity_type: string | null;
          id: string;
          new_data: Json | null;
          old_data: Json | null;
          signature: string | null;
          status: string | null;
          timestamp: string;
          user_email: string | null;
          user_id: string | null;
          username: string | null;
          verified: boolean | null;
        };
        Insert: Record<string, any>;
        Update: {
          action?: string;
          details?: string | null;
          entity_id?: string | null;
          entity_type?: string | null;
          id?: string;
          new_data?: Json | null;
          old_data?: Json | null;
          signature?: string | null;
          status?: string | null;
          timestamp?: string;
          user_email?: string | null;
          user_id?: string | null;
          username?: string | null;
          verified?: boolean | null;
        };
      };
      auth_events: {
        Row: {
          created_at: string | null;
          event_type: string;
          id: string;
          ip_address: string | null;
          metadata: Json | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          event_type?: string;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
      };
      cap_table_investors: {
        Row: {
          cap_table_id: string | null;
          created_at: string | null;
          id: string;
          investor_id: string;
        };
        Insert: Record<string, any>;
        Update: {
          cap_table_id?: string | null;
          created_at?: string | null;
          id?: string;
          investor_id?: string;
        };
      };
      cap_tables: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          project_id: string | null;
          updated_at: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          project_id?: string | null;
          updated_at?: string | null;
        };
      };
      compliance_checks: {
        Row: {
          created_at: string;
          id: string;
          investor_id: string;
          project_id: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          risk_level: string;
          risk_reason: string;
          status: string;
          updated_at: string;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string;
          id?: string;
          investor_id?: string;
          project_id?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          risk_level?: string;
          risk_reason?: string;
          status?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          created_at: string;
          date_updated: string;
          description: string | null;
          file_path: string | null;
          file_size: number | null;
          file_type: string | null;
          file_url: string | null;
          id: string;
          name: string;
          organization_id: string;
          rejection_reason: string | null;
          required: boolean | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string;
          date_updated?: string;
          description?: string | null;
          file_path?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          file_url?: string | null;
          id?: string;
          name?: string;
          organization_id?: string;
          rejection_reason?: string | null;
          required?: boolean | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      investor_group_members: {
        Row: {
          created_at: string;
          group_id: string;
          investor_id: string;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string;
          group_id?: string;
          investor_id?: string;
        };
      };
      investor_groups: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          member_count: number;
          name: string;
          project_id: string | null;
          updated_at: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          member_count?: number;
          name?: string;
          project_id?: string | null;
          updated_at?: string | null;
        };
      };
      investor_groups_investors: {
        Row: {
          created_at: string | null;
          group_id: string;
          id: string;
          investor_id: string;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          group_id?: string;
          id?: string;
          investor_id?: string;
        };
      };
      investors: {
        Row: {
          company: string | null;
          created_at: string | null;
          email: string;
          investor_id: string;
          kyc_expiry_date: string | null;
          kyc_status: string;
          lastUpdated: string | null;
          name: string;
          notes: string | null;
          type: string;
          updated_at: string | null;
          verification_details: Json | null;
          wallet_address: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          company?: string | null;
          created_at?: string | null;
          email?: string;
          investor_id?: string;
          kyc_expiry_date?: string | null;
          kyc_status?: string;
          lastUpdated?: string | null;
          name?: string;
          notes?: string | null;
          type?: string;
          updated_at?: string | null;
          verification_details?: Json | null;
          wallet_address?: string | null;
        };
      };
      kyc_screening_logs: {
        Row: {
          created_at: string | null;
          id: string;
          investor_id: string;
          method: string;
          new_status: string | null;
          notes: string | null;
          performed_by: string | null;
          previous_status: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          id?: string;
          investor_id?: string;
          method?: string;
          new_status?: string | null;
          notes?: string | null;
          performed_by?: string | null;
          previous_status?: string | null;
        };
      };
      multi_sig_confirmations: {
        Row: {
          created_at: string | null;
          id: string;
          owner: string;
          signature: string;
          transaction_id: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          id?: string;
          owner?: string;
          signature?: string;
          transaction_id?: string | null;
        };
      };
      multi_sig_transactions: {
        Row: {
          blockchain: string;
          blockchain_specific_data: Json | null;
          confirmations: number;
          created_at: string | null;
          data: string;
          destination_wallet_address: string;
          executed: boolean;
          hash: string;
          id: string;
          nonce: number;
          token_address: string | null;
          token_symbol: string | null;
          updated_at: string | null;
          value: string;
          wallet_id: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          blockchain?: string;
          blockchain_specific_data?: Json | null;
          confirmations?: number;
          created_at?: string | null;
          data?: string;
          destination_wallet_address?: string;
          executed?: boolean;
          hash?: string;
          id?: string;
          nonce?: number;
          token_address?: string | null;
          token_symbol?: string | null;
          updated_at?: string | null;
          value?: string;
          wallet_id?: string | null;
        };
      };
      multi_sig_wallets: {
        Row: {
          address: string;
          blockchain: string;
          created_at: string | null;
          created_by: string | null;
          id: string;
          name: string;
          owners: string[];
          threshold: number;
          updated_at: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          address?: string;
          blockchain?: string;
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          name?: string;
          owners?: string[];
          threshold?: number;
          updated_at?: string | null;
        };
      };
      notifications: {
        Row: {
          action_required: boolean;
          action_url: string | null;
          created_at: string;
          date: string;
          description: string;
          id: string;
          metadata: Json | null;
          read: boolean;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: Record<string, any>;
        Update: {
          action_required?: boolean;
          action_url?: string | null;
          created_at?: string;
          date?: string;
          description?: string;
          id?: string;
          metadata?: Json | null;
          read?: boolean;
          title?: string;
          type?: string;
          user_id?: string;
        };
      };
      projects: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
      };
      redemption_approvers: {
        Row: {
          approved: boolean;
          approved_at: string | null;
          avatar_url: string | null;
          created_at: string;
          id: string;
          name: string;
          redemption_id: string;
          role: string;
        };
        Insert: Record<string, any>;
        Update: {
          approved?: boolean;
          approved_at?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          redemption_id?: string;
          role?: string;
        };
      };
      redemption_requests: {
        Row: {
          conversion_rate: number;
          created_at: string;
          destination_wallet_address: string;
          id: string;
          investor_count: number | null;
          investor_id: string | null;
          investor_name: string | null;
          is_bulk_redemption: boolean | null;
          redemption_type: string;
          rejected_by: string | null;
          rejection_reason: string | null;
          rejection_timestamp: string | null;
          required_approvals: number;
          source_wallet_address: string;
          status: string;
          token_amount: number;
          token_type: string;
          updated_at: string;
        };
        Insert: Record<string, any>;
        Update: {
          conversion_rate?: number;
          created_at?: string;
          destination_wallet_address?: string;
          id?: string;
          investor_count?: number | null;
          investor_id?: string | null;
          investor_name?: string | null;
          is_bulk_redemption?: boolean | null;
          redemption_type?: string;
          rejected_by?: string | null;
          rejection_reason?: string | null;
          rejection_timestamp?: string | null;
          required_approvals?: number;
          source_wallet_address?: string;
          status?: string;
          token_amount?: number;
          token_type?: string;
          updated_at?: string;
        };
      };
      redemption_rules: {
        Row: {
          allow_any_time_redemption: boolean | null;
          created_at: string | null;
          enable_admin_override: boolean | null;
          enable_pro_rata_distribution: boolean | null;
          id: string;
          immediate_execution: boolean | null;
          lock_tokens_on_request: boolean | null;
          lock_up_period: number | null;
          notify_investors: boolean | null;
          queue_unprocessed_requests: boolean | null;
          redemption_type: string;
          repurchase_frequency: string | null;
          require_multi_sig_approval: boolean | null;
          required_approvers: number | null;
          rule_id: string | null;
          settlement_method: string | null;
          submission_window_days: number | null;
          total_approvers: number | null;
          updated_at: string | null;
          use_latest_nav: boolean | null;
          use_window_nav: boolean | null;
        };
        Insert: Record<string, any>;
        Update: {
          allow_any_time_redemption?: boolean | null;
          created_at?: string | null;
          enable_admin_override?: boolean | null;
          enable_pro_rata_distribution?: boolean | null;
          id?: string;
          immediate_execution?: boolean | null;
          lock_tokens_on_request?: boolean | null;
          lock_up_period?: number | null;
          notify_investors?: boolean | null;
          queue_unprocessed_requests?: boolean | null;
          redemption_type?: string;
          repurchase_frequency?: string | null;
          require_multi_sig_approval?: boolean | null;
          required_approvers?: number | null;
          rule_id?: string | null;
          settlement_method?: string | null;
          submission_window_days?: number | null;
          total_approvers?: number | null;
          updated_at?: string | null;
          use_latest_nav?: boolean | null;
          use_window_nav?: boolean | null;
        };
      };
      rules: {
        Row: {
          created_at: string | null;
          created_by: string;
          rule_details: Json | null;
          rule_id: string;
          rule_name: string;
          rule_type: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          created_by?: string;
          rule_details?: Json | null;
          rule_id?: string;
          rule_name?: string;
          rule_type?: string;
          status?: string | null;
          updated_at?: string | null;
        };
      };
      stage_requirements: {
        Row: {
          completed_at: string | null;
          created_at: string;
          description: string | null;
          failure_reason: string | null;
          id: string;
          name: string;
          order: number;
          stage_id: string;
          status: string;
          updated_at: string;
        };
        Insert: Record<string, any>;
        Update: {
          completed_at?: string | null;
          created_at?: string;
          description?: string | null;
          failure_reason?: string | null;
          id?: string;
          name?: string;
          order?: number;
          stage_id?: string;
          status?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          allocated: boolean;
          confirmed: boolean;
          created_at: string | null;
          currency: string;
          distributed: boolean;
          fiat_amount: number;
          id: string;
          investor_id: string;
          notes: string | null;
          project_id: string | null;
          subscription_date: string | null;
          subscription_id: string;
          updated_at: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          allocated?: boolean;
          confirmed?: boolean;
          created_at?: string | null;
          currency?: string;
          distributed?: boolean;
          fiat_amount?: number;
          id?: string;
          investor_id?: string;
          notes?: string | null;
          project_id?: string | null;
          subscription_date?: string | null;
          subscription_id?: string;
          updated_at?: string | null;
        };
      };
      token_allocations: {
        Row: {
          allocation_date: string | null;
          created_at: string;
          distributed: boolean;
          distribution_date: string | null;
          distribution_tx_hash: string | null;
          id: string;
          investor_id: string;
          minted: boolean;
          minting_date: string | null;
          minting_tx_hash: string | null;
          notes: string | null;
          project_id: string | null;
          subscription_id: string;
          token_amount: number;
          token_type: string;
          updated_at: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          allocation_date?: string | null;
          created_at?: string;
          distributed?: boolean;
          distribution_date?: string | null;
          distribution_tx_hash?: string | null;
          id?: string;
          investor_id?: string;
          minted?: boolean;
          minting_date?: string | null;
          minting_tx_hash?: string | null;
          notes?: string | null;
          project_id?: string | null;
          subscription_id?: string;
          token_amount?: number;
          token_type?: string;
          updated_at?: string | null;
        };
      };
      token_deployments: {
        Row: {
          contract_address: string;
          deployed_at: string | null;
          deployed_by: string;
          deployment_data: Json | null;
          id: string;
          network: string;
          status: string;
          token_id: string;
          transaction_hash: string;
        };
        Insert: Record<string, any>;
        Update: {
          contract_address?: string;
          deployed_at?: string | null;
          deployed_by?: string;
          deployment_data?: Json | null;
          id?: string;
          network?: string;
          status?: string;
          token_id?: string;
          transaction_hash?: string;
        };
      };
      token_designs: {
        Row: {
          contract_address: string | null;
          created_at: string | null;
          deployment_date: string | null;
          id: string;
          name: string;
          status: string;
          total_supply: number;
          type: string;
        };
        Insert: Record<string, any>;
        Update: {
          contract_address?: string | null;
          created_at?: string | null;
          deployment_date?: string | null;
          id?: string;
          name?: string;
          status?: string;
          total_supply?: number;
          type?: string;
        };
      };
      token_versions: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          data: Json;
          id: string;
          token_id: string;
          version: number;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          data?: Json;
          id?: string;
          token_id?: string;
          version?: number;
        };
      };
      tokens: {
        Row: {
          approvals: string[] | null;
          blocks: Json;
          contract_preview: string | null;
          created_at: string | null;
          decimals: number;
          id: string;
          metadata: Json | null;
          name: string;
          project_id: string;
          reviewers: string[] | null;
          standard: string;
          status: string;
          symbol: string;
          updated_at: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          approvals?: string[] | null;
          blocks?: Json;
          contract_preview?: string | null;
          created_at?: string | null;
          decimals?: number;
          id?: string;
          metadata?: Json | null;
          name?: string;
          project_id?: string;
          reviewers?: string[] | null;
          standard?: string;
          status?: string;
          symbol?: string;
          updated_at?: string | null;
        };
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: string;
          updated_at: string;
          user_id: string;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string;
          id?: string;
          role?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      user_sessions: {
        Row: {
          created_at: string | null;
          device_info: Json | null;
          id: string;
          ip_address: string | null;
          last_active_at: string | null;
          session_id: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string | null;
          device_info?: Json | null;
          id?: string;
          ip_address?: string | null;
          last_active_at?: string | null;
          session_id?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          encrypted_private_key: string | null;
          id: string;
          name: string;
          public_key: string | null;
          role: string;
          status: string;
          updated_at: string;
        };
        Insert: Record<string, any>;
        Update: {
          created_at?: string;
          email?: string;
          encrypted_private_key?: string | null;
          id?: string;
          name?: string;
          public_key?: string | null;
          role?: string;
          status?: string;
          updated_at?: string;
        };
      };
      workflow_stages: {
        Row: {
          completion_percentage: number;
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          order: number;
          organization_id: string;
          status: string;
          updated_at: string;
        };
        Insert: Record<string, any>;
        Update: {
          completion_percentage?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          order?: number;
          organization_id?: string;
          status?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
