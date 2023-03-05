import * as React from "react";
import { CSSTransition as ReactCSSTransition } from "react-transition-group";
import { useUpdateEffect } from "../../hooks/use-update-effect";
import ObjectUtils from "../../utils/ObjectUtils";
import { CSSTransitionBase } from "./CSSTransitionBase";
import { CSSTransitionProps } from "../../types/CSSTransition";

export const CSSTransition = React.forwardRef<HTMLDivElement, CSSTransitionProps<HTMLDivElement>>((inProps, ref) => {
  const props = CSSTransitionBase.getProps(inProps);

  const disabled = props.disabled || (props.options && props.options.disabled);

  const onEnter = (node: HTMLElement, isAppearing: boolean) => {
    props.onEnter && props.onEnter(isAppearing); // component
    props.options && props.options.onEnter && props.options.onEnter(node, isAppearing); // user option
  };

  const onEntering = (node: HTMLElement, isAppearing: boolean) => {
    props.onEntering && props.onEntering(isAppearing); // component
    props.options && props.options.onEntering && props.options.onEntering(node, isAppearing); // user option
  };

  const onEntered = (node: HTMLElement, isAppearing: boolean) => {
    props.onEntered && props.onEntered(isAppearing); // component
    props.options && props.options.onEntered && props.options.onEntered(node, isAppearing); // user option
  };

  const onExit = (node: HTMLElement) => {
    props.onExit && props.onExit(); // component
    props.options && props.options.onExit && props.options.onExit(node); // user option
  };

  const onExiting = (node: HTMLElement) => {
    props.onExiting && props.onExiting(); // component
    props.options && props.options.onExiting && props.options.onExiting(node); // user option
  };

  const onExited = (node: HTMLElement) => {
    props.onExited && props.onExited(); // component
    props.options && props.options.onExited && props.options.onExited(node); // user option
  };

  useUpdateEffect(() => {
    if (disabled) {
      // no animation
      const node = ObjectUtils.getRefElement(props.nodeRef);

      if (props.in) {
        onEnter(node, true);
        onEntering(node, true);
        onEntered(node, true);
      } else {
        onExit(node);
        onExiting(node);
        onExited(node);
      }
    }
  }, [props.in]);

  if (disabled) {
    return (props.in ? props.children : null) as any;
  } else {
    const immutableProps = {
      nodeRef: props.nodeRef,
      in: props.in,
      onEnter: onEnter,
      onEntering: onEntering,
      onEntered: onEntered,
      onExit: onExit,
      onExiting: onExiting,
      onExited: onExited,
    };
    const mutableProps = { classNames: props.classNames, timeout: props.timeout, unmountOnExit: props.unmountOnExit };
    const mergedProps = { ...mutableProps, ...(props.options || {}), ...immutableProps };

    return <ReactCSSTransition {...mergedProps}>{props.children}</ReactCSSTransition>;
  }
});

CSSTransition.displayName = "CSSTransition";
