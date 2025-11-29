declare module 'aos' {
  interface AOSSettings {
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    offset?: number;
    delay?: number;
    disable?: boolean | (() => boolean);
    startEvent?: string;
    throttleDelay?: number;
    debounceDelay?: number;
    disableMutationObserver?: boolean;
  }

  interface AOS {
    init(options?: AOSSettings): void;
    refresh(): void;
    refreshHard(): void;
  }

  const AOS: AOS;
  export default AOS;
}
