import ObjectUtils from "../../utils/ObjectUtils";
import { CSSTransitionProps } from "../../types/CSSTransition";

export const CSSTransitionBase = {
  defaultProps: {
    __TYPE: "CSSTransition",
    children: undefined,
  },
  getProps: (props: CSSTransitionProps<HTMLDivElement>) =>
    ObjectUtils.getMergedProps(props, CSSTransitionBase.defaultProps),
  getOtherProps: (props: CSSTransitionProps<HTMLDivElement>) =>
    ObjectUtils.getDiffProps(props, CSSTransitionBase.defaultProps),
};
