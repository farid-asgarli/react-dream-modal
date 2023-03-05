import { CSSTransitionProps } from "./CSSTransition";

/**
 * Custom complete method event.
 * @see {@link DialogProps.onMaximize}
 * @event
 */
interface DialogMaximizeEvent {
  /**
   * Browser mouse event.
   */
  originalEvent: React.SyntheticEvent;
  /**
   * When enabled, the dialog is initially displayed full screen.
   * @defaultValue false
   */
  maximized: boolean;
}

/**
 * Custom complete method event.
 * @see {@link DialogProps.onMinimize}
 * @event
 */
interface DialogMinimizeEvent {
  /**
   * Browser mouse event.
   */
  originalEvent: React.SyntheticEvent;
  /**
   * When enabled, the dialog is initially displayed minimized.
   * @defaultValue false
   */
  minimized: boolean;
}

interface DialogButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  [x: string]: any;
}

export interface DialogProps {
  /**
   * DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element and 'self'. The self value is used to render a component where it is located.
   * @defaultValue document.body
   */
  appendTo?: "self" | HTMLElement | undefined | null;
  /**
   * Defines a string that labels the close icon.
   */
  ariaCloseIconLabel?: string | undefined;
  /**
   * Base zIndex value to use in layering.
   * @defaultValue 0
   */
  baseZIndex?: number | undefined;
  /**
   * Whether background scroll should be blocked when dialog is visible.
   * @defaultValue false
   */
  blockScroll?: boolean | undefined;
  /**
   * Used to get the child elements of the component.
   * @readonly
   */
  children?: React.ReactNode | undefined;
  /**
   * Style class of the component.
   */
  className?: string | undefined;
  /**
   * Adds a close icon to the header to hide the dialog.
   * @defaultValue true
   */
  closable?: boolean | undefined;
  /**
   * Specifies if pressing escape key should hide the dialog.
   * @defaultValue true
   */
  closeOnEscape?: boolean | undefined;
  /**
   * Style class of the content section.
   */
  contentClassName?: string | undefined;
  /**
   * Style of the content section.
   */
  contentStyle?: React.CSSProperties | undefined;
  /**
   * Specifies if clicking the modal background should hide the dialog.
   * @defaultValue false
   */
  dismissibleMask?: boolean | undefined;
  /**
   * Enables dragging to change the position using header.
   * @defaultValue true
   */
  draggable?: boolean | undefined;
  /**
   * When enabled, first button receives focus on show.
   * @defaultValue true
   */
  focusOnShow?: boolean | undefined;
  /**
   * Footer content of the dialog.
   */
  footer?: React.ReactNode | ((props: DialogProps) => React.ReactNode);
  /**
   * Title content of the dialog.
   */
  header?: React.ReactNode | ((props: DialogProps) => React.ReactNode);
  /**
   * Style class of the header section.
   */
  headerClassName?: string | undefined;
  /**
   * Style of the header section.
   */
  headerStyle?: React.CSSProperties | undefined;
  /**
   * Custom icons template for the header.
   */
  icons?: React.ReactNode | ((props: DialogProps) => React.ReactNode);
  /**
   * Unique identifier of the element.
   */
  id: string;
  /**
   * Keeps dialog in the viewport.
   * @defaultValue true
   */
  keepInViewport?: boolean | undefined;
  /**
   * Style class of the mask.
   */
  maskClassName?: string | undefined;
  /**
   * Inline style of the mask.
   */
  maskStyle?: React.CSSProperties | undefined;
  /**
   * Whether the dialog can be displayed full screen.
   * @defaultValue false
   */
  maximizable?: boolean | undefined;
  /**
   * When enabled, the dialog is initially displayed full screen.
   * @defaultValue false
   */
  maximized?: boolean | undefined;
  /**
   * Whether the dialog can be displayed minimized.
   * @defaultValue false
   */
  minimizable?: boolean | undefined;
  /**
   * When enabled, the dialog is initially displayed minimized.
   * @defaultValue false
   */
  minimized?: boolean | undefined;
  /**
   * Minimum value for the left coordinate of dialog in dragging.
   * @defaultValue 0
   */
  minX?: number | undefined;
  /**
   * Minimum value for the top coordinate of dialog in dragging.
   * @defaultValue 0
   */
  minY?: number | undefined;
  /**
   * Defines if background should be blocked when dialog is displayed.
   * @defaultValue false
   */
  hideMask?: boolean | undefined;
  /**
   * Position of the dialog, options are "center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left" or "bottom-right".
   * @defaultValue center
   */
  position?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | undefined;
  /**
   * Enables resizing of the content.
   * @defaultValue true
   */
  resizable?: boolean | undefined;
  /**
   * When enabled dialog is displayed in RTL direction.
   * @defaultValue false
   */
  rtl?: boolean | undefined;
  /**
   * Whether to show the header or not.
   * @defaultValue true
   */
  showHeader?: boolean | undefined;
  /**
   * Inline style of the component.
   */
  style?: React.CSSProperties | undefined;
  /**
   * The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties.
   */
  transitionOptions?: CSSTransitionProps | undefined;
  /**
   * Specifies the visibility of the dialog.
   * @defaultValue false
   */
  visible?: boolean | undefined;
  /**
   * Callback to invoke when dialog is clicked.
   * @param {React.MouseEvent<HTMLElement>} event - Browser event.
   */
  onClick?(event: React.MouseEvent<HTMLElement>): void;
  /**
   * Callback to invoke when dragging dialog.
   * @param {React.MouseEvent<HTMLElement, MouseEvent>} event - Browser event.
   */
  onDrag?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
  /**
   * Callback to invoke when dialog dragging is completed.
   * @param {React.MouseEvent<HTMLElement, MouseEvent>} event - Browser event.
   */
  onDragEnd?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
  /**
   * Callback to invoke when dialog dragging is initiated.
   * @param {React.MouseEvent<HTMLElement, MouseEvent>} event - Browser event.
   */
  onDragStart?(event: React.MouseEvent<HTMLElement, MouseEvent>): void;
  /**
   * Callback to invoke when dialog is hidden (Required).
   */
  onHide(): void;
  /**
   * Callback to invoke when the mask is clicked.
   * @param {React.MouseEvent<HTMLElement>} event - Browser event.
   */
  onMaskClick?(event: React.MouseEvent<HTMLElement>): void;
  /**
   * Callback to invoke when toggle maximize icon is clicked.
   * @param {DialogMaximizeEvent} event - Custom click event.
   */
  onMaximize?(event: DialogMaximizeEvent): void;
  /**
   * Callback to invoke when toggle minimize icon is clicked.
   * @param {DialogMinimizeEvent} event - Custom click event.
   */
  onMinimize?(event: DialogMinimizeEvent): void;
  /**
   * Callback to invoke while resizing dialog.
   * @param {React.MouseEvent<HTMLElement>} event - Browser event.
   */
  onResize?(event: React.MouseEvent<HTMLElement>): void;
  /**
   * Callback to invoke when dialog resizing is completed.
   * @param {React.MouseEvent<HTMLElement>} event - Browser event.
   */
  onResizeEnd?(event: React.MouseEvent<HTMLElement>): void;
  /**
   * Callback to invoke when dialog resizing is initiated.
   * @param {React.MouseEvent<HTMLElement>} event - Browser event.
   */
  onResizeStart?(event: React.MouseEvent<HTMLElement>): void;
  /**
   * Callback to invoke when dialog is showed.
   */
  onShow?(): void;
  /**
   * Primary button in the dialog footer.
   */
  okButtonElement?: JSX.Element;
  /**
   *  Reject button in the dialog footer.
   */
  cancelButtonElement?: JSX.Element;
  /**
   * Props for primary button in the dialog footer.
   */
  okButtonProps?: DialogButtonProps | undefined;
  /**
   * Props for reject button in the dialog footer.
   */
  cancelButtonProps?: DialogButtonProps | undefined;
}

