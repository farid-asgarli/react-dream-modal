import React from "react";

export interface ModalProps extends ModalContextProps {
  visible: boolean;
  handleCancel: () => void;
  handleMinimize: () => void;
  handleMaximize: () => void;
  modalKey?: string;
  orderNumber?: number;
  minimized: boolean;
}

export interface ModalContextType {
  /** Keys of all modal windows that are currently displayed. */
  visibleModals: Array<string>;
  /** Hides modal on per-key basis. */
  closeModal(key: string): void;
  /** Removes all windows. */
  closeAllModals(): void;
  /** Shows modal on per-key basis and passes props. */
  openModal(key: string, props: ModalContextProps): void;
  /** Collection of windows to render.
   *
   *  `Warning`: Required only if `disableDefaultRootPlacement=true` has been passed to the context.
   */
  modalWindows: JSX.Element[];
  /** Grants the ability to minimize modal window. */
  minimizeModal(key: string): void;
  /** Grants the ability to maximize modal window. */
  maximizeModal(key: string): void;
  /** Allows the ability to modify props of the active modal window. */
  updateModal(
    key: string,
    updateProps: (props: ModalContextProps) => ModalContextProps
  ): void;
  /** Immediately closes modal window and removes its content. */
  destroyModal(key: string): void;
}

export interface ModalContextProps {
  /** Display custom `ok` button in the modal window. */
  customOkButton?: JSX.Element | undefined;
  /** Display custom `cancel` button in the modal window. */
  customCancelButton?: JSX.Element | undefined;
  /** Render custom header in the modal window. */
  renderHeader?: (
    /** Utility function to close modal window. */
    handleClose: () => void,
    /** Utility function to minimize modal window. */
    handleMinimize: () => void,
    /** Utility function to maximize modal window. */
    handleMaximize: () => void
  ) => React.ReactNode;
  /** Render custom footer in the modal window. */
  renderFooter?: (
    /** Utility function to close modal window. */
    handleClose: () => void,
    /** Utility function to minimize modal window. */
    handleMinimize: () => void,
    /** Utility function to maximize modal window. */
    handleMaximize: () => void
  ) => React.ReactNode;
  /** Title to display in the modal's header. */
  title?: string | undefined;
  /** Default modal body to render. */
  body?: React.ReactNode;
  /** Button props to pass to 'ok' button. */
  okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  /** Button props to pass to 'cancel' button. */
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  /** Default height of the modal. */
  height?: number;
  /** Default width of the modal. */
  width?: number;
  /** Allows modal window to be draggable. */
  draggable?: boolean;
  /** Allows modal window to be resizable by adding a handle. */
  resizable?: boolean;
  /** Dictates whether the user can close the window. */
  closable?: boolean;
  /** Dictates whether the user can minimize the window. */
  minimizable?: boolean;
  /** Displays modal background. */
  displayMask?: boolean;
  /** Default 'div' html props to pass. */
  htmlProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Initial position of the modal window. */
  position?: {
    /** X (horizontal) axis value. Default is 50%. */
    top?: string;
    /** Y (vertical) axis value. Default is 50%. */
    left?: string;
  };
  /** Animation duration in `ms`.
   *
   * Default is `250`.  */
  animationDuration?: number;
  /** Default z-index in modal windows.
   *
   * Default is `1500`. */
  baseZIndex?: number;
  /** Initiates when modal window is closed. */
  onWindowClose?: () => void;
  /** Initiates when modal window is opened. */
  onWindowOpen?: () => void;
}

export interface DefaultModalContextProps extends ModalContextProps {
  /** When enabled, `modalWindows` property should be manually injected into application. */
  disableDefaultRootPlacement?: boolean;
}
