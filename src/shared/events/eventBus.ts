// ========================================================================
// In-Process Typed Event Bus for Modular Monolith Communication
// ========================================================================

type EventCallback<T> = (payload: T) => void | Promise<void>;

export interface AppEvents {
  "order:created": { orderId: string; orderCode: string; totalVnd: number; customerEmail: string };
  "order:paid": { orderId: string; paymentMethod: string; transactionId: string };
  "build:saved": { buildId: string; userId?: string };
  "build:quote_requested": { buildId: string; customerName: string; customerPhone: string };
  "product:stock_low": { productId: string; currentStock: number };
}

class EventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<keyof AppEvents, Set<EventCallback<any>>> = new Map();

  on<K extends keyof AppEvents>(event: K, callback: EventCallback<AppEvents[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(callback);

    return () => {
      set.delete(callback);
    };
  }

  async emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): Promise<void> {
    const set = this.listeners.get(event);
    if (!set || set.size === 0) return;

    await Promise.all(
      Array.from(set).map(async (callback) => {
        try {
          await callback(payload);
        } catch (error) {
          console.error(`[EventBus] Error executing listener for event "${String(event)}":`, error);
        }
      })
    );
  }
}

export const eventBus = new EventBus();
