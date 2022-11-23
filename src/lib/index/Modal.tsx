/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useMemo } from "react";
import Draggable from "react-draggable";
import Fade from "../components/Fade/Fade";
import Close from "../icons/Close";
import Maximize from "../icons/Maximize";
import Minimize from "../icons/Minimize";
import { ModalContextType, ModalProps } from "../types/Modal";
import { concatStyles } from "../utils/ConcatStyles";
import "./Modal.css";

export const ModalContext = createContext<ModalContextType | null>(null);

export const D_MODAL = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      renderFooter,
      renderHeader,
      handleCancel,
      handleMinimize,
      handleMaximize,
      body,
      title,
      cancelButtonProps,
      okButtonProps,
      visible,
      height,
      width,
      orderNumber,
      resizable,
      draggable,
      modalKey,
      closable = true,
      displayMask = true,
      position = {
        x: "50%",
        y: "50%",
      },
      htmlProps,
      animationDuration = 250,
      minimized,
      minimizable,
    },
    ref
  ) => {
    const displayHeader = useMemo(() => {
      if (renderHeader && !minimized)
        return renderHeader?.(handleCancel, handleMinimize, handleMaximize);
      return (
        <>
          <h3 className="modal-header-title">{title}</h3>
          <div className="modal-header-button-wrapper">
            {minimizable && (
              <button
                onClick={minimized ? handleMaximize : handleMinimize}
                type="button"
                title={minimized ? "Maximize" : "Minimize"}
                className="close-button"
              >
                {minimized ? (
                  <Maximize className="resize-icon" />
                ) : (
                  <Minimize className="resize-icon" />
                )}
              </button>
            )}
            {closable && (
              <button
                onClick={handleCancel}
                type="button"
                title="Close"
                className="close-button"
              >
                <Close className="close-icon" />
              </button>
            )}
          </div>
        </>
      );
    }, [renderHeader, title, minimized]);

    const style: React.CSSProperties = {
      zIndex: `${1000 + (orderNumber ?? 0)}`,
    };

    const displayFooter = useMemo(() => {
      if (renderFooter)
        return renderFooter?.(handleCancel, handleMinimize, handleMaximize);
      return (
        <div className="modal-footer-bottom">
          <button
            type="button"
            title="Cancel"
            className="modal-button cancel-button"
            onClick={closable ? handleCancel : undefined}
            {...cancelButtonProps}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-button ok-button"
            {...okButtonProps}
          >
            Ok
          </button>
        </div>
      );
    }, [cancelButtonProps, okButtonProps, renderFooter]);

    const displayDialog = (
      <div
        {...htmlProps}
        style={{ ...style, ...htmlProps?.style }}
        className={concatStyles("dream-modal-dialog", htmlProps?.className)}
      >
        <div
          key={modalKey}
          style={{
            width,
            height,
          }}
          ref={ref}
          className={concatStyles("modal-body", resizable && "resizable")}
        >
          <div
            className={concatStyles(
              "modal-header",
              (draggable || minimized) && "draggable"
            )}
          >
            {displayHeader}
          </div>
          <div className="modal-content">{body}</div>
          <div className="modal-footer">{displayFooter}</div>
        </div>
      </div>
    );

    return (
      <Fade
        visible={visible}
        className={concatStyles(
          "dream-modal-root",
          closable && "closable",
          minimized && "minimized"
        )}
        onAnimationFinish={(visible) => {
          if (visible === false && minimized) handleMaximize();
        }}
        duration={animationDuration}
      >
        {!minimized && displayMask && (
          <div
            style={style}
            onClick={closable ? handleCancel : undefined}
            className="dream-modal-mask"
          />
        )}
        <Draggable
          positionOffset={{ x: `-${position.x}`, y: `-${position.y}` }}
          disabled={!(draggable || minimized)}
          handle={`.modal-header`}
          position={!minimized && !draggable ? { x: 0, y: 0 } : undefined}
        >
          {displayDialog}
        </Draggable>
      </Fade>
    );
  }
);
