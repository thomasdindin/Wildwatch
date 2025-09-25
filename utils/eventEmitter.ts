/**
 * Global event emitter for cross-component communication
 * Used to synchronize observations between different tabs/screens
 */

type EventCallback = (...args: any[]) => void;

class EventEmitter {
  private events: { [key: string]: EventCallback[] } = {};

  on(eventName: string, callback: EventCallback): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);

    // Return cleanup function
    return () => {
      this.off(eventName, callback);
    };
  }

  off(eventName: string, callback: EventCallback): void {
    if (!this.events[eventName]) return;

    const index = this.events[eventName].indexOf(callback);
    if (index > -1) {
      this.events[eventName].splice(index, 1);
    }
  }

  emit(eventName: string, ...args: any[]): void {
    if (!this.events[eventName]) return;

    this.events[eventName].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event callback for ${eventName}:`, error);
      }
    });
  }

  removeAllListeners(eventName?: string): void {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
  }
}

export const globalEventEmitter = new EventEmitter();

export const OBSERVATION_EVENTS = {
  CREATED: 'observation:created',
  UPDATED: 'observation:updated',
  DELETED: 'observation:deleted',
  LIST_UPDATED: 'observation:list_updated',
} as const;