export interface DialogWindowProps extends Omit<DialogProps, "onHide" | "children" | "modal" | "id"> {
  /**
   * Callback to invoke when dialog is hidden.
   */
  onHide?(): void;
  /**
   * Dialog body where content will be displayed.
   */
  body?: React.ReactNode;
}

export interface DialogContextProps {
  /** Displays dialog by passing unique id and props. */
  open(id: string, props: DialogWindowProps): void;
  /**
   * Displays dialog by passing props.
   * Returns generated dialog `id`.
   * @param props Dialog props.
   */
  open(props: DialogWindowProps): string;
  /**
   * Closes dialog by passing id.
   * @param id Dialog id.
   */
  close(id?: string): void;
  /**
   * Closes recently opened dialog.
   * @param id Dialog id.
   */
  close(): void;
  /**
   * Closes all dialog windows.
   */
  closeAll(): void;
  /**
   * Updates props of dialog by passing dialog id and mutating action.
   * @param id Dialog id.
   * @param action Action which mutates props of dialog.
   */
  updateProps(id: string, action: (props: DialogWindowProps) => void): void;
  /**
   * Updates props of recently opened dialog by passing mutating action.
   * @param action Action which mutates props of dialog.
   */
  updateProps(action: (props: DialogWindowProps) => void): void;
}

export interface DialogApiProps {
  enableLogging?: boolean | undefined;
  defaultDialogProps?: DialogWindowProps | undefined;
  children?: React.ReactNode;
}
