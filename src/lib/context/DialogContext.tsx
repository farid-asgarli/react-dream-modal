import * as React from "react";
import { createContext } from "react";
import { Dialog } from "../root/dialog/Dialog";
import { DialogApiProps, DialogContextProps, DialogProps, DialogWindowProps } from "../types/Dialog";
import { CSSTransitionProps } from "../types/CSSTransition";
import { debug } from "../_dev/Debug";
import ObjectUtils from "../utils/ObjectUtils";

export const DialogContext = createContext<DialogContextProps | null>(null);

export function DialogContextProvider({ children, enableLogging, defaultDialogProps }: DialogApiProps) {
  const dialogIds = React.useRef<string[]>([]);
  const visibleDialogIds = React.useRef<string[]>([]);
  const dialogProps = React.useRef<Record<string, DialogProps>>({});
  const dialogContents = React.useRef<Record<string, React.ReactNode>>({});
  const lastGeneratedId = React.useRef<number>(0);

  const [, setState] = React.useState<boolean>(false);

  const forceRender = () => setState((prev) => !prev);

  const generateUniqueId = () => `dialog_id_${lastGeneratedId.current++}`;

  function getCurrentDialogId() {
    if (!visibleDialogIds.current.length) return null;
    return visibleDialogIds.current[visibleDialogIds.current.length - 1];
  }

  function addDialogId(id: string) {
    dialogIds.current = Array.from(new Set([...dialogIds.current, id]));
    visibleDialogIds.current = Array.from(new Set([...visibleDialogIds.current, id]));
  }

  function addDialogContent(id: string, body?: React.ReactNode) {
    if (body) dialogContents.current[id] = body;
  }

  function addDialogProps(id: string, props: DialogWindowProps) {
    const mergedProps = ObjectUtils.getMergedProps(props, defaultDialogProps);

    const propsToAssign: DialogProps & {
      body?: React.ReactNode;
    } = {
      ...mergedProps,
      id,
      onHide: () => close(id),
      okButtonProps: mergedProps.okButtonProps ?? {},
      cancelButtonProps: mergedProps.cancelButtonProps ?? {},
      transitionOptions: defineDisposeTrigger(id, mergedProps),
    };

    delete propsToAssign.body;

    dialogProps.current[id] = propsToAssign;
  }

  function removeDialogId(id: string) {
    dialogIds.current = [...dialogIds.current.filter((x) => x !== id)];
  }

  function removeVisibleDialogId(id: string) {
    visibleDialogIds.current = [...visibleDialogIds.current.filter((x) => x !== id)];
  }

  function removeDialogContent(id: string) {
    delete dialogContents.current[id];
  }

  function removeDialogProps(id: string) {
    delete dialogProps.current[id];
  }

  function open(id: string, props: DialogWindowProps): void;
  function open(props: DialogWindowProps): string;
  function open(arg1: string | DialogWindowProps, arg2?: DialogWindowProps) {
    if (typeof arg1 === "string") {
      if (arg2) {
        addDialogId(arg1);
        addDialogContent(arg1, arg2.body);
        addDialogProps(arg1, arg2);
        forceRender();

        enableLogging && debug.log(`Dialog generated: ${arg1}`, arg2);
      }
    } else {
      const uniqueId = generateUniqueId();
      addDialogId(uniqueId);
      addDialogContent(uniqueId, arg1.body);
      addDialogProps(uniqueId, arg1);
      forceRender();

      enableLogging && debug.log(`Dialog generated: ${uniqueId}`, arg1);

      return uniqueId;
    }
  }

  function close(id?: string) {
    if (id) {
      removeVisibleDialogId(id);
      enableLogging && debug.log(`Dialog closed:`, id);
    } else {
      const currentId = getCurrentDialogId();

      if (currentId) close(currentId);
      else return;
    }
    forceRender();
  }

  function closeAll() {
    const prevIds = [...visibleDialogIds.current];
    visibleDialogIds.current = [];
    enableLogging && debug.log("Dialogs closed:", prevIds);
    forceRender();
  }

  function updateProps(arg1: string | ((props: DialogWindowProps) => void), arg2?: (props: DialogWindowProps) => void) {
    let currentProps;
    let currentId;
    if (typeof arg1 === "string") {
      currentId = arg1;
      if (!dialogProps.current[arg1]) return;
      if (arg2) {
        currentProps = { ...dialogProps.current[currentId] };
        arg2(currentProps);
      }
    } else {
      currentId = getCurrentDialogId();
      if (currentId) {
        currentProps = { ...dialogProps.current[currentId] };
        arg1(currentProps);
      } else return;
    }
    if (currentId && currentProps) {
      addDialogContent(currentId, (currentProps as DialogWindowProps).body);
      addDialogProps(currentId, currentProps);

      enableLogging && debug.log(`Dialog updated: ${currentId}`, currentProps);
      forceRender();
    }
  }

  function dispose(id: string) {
    removeDialogContent(id);
    removeDialogProps(id);
    removeDialogId(id);
    enableLogging && debug.log("Dialog disposed:", id);
  }

  function defineDisposeTrigger(id: string, props: DialogWindowProps) {
    return {
      ...props.transitionOptions,
      onExited: (node: HTMLElement) => {
        props.transitionOptions?.onExited?.(node);
        dispose(id);
      },
    } as CSSTransitionProps;
  }

  return (
    <DialogContext.Provider
      value={{
        open,
        close,
        updateProps,
        closeAll,
      }}
    >
      {dialogIds.current.map((id) => (
        <Dialog key={id} {...dialogProps.current[id]} visible={visibleDialogIds.current.includes(id)}>
          {dialogContents.current[id]}
        </Dialog>
      ))}
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const dialogContext = React.useContext(DialogContext);
  if (!dialogContext)
    throw new Error(
      "Dialog: Please add `DialogContextProvider` wrapper around the component where dialog windows will be used."
    );
  return dialogContext;
}
