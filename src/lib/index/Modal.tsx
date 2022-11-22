/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useMemo } from "react";
import Draggable from "react-draggable";
import Fade from "../components/Fade/Fade";
import Close from "../icons/Close";
import { ModalContextType, ModalProps } from "../types/Modal";
import { concatStyles } from "../utils/ConcatStyles";
import "./Modal.css";

export const ModalContext = createContext<ModalContextType | null>(null);

export const D_MODAL = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      renderFooter,
      renderHeader,
      body,
      title,
      cancelButtonProps,
      okButtonProps,
      onCancel,
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
    },
    ref
  ) => {
    const displayHeader = useMemo(() => {
      if (renderHeader) return renderHeader?.(onCancel);
      return (
        <>
          <h3 className="modal-header-title">{title}</h3>
          {closable && (
            <div className="modal-header-button-wrapper">
              <button
                onClick={onCancel}
                type="button"
                title="Close"
                className="close-button"
              >
                <Close className="close-icon" />
              </button>
            </div>
          )}
        </>
      );
    }, [renderHeader, title]);

    const style: React.CSSProperties = {
      zIndex: `${1000 + (orderNumber ?? 0)}`,
    };

    const displayFooter = useMemo(() => {
      if (renderFooter) return renderFooter?.(onCancel);
      return (
        <div className="modal-footer-bottom">
          <button
            type="button"
            title="Cancel"
            className="modal-button cancel-button"
            onClick={closable ? onCancel : undefined}
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

    return (
      <Fade
        visible={visible}
        className={concatStyles("dream-modal-root", closable && "closable")}
        duration={animationDuration}
      >
        {displayMask && (
          <div
            style={style}
            onClick={closable ? onCancel : undefined}
            className="dream-modal-mask"
          />
        )}
        <Draggable
          positionOffset={{ x: `-${position.x}`, y: `-${position.y}` }}
          disabled={!draggable}
          handle={`.modal-header`}
        >
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
                  draggable && "draggable"
                )}
              >
                {displayHeader}
              </div>
              <div className="modal-content">{body}</div>
              <div className="modal-footer">{displayFooter}</div>
            </div>
          </div>
        </Draggable>
      </Fade>
    );
  }
);
