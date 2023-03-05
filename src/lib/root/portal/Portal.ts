import * as React from "react";
import ReactDOM from "react-dom";
import { useMountEffect } from "../../hooks/use-mount-effect";
import { useUnmountEffect } from "../../hooks/use-unmount-effect";
import { useUpdateEffect } from "../../hooks/use-update-effect";
import { PortalBase, PortalProps } from "./PortalBase";
import DomHandler from "../../utils/DOMHandler";

export const Portal = React.memo((inProps: PortalProps) => {
  const props: PortalProps = PortalBase.getProps(inProps);

  const [mountedState, setMountedState] = React.useState(props.visible && DomHandler.hasDOM());

  useMountEffect(() => {
    if (DomHandler.hasDOM() && !mountedState) {
      setMountedState(true);
      props.onMounted && props.onMounted();
    }
  });

  useUpdateEffect(() => {
    props.onMounted && props.onMounted();
  }, [mountedState]);

  useUnmountEffect(() => {
    props.onUnmounted && props.onUnmounted();
  });

  const element = props.element || props.children;

  if (element && mountedState) {
    const appendTo = props.appendTo || document.body;

    return (
      appendTo === "self" ? element : ReactDOM.createPortal(element as React.ReactNode, appendTo as HTMLElement)
    ) as JSX.Element;
  }

  return null;
});

Portal.displayName = "Portal";
