// ========================================================================
// In-Process Typed Event Bus for Modular Monolith Communication
// ========================================================================

type EventCallback<T = any> = (payload: T) => void | Promise<void>;

export interface AppEvents {
  "order:created": { orderId: string; orderCode: string; totalVnd: number; customerEmail: string };
  "order:paid": { orderId: string; paymentMethod: string; transactionId: string };
  "build:saved": { buildId: string; userId?: string };
  "build:quote_requested": { buildId: string; customerName: string; customerPhone: string };
  "product:stock_low": { productId: string; currentStock: number };
}

class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  on<K extends keyof AppEvents>(event: K, callback: EventCallback<AppEvents[K]>): () => void {
    const list = this.listeners.get(event) || [];
    list.push(callback);
    this.listeners.set(event, list);

    return () => {
      const current = this.listeners.get(event) || [];
      this.listeners.set(
        event,
        current.filter((cb) => cb !== callback)
      );
    };
  }

  async emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): Promise<void> {
    const list = this.listeners.get(event) || [];
    await Promise.all(
      list.map(async (callback) => {
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
