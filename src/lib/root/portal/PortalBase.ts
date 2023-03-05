import ObjectUtils from "../../utils/ObjectUtils";

export type PortalProps = {
  element?: JSX.Element | null;
  appendTo?: HTMLElement | string | null;
  visible?: boolean;
  onMounted?: (() => void) | null;
  onUnmounted?: (() => void) | null;
  children?: React.ReactNode;
};

export const PortalBase = {
  defaultProps: {
    __TYPE: "Portal",
    element: null,
    appendTo: null,
    visible: false,
    onMounted: null,
    onUnmounted: null,
    children: undefined,
  },
  getProps: (props: PortalProps) => ObjectUtils.getMergedProps(props, PortalBase.defaultProps),
  getOtherProps: (props: PortalProps) => ObjectUtils.getDiffProps(props, PortalBase.defaultProps),
};
