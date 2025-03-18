import { supabase } from "@/lib/supabase";
import { RedemptionRequest } from "@/api/approvalApi";

type SubscriptionCallback = (payload: any) => void;

interface SubscriptionOptions {
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  schema?: string;
  table: string;
  filter?: string;
}

class RealtimeService {
  private subscriptions: { [key: string]: { unsubscribe: () => void } } = {};

  /**
   * Subscribe to real-time changes on a table
   * @param options Subscription options
   * @param callback Function to call when changes occur
   * @returns Subscription ID
   */
  subscribe(
    options: SubscriptionOptions,
    callback: SubscriptionCallback,
  ): string {
    const { event = "*", schema = "public", table, filter } = options;
    const subscriptionId = `${schema}:${table}:${event}:${filter || "all"}`;

    // If we already have this subscription, return its ID
    if (this.subscriptions[subscriptionId]) {
      return subscriptionId;
    }

    // Create the subscription
    const subscription = supabase
      .channel(subscriptionId)
      .on("postgres_changes", { event, schema, table, filter }, (payload) => {
        callback(payload);
      })
      .subscribe();

    // Store the subscription
    this.subscriptions[subscriptionId] = {
      unsubscribe: () => {
        subscription.unsubscribe();
        delete this.subscriptions[subscriptionId];
      },
    };

    return subscriptionId;
  }

  /**
   * Unsubscribe from a subscription
   * @param subscriptionId The ID of the subscription to unsubscribe from
   */
  unsubscribe(subscriptionId: string): void {
    if (this.subscriptions[subscriptionId]) {
      this.subscriptions[subscriptionId].unsubscribe();
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll(): void {
    Object.keys(this.subscriptions).forEach((id) => {
      this.subscriptions[id].unsubscribe();
    });
  }

  /**
   * Subscribe to redemption request status changes
   * @param requestId The ID of the redemption request to subscribe to
   * @param callback Function to call when the status changes
   * @returns Subscription ID
   */
  subscribeToRedemptionStatus(
    requestId: string,
    callback: (status: string) => void,
  ): string {
    return this.subscribe(
      {
        table: "redemption_requests",
        event: "UPDATE",
        filter: `id=eq.${requestId}`,
      },
      (payload) => {
        if (payload.new && payload.new.status !== payload.old.status) {
          callback(payload.new.status);
        }
      },
    );
  }

  /**
   * Subscribe to all redemption requests for an investor
   * @param investorId The ID of the investor
   * @param callback Function to call when changes occur
   * @returns Subscription ID
   */
  subscribeToInvestorRedemptions(
    investorId: string,
    callback: (redemptions: RedemptionRequest[]) => void,
  ): string {
    return this.subscribe(
      {
        table: "redemption_requests",
        filter: `investor_id=eq.${investorId}`,
      },
      (payload) => {
        // In a real implementation, we would fetch the updated list of redemptions
        // Here we're just passing the changed item
        callback([payload.new as RedemptionRequest]);
      },
    );
  }

  /**
   * Subscribe to approval changes for a redemption request
   * @param requestId The ID of the redemption request
   * @param callback Function to call when approvals change
   * @returns Subscription ID
   */
  subscribeToApprovals(
    requestId: string,
    callback: (approvers: any[]) => void,
  ): string {
    return this.subscribe(
      {
        table: "redemption_approvals",
        filter: `redemption_id=eq.${requestId}`,
      },
      (payload) => {
        // In a real implementation, we would fetch all approvers
        callback([payload.new]);
      },
    );
  }
}

// Create a singleton instance
const realtimeService = new RealtimeService();
export default realtimeService;
