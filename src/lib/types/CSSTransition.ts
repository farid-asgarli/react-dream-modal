import React from "react";
import { CSSTransitionProps as ReactCSSTransitionProps } from "react-transition-group/CSSTransition";
export type CSSTransitionProps<Ref extends undefined | HTMLElement = undefined> = ReactCSSTransitionProps<Ref> & {
  /**
   * When present, it specifies that the component should be disabled.
   * @defaultValue false
   */
  disabled?: boolean | undefined;
};

export declare class CSSTransition<Ref extends undefined | HTMLElement> extends React.Component<
  CSSTransitionProps<Ref>,
  any
> {}
