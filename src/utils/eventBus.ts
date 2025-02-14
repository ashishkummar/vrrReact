class EventBus {
    private eventTarget: EventTarget;
  
    constructor() {
      this.eventTarget = new EventTarget();
    }
  
    // Emit an event
    emit(eventName: string, data?: any) {
      this.eventTarget.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
  
    // Listen for an event
    on(eventName: string, callback: (data: any) => void) {
      const listener = (event: Event) => {
        callback((event as CustomEvent).detail);
      };
      this.eventTarget.addEventListener(eventName, listener);
      return listener; // Return the listener for cleanup
    }
  
    // Remove event listener
    off(eventName: string, listener: (event: Event) => void) {
      this.eventTarget.removeEventListener(eventName, listener);
    }
  }
  
  // Create a global event bus instance
  const eventBus = new EventBus();
  export default eventBus;
  