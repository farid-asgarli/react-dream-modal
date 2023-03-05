/* eslint-disable */
import * as React from "react";
import DomHandler from "../utils/DOMHandler";
import ObjectUtils from "../utils/ObjectUtils";
import { usePrevious } from "./use-previous";
import { useUnmountEffect } from "./use-unmount-effect";

type EventOptions<EventType extends keyof HTMLElementEventMap> = {
  /**
   * The target element to listen to.
   */
  target?: "document" | "window" | React.Ref<HTMLElement>;
  /**
   * The event type to listen to.
   */
  type?: EventType;
  /**
   * The event listener.
   */
  listener?(event: EventType extends "mousemove" | "mouseup" ? React.MouseEvent<HTMLElement, MouseEvent> : Event): void;
  /**
   * The event options.
   */
  options?: EventListenerOptions;
  /**
   * Whether to listen to the event or not.
   * @defaultValue true
   */
  when?: boolean;
};

export const useEventListener = <EventType extends keyof HTMLElementEventMap>({
  target = "document",
  type,
  listener,
  options,
  when = true,
}: EventOptions<EventType>) => {
  const targetRef = React.useRef<HTMLElement | null>(null);
  const listenerRef = React.useRef<any>(null);
  const prevOptions = usePrevious(options);

  const bind = (bindOptions: EventOptions<EventType> = {}) => {
    if (ObjectUtils.isNotEmpty(bindOptions.target)) {
      unbind();
      if ((bindOptions.when || when) && bindOptions.target)
        targetRef.current = DomHandler.getTargetElement(bindOptions.target);
    }

    if (!listenerRef.current && targetRef.current && type) {
      listenerRef.current = (
        event: EventType extends "mousemove" | "mouseup" ? React.MouseEvent<HTMLElement, MouseEvent> : Event
      ) => listener && listener(event);
      targetRef.current.addEventListener(type, listenerRef.current, options);
    }
  };

  const unbind = () => {
    if (listenerRef.current && type) {
      targetRef.current?.removeEventListener(type, listenerRef.current, options);
      listenerRef.current = null;
    }
  };

  React.useEffect(() => {
    if (when) {
      targetRef.current = DomHandler.getTargetElement(target);
    } else {
      unbind();
      targetRef.current = null;
    }
  }, [target, when]);

  React.useEffect(() => {
    if (listenerRef.current && (listenerRef.current !== listener || prevOptions !== options)) {
      unbind();
      if (when) bind();
    }
  }, [listener, options]);

  useUnmountEffect(() => {
    unbind();
  });

  return [bind, unbind];
};
/* eslint-enable */
