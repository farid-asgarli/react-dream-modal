/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useContext, useMemo, useRef, useState } from "react";
import { D_MODAL, ModalContext } from "../index/Modal";
import { useDetectKeyPress } from "../hooks/detectKeyPress";
import {
  ModalContextProps,
  DefaultModalContextProps,
  ModalContextType,
} from "../types/Modal";

export function ModalContextProvider({
  children,
  defaultProps,
}: {
  /** Default props for all modal windows. */
  defaultProps?: DefaultModalContextProps;
  children: React.ReactNode;
}) {
  const [visibleModals, setVisibleModals] = useState<Array<string>>([]);

  const [modalProps, setModalProps] = useState<Map<string, ModalContextProps>>(
    new Map()
  );

  const visibleModalsRef = useRef<Array<string>>(visibleModals);
  visibleModalsRef.current = visibleModals;

  const modalPropsRef = useRef<Map<string, ModalContextProps>>(modalProps);
  modalPropsRef.current = modalProps;

  const modalRef = useRef<HTMLDivElement | null>(null);

  function closeModal(key: string) {
    setVisibleModals((prev) => prev.filter((x) => x !== key));
  }

  function closeAllModals() {
    setVisibleModals([]);
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

  // function openModal() {}

  useDetectKeyPress((key) => {
    if (key === "Escape") closeCurrentModal();
  });

  const modalWindows = useMemo(
    () =>
      Array.from(modalProps)
        .map((el) => {
          const key = el[0];
          const props = el[1];

          return {
            key,
            ...defaultProps,
            onCancel: () => closeModal(key),
            visible: visibleModals.find((x) => x === key) !== undefined,
            orderNumber: visibleModals.findIndex((x) => x === key),
            modalKey: key,
            ...props,
          };
        })
        .sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0))
        .map((props) => <D_MODAL ref={modalRef} {...props} />),
    [modalProps, visibleModals]
  );

  const contextProps: ModalContextType = {
    closeModal,
    openModal,
    closeAllModals,
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
