/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from "react";
import { useContext, useMemo, useRef, useState } from "react";
import { D_MODAL } from "../index/Modal";
import { useDetectKeyPress } from "../hooks/detectKeyPress";
import {
  ModalContextProps,
  DefaultModalContextProps,
  ModalContextType,
  ModalProps,
} from "../types/Modal";
import { concatStyles } from "../utils/ConcatStyles";

export const ModalContext = createContext<ModalContextType | null>(null);

export function ModalContextProvider({
  children,
  defaultProps,
}: {
  /** Default props for all modal windows. */
  defaultProps?: DefaultModalContextProps;
  children: React.ReactNode;
}) {
  const [visibleModals, setVisibleModals] = useState<Array<string>>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<Set<string>>(
    new Set()
  );
  const [modalProps, setModalProps] = useState<Map<string, ModalContextProps>>(
    new Map()
  );

  const visibleModalsRef = useRef<Array<string>>(visibleModals);
  visibleModalsRef.current = visibleModals;

  const modalPropsRef = useRef<Map<string, ModalContextProps>>(modalProps);
  modalPropsRef.current = modalProps;

  const modalRef = useRef<HTMLDivElement | null>(null);

  function minimizeModal(key: string) {
    setMinimizedWindows((prev) => new Set(prev).add(key));
  }

  function maximizeModal(key: string) {
    setMinimizedWindows((prev) => {
      const stateCopy = new Set(prev);
      stateCopy.delete(key);
      return stateCopy;
    });
  }

  function closeModal(key: string) {
    setVisibleModals((prev) => prev.filter((x) => x !== key));
  }

  function closeAllModals() {
    setVisibleModals([]);
  }

  function destroyModal(key: string) {
    setModalProps((prev) => {
      const stateCopy = new Map(prev);
      stateCopy.delete(key);
      return stateCopy;
    });
  }

  function updateModal(
    key: string,
    updateProps: (props: ModalContextProps) => ModalContextProps
  ) {
    setModalProps((prev) => {
      const entryToUpdate = prev.get(key);
      if (entryToUpdate) {
        const updatedProps = new Map(prev).set(key, updateProps(entryToUpdate));
        console.log(updatedProps);

        return updatedProps;
      }
      return prev;
    });
  }

  function closeCurrentModal() {
    const elementToHide =
      visibleModalsRef.current[visibleModalsRef.current.length - 1];
    modalPropsRef.current.get(elementToHide)?.closable === true &&
      closeModal(elementToHide);
  }

  function openModal(key: string, props: ModalContextProps) {
    setModalProps((prev) => {
      const modalPropsCopy = new Map(prev);
      modalPropsCopy.set(key, props);
      return modalPropsCopy;
    });

    setVisibleModals((prev) => {
      const stateCopy = [...prev];
      stateCopy.push(key);
      return stateCopy;
    });
  }

  useDetectKeyPress((key) => {
    if (key === "Escape") closeCurrentModal();
  });

  const modalWindows = useMemo(
    () =>
      Array.from(modalProps)
        .map((el) => {
          const key = el[0];
          const props = el[1];
          const orderNumber = visibleModals.findIndex((x) => x === key);

          const modalProps: ModalProps & { key: string } = {
            key,
            ...defaultProps,
            okButtonProps: {
              ...defaultProps?.okButtonProps,
              ...props.okButtonProps,
              className: concatStyles(
                defaultProps?.okButtonProps?.className,
                props.okButtonProps?.className
              ),
            },
            cancelButtonProps: {
              ...defaultProps?.cancelButtonProps,
              ...props.cancelButtonProps,
              className: concatStyles(
                defaultProps?.cancelButtonProps?.className,
                props.cancelButtonProps?.className
              ),
            },
            htmlProps: {
              ...defaultProps?.htmlProps,
              ...props.htmlProps,
              className: concatStyles(
                defaultProps?.htmlProps?.className,
                props.htmlProps?.className
              ),
            },
            handleCancel: () => closeModal(key),
            handleMinimize: () => minimizeModal(key),
            handleMaximize: () => maximizeModal(key),
            visible: visibleModals[orderNumber] !== undefined,
            orderNumber: visibleModals.findIndex((x) => x === key),
            modalKey: key,
            minimized: minimizedWindows.has(key),
            ...props,
          };
          return modalProps;
        })
        .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0))
        .map((props) => <D_MODAL ref={modalRef} {...props} />),
    [modalProps, visibleModals, minimizedWindows]
  );

  const contextProps: ModalContextType = {
    closeModal,
    openModal,
    closeAllModals,
    minimizeModal,
    maximizeModal,
    updateModal,
    destroyModal,
    modalWindows,
    visibleModals,
  };

  const ModalWindowsContainer = !defaultProps?.disableDefaultRootPlacement && (
    <div className="dream-modal-container">{modalWindows}</div>
  );

  return (
    <ModalContext.Provider value={contextProps}>
      {ModalWindowsContainer}
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext)!;
}
