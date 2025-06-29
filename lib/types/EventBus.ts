export type EventName = 'Run';

type Handler = () => void;

export type EventBus = {
  subscribe: (event: EventName, fn: Handler) => void;
  unsubscribe: (event: EventName, fn: Handler) => void;
  emit: (event: EventName) => void;
  any: (event: EventName) => boolean;
};
