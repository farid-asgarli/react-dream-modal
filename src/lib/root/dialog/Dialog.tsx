import * as React from "react";
import { useEventListener } from "../../hooks/use-event-listener";
import { Portal } from "../portal/Portal";
import DomHandler from "../../utils/DOMHandler";
import { DialogBase } from "./DialogBase";
import { CSSTransition } from "../transition/CSSTransition";
import { classNames } from "../../utils/ClassNames";
import ObjectUtils from "../../utils/ObjectUtils";
import { useUpdateEffect } from "../../hooks/use-update-effect";
import { useUnmountEffect } from "../../hooks/use-unmount-effect";
import { ZIndexUtils } from "../../utils/ZIndexUtils";
import { useMountEffect } from "../../hooks/use-mount-effect";
import Button from "../../components/Button/Button";
import { DialogProps } from "../../types/Dialog";
import "../../styles/Dialog.scss";

declare global {
  interface Document {
    dialogParams: Array<{
      id: string;
      hasBlockScroll: boolean | undefined;
    }>;
  }
}

export function Dialog(inProps: DialogProps) {
  const props = DialogBase.getProps(inProps);

  const idState = props.id;
  const [maskVisibleState, setMaskVisibleState] = React.useState(false);
  const [visibleState, setVisibleState] = React.useState(false);
  const [maximizedState, setMaximizedState] = React.useState(props.maximized);
  const [minimizedState, setMinimizedState] = React.useState(props.minimized);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const maskRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const dragging = React.useRef(false);
  const resizing = React.useRef(false);
  const lastPageX = React.useRef<number | null>(null);
  const lastPageY = React.useRef<number | null>(null);
  const styleElement = React.useRef<HTMLDivElement | null>(null);
  const attributeSelector = React.useRef(idState);
  const maximized = props.onMaximize ? props.maximized : maximizedState;
  const minimized = props.onMinimize ? props.minimized : minimizedState;

  const [bindDocumentKeyDownListener, unbindDocumentKeyDownListener] = useEventListener({
    type: "keydown",
    listener: (event) => onKeyDown(event),
  });
  const [bindDocumentResizeListener, unbindDocumentResizeListener] = useEventListener({
    type: "mousemove",
    target: () => window.document,
    listener: (event) => onResize(event),
  });
  const [bindDocumentResizeEndListener, unbindDocumentResizeEndListener] = useEventListener({
    type: "mouseup",
    target: () => window.document,
    listener: (event) => onResizeEnd(event),
  });
  const [bindDocumentDragListener, unbindDocumentDragListener] = useEventListener({
    type: "mousemove",
    target: () => window.document,
    listener: (event) => onDrag(event),
  });
  const [bindDocumentDragEndListener, unbindDocumentDragEndListener] = useEventListener({
    type: "mouseup",
    target: () => window.document,
    listener: (event) => onDragEnd(event),
  });

  const onClose = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.onHide();
    event.preventDefault();
  };

  const focus = () => {
    let activeElement = document.activeElement;
    let isActiveElementInDialog = activeElement && dialogRef.current && dialogRef.current.contains(activeElement);

    if (!isActiveElementInDialog && props.closable && props.showHeader) closeRef.current?.focus();
  };

  const onMaskClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.dismissibleMask && !props.hideMask && maskRef.current === event.target) onClose(event);
    props.onMaskClick && props.onMaskClick(event);
  };

  const toggleMaximize = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.onMaximize)
      props.onMaximize({
        originalEvent: event,
        maximized: !maximized,
      });
    if (minimized) toggleMinimize(event);

    setMaximizedState((prevMaximized) => !prevMaximized);
    event.preventDefault();
  };

  const toggleMinimize = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.onMinimize)
      props.onMinimize({
        originalEvent: event,
        minimized: !minimized,
      });
    if (maximized) toggleMaximize(event);

    const isMinimized = !minimized;
    if (!isMinimized) resetPosition();

    setMinimizedState((prevMinimized) => !prevMinimized);

    event.preventDefault();
  };

  const onKeyDown = (event: any) => {
    const currentTarget = event.currentTarget;

    if (!currentTarget || !currentTarget.dialogParams) return;

    const params = currentTarget.dialogParams;
    const paramLength = params.length;
    const dialogId = params[paramLength - 1] ? params[paramLength - 1].id : undefined;

    if (dialogId !== idState) return;

    const dialog = document.getElementById(dialogId);

    if (props.closable && props.closeOnEscape && event.key === "Escape") {
      onClose(event);
      event.stopImmediatePropagation();
      params.splice(paramLength - 1, 1);
    } else if (event.key === "Tab") {
      event.preventDefault();
      const focusableElements = DomHandler.getFocusableElements(dialog);

      if (focusableElements && focusableElements.length > 0) {
        if (!document.activeElement) {
          focusableElements[0].focus();
        } else {
          const focusedIndex = focusableElements.indexOf(document.activeElement);

          if (event.shiftKey) {
            if (focusedIndex === -1 || focusedIndex === 0) focusableElements[focusableElements.length - 1].focus();
            else focusableElements[focusedIndex - 1].focus();
          } else {
            if (focusedIndex === -1 || focusedIndex === focusableElements.length - 1) focusableElements[0].focus();
            else focusableElements[focusedIndex + 1].focus();
          }
        }
      }
    }
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (
      DomHandler.hasClass(event.target as HTMLElement, "dialog-header-button") ||
      DomHandler.hasClass((event.target as HTMLElement).parentElement, "dialog-header-button")
    )
      return;

    if (props.draggable) {
      dragging.current = true;
      lastPageX.current = event.pageX;
      lastPageY.current = event.pageY;
      dialogRef.current!.style.margin = "0";
      DomHandler.addClass(document.body, "dialog-unselectable-text");

      props.onDragStart && props.onDragStart(event);
    }
  };

  const onDrag = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (dragging.current && dialogRef.current) {
      const width = DomHandler.getOuterWidth(dialogRef.current);
      const height = DomHandler.getOuterHeight(dialogRef.current);
      const deltaX = event.pageX - lastPageX.current!;
      const deltaY = event.pageY - lastPageY.current!;
      const offset = dialogRef.current!.getBoundingClientRect();
      const leftPos = offset.left + deltaX;
      const topPos = offset.top + deltaY;
      const viewport = DomHandler.getViewport();

      dialogRef.current.style.position = "fixed";

      if (props.keepInViewport) {
        if (leftPos >= (props.minX ?? 0) && leftPos + width < viewport.width) {
          lastPageX.current = event.pageX;
          dialogRef.current.style.left = leftPos + "px";
        }

        if (topPos >= (props.minY ?? 0) && topPos + height < viewport.height) {
          lastPageY.current = event.pageY;
          dialogRef.current.style.top = topPos + "px";
        }
      } else {
        lastPageX.current = event.pageX;
        dialogRef.current.style.left = leftPos + "px";
        lastPageY.current = event.pageY;
        dialogRef.current.style.top = topPos + "px";
      }

      props.onDrag && props.onDrag(event);
    }
  };

  const onDragEnd = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (dragging.current) {
      dragging.current = false;
      DomHandler.removeClass(document.body, "dialog-unselectable-text");

      props.onDragEnd && props.onDragEnd(event);
    }
  };

  const onResizeStart = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.resizable) {
      resizing.current = true;
      lastPageX.current = event.pageX;
      lastPageY.current = event.pageY;
      DomHandler.addClass(document.body, "dialog-unselectable-text");

      props.onResizeStart && props.onResizeStart(event);
    }
  };

  const convertToPx = (value: string, property: keyof typeof viewport, viewport: { width: number; height: number }) => {
    !viewport && (viewport = DomHandler.getViewport());

    const val = parseInt(value);

    if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(value)) {
      return val * (viewport[property] / 100);
    }

    return val;
  };

  const onResize = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (resizing.current && dialogRef.current) {
      const deltaX = event.pageX - lastPageX.current!;
      const deltaY = event.pageY - lastPageY.current!;
      const width = DomHandler.getOuterWidth(dialogRef.current);
      const height = DomHandler.getOuterHeight(dialogRef.current);
      const offset = dialogRef.current!.getBoundingClientRect();
      const viewport = DomHandler.getViewport();

      const hasBeenDragged = !parseInt(dialogRef.current.style.top) || !parseInt(dialogRef.current.style.left);
      const minWidth = convertToPx(dialogRef.current.style.minWidth, "width", viewport);
      const minHeight = convertToPx(dialogRef.current.style.minHeight, "height", viewport);
      let newWidth = width + deltaX;
      let newHeight = height + deltaY;

      if (hasBeenDragged) {
        newWidth += deltaX;
        newHeight += deltaY;
      }

      if ((!minWidth || newWidth > minWidth) && offset.left + newWidth < viewport.width) {
        dialogRef.current.style.width = newWidth + "px";
      }

      if ((!minHeight || newHeight > minHeight) && offset.top + newHeight < viewport.height) {
        dialogRef.current.style.height = newHeight + "px";
      }

      lastPageX.current = event.pageX;
      lastPageY.current = event.pageY;

      props.onResize && props.onResize(event);
    }
  };

  const onResizeEnd = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (resizing.current) {
      resizing.current = false;
      DomHandler.removeClass(document.body, "dialog-unselectable-text");

      props.onResizeEnd && props.onResizeEnd(event);
    }
  };

  const resetPosition = () => {
    dialogRef.current!.style.position = "";
    dialogRef.current!.style.left = "";
    dialogRef.current!.style.top = "";
    dialogRef.current!.style.margin = "";
  };

  const getPositionClass = () => {
    const positions = [
      "center",
      "left",
      "right",
      "top",
      "top-left",
      "top-right",
      "bottom",
      "bottom-left",
      "bottom-right",
    ];
    const pos = positions.find((item) => item === props.position || item.replace("-", "") === props.position);

    return pos ? `dialog-${pos}` : "";
  };

  const onEnter = () => {
    dialogRef.current!.setAttribute(attributeSelector.current, "");
  };

  const onEntered = () => {
    props.onShow && props.onShow();

    if (props.focusOnShow) {
      focus();
    }

    enableDocumentSettings();
  };

  const onExiting = () => {
    if (!props.hideMask) {
      DomHandler.addClass(maskRef.current, "dialog-overlay-leave");
    }

    if (props.blockScroll) {
      DomHandler.removeClass(document.body, "dialog-overflow-hidden");
    }
  };

  const onExited = () => {
    dragging.current = false;
    ZIndexUtils.clear(maskRef.current);
    setMaskVisibleState(false);
    disableDocumentSettings();
  };

  const enableDocumentSettings = () => {
    bindGlobalListeners();

    if (props.blockScroll || (props.maximizable && maximized)) {
      DomHandler.addClass(document.body, "dialog-overflow-hidden");
    }
  };

  const disableDocumentSettings = () => {
    unbindGlobalListeners();

    const isMaximized = props.maximizable && maximized;

    if (!props.hideMask) {
      const hasBlockScroll = document.dialogParams && document.dialogParams.some((param) => param.hasBlockScroll);

      if (hasBlockScroll || isMaximized) {
        DomHandler.removeClass(document.body, "dialog-overflow-hidden");
      }
    } else if (props.blockScroll || isMaximized) {
      DomHandler.removeClass(document.body, "dialog-overflow-hidden");
    }
  };

  const bindGlobalListeners = () => {
    if (props.draggable) {
      bindDocumentDragListener();
      bindDocumentDragEndListener();
    }

    if (props.resizable) {
      bindDocumentResizeListener();
      bindDocumentResizeEndListener();
    }

    bindDocumentKeyDownListener();
    const newParam = { id: idState, hasBlockScroll: props.blockScroll };

    document.dialogParams = document.dialogParams ? [...document.dialogParams, newParam] : [newParam];
  };

  const unbindGlobalListeners = () => {
    unbindDocumentDragListener();
    unbindDocumentDragEndListener();
    unbindDocumentResizeListener();
    unbindDocumentResizeEndListener();
    unbindDocumentKeyDownListener();

    document.dialogParams = document.dialogParams && document.dialogParams.filter((param) => param.id !== idState);
  };

  const updateScrollOnMaximizable = () => {
    if (!props.blockScroll) {
      let funcName: keyof typeof DomHandler = maximized ? "addClass" : "removeClass";

      DomHandler[funcName](document.body, "dialog-overflow-hidden");
    }
  };

  useMountEffect(() => {
    if (props.visible) {
      setMaskVisibleState(true);
    }
  });

  useUpdateEffect(() => {
    if (props.visible && !maskVisibleState) {
      setMaskVisibleState(true);
    }

    if (props.visible !== visibleState && maskVisibleState) {
      setVisibleState(props.visible as boolean);
    }
  });

  useUpdateEffect(() => {
    if (maskVisibleState) {
      ZIndexUtils.set("modal", maskRef.current, false, props.baseZIndex || 10000);
      setVisibleState(true);
    }
  }, [maskVisibleState]);

  useUpdateEffect(() => {
    updateScrollOnMaximizable();
  }, [props.maximized, maximizedState]);

  useUnmountEffect(() => {
    disableDocumentSettings();
    DomHandler.removeInlineStyle(styleElement.current);
    ZIndexUtils.clear(maskRef.current);
  });

  const createCloseIcon = () => {
    if (props.closable) {
      const ariaLabel = "close";

      return (
        <Button ref={closeRef} className="dialog-header-close" aria-label={ariaLabel} onClick={onClose} icon="Close" />
      );
    }

    return null;
  };

  const createMaximizeIcon = () => {
    if (props.maximizable) {
      return (
        <Button
          icon={maximized ? "UndoMaximize" : "Maximize"}
          className="dialog-header-maximize"
          onClick={toggleMaximize}
        />
      );
    }

    return null;
  };

  const createMinimizeIcon = () => {
    if (props.minimizable) {
      return (
        <Button
          icon={minimized ? "UndoMinimize" : "Minimize"}
          className="dialog-header-minimize"
          onClick={toggleMinimize}
        />
      );
    }

    return null;
  };

  const createHeader = () => {
    if (props.showHeader) {
      const closeIcon = createCloseIcon();
      const minimizeIcon = createMinimizeIcon();
      const maximizeIcon = createMaximizeIcon();
      const icons = ObjectUtils.getJSXElement(props.icons, props);
      const header = ObjectUtils.getJSXElement(props.header, props);
      const headerId = idState + "_header";
      const headerClassName = classNames("dialog-header", props.headerClassName);

      return (
        <div ref={headerRef} style={props.headerStyle} className={headerClassName} onMouseDown={onDragStart}>
          <div id={headerId} className="dialog-title">
            {header}
          </div>
          <div className="dialog-header-buttons">
            {icons}
            {minimizeIcon}
            {maximizeIcon}
            {closeIcon}
          </div>
        </div>
      );
    }

    return null;
  };

  const createContent = () => {
    const className = classNames("dialog-content", props.contentClassName);
    const contentId = idState + "_content";

    return (
      <div id={contentId} ref={contentRef} className={className} style={props.contentStyle}>
        {props.children}
      </div>
    );
  };

  const createFooter = () => {
    const footer = ObjectUtils.getJSXElement(props.footer, props);
    if (footer)
      return (
        <div ref={footerRef} className="dialog-footer">
          {footer}
        </div>
      );
    else {
      const buttonElements: JSX.Element[] = [];
      if (props.okButtonElement)
        buttonElements.push(React.cloneElement(props.okButtonElement, { ...props.okButtonProps, key: "dialog_ok" }));
      if (props.cancelButtonElement)
        buttonElements.push(
          React.cloneElement(props.cancelButtonElement, { ...props.cancelButtonProps, key: "dialog_cancel" })
        );
      if (!buttonElements.length) return null;
      return <div className="dialog-footer">{buttonElements}</div>;
    }
  };

  const createResizer = () => {
    if (props.resizable && !minimized) {
      return <span className="dialog-resizable-handle" style={{ zIndex: 90 }} onMouseDown={onResizeStart}></span>;
    }

    return null;
  };

  const createElement = () => {
    const otherProps = DialogBase.getOtherProps(props);
    const className = classNames("dialog", props.className, {
      "dialog-rtl": props.rtl,
      "dialog-maximized": maximized,
      "dialog-minimized": minimized,
      "dialog-default": !maximized && !minimized,
    });
    const maskClassName = classNames(
      "dialog-mask",
      getPositionClass(),
      {
        "dialog-overlay dialog-overlay-enter": !props.hideMask,
        "dialog-visible": maskVisibleState,
        "dialog-draggable": props.draggable,
        "dialog-resizable": props.resizable,
        "dialog-mask-minimized": minimized,
      },
      props.maskClassName
    );
    const header = createHeader();
    const content = createContent();
    const footer = createFooter();
    const resizer = createResizer();

    const headerId = idState + "_header";
    const contentId = idState + "_content";
    const transitionTimeout = {
      enter: props.position === "center" ? 150 : 300,
      exit: props.position === "center" ? 150 : 300,
    };

    return (
      <div ref={maskRef} style={props.maskStyle} className={maskClassName} onClick={onMaskClick}>
        <CSSTransition
          nodeRef={dialogRef}
          classNames="dialog"
          timeout={transitionTimeout}
          in={visibleState}
          options={props.transitionOptions}
          unmountOnExit
          onEnter={onEnter}
          onEntered={onEntered}
          onExiting={onExiting}
          onExited={onExited}
        >
          <div
            ref={dialogRef}
            id={idState}
            className={className}
            style={props.style}
            onClick={props.onClick}
            role="dialog"
            {...otherProps}
            aria-labelledby={headerId}
            aria-describedby={contentId}
            aria-modal={!props.hideMask}
          >
            {header}
            {content}
            {footer}
            {resizer}
          </div>
        </CSSTransition>
      </div>
    );
  };

  const createDialog = () => {
    const element = createElement();
    return <Portal element={element} appendTo={props.appendTo} visible />;
  };

  return maskVisibleState ? createDialog() : null;
}

Dialog.displayName = "Dialog";
