import * as React from "react";

export const usePrevious = <TRef>(newValue: TRef) => {
  const ref = React.useRef<TRef | undefined>(undefined);

  React.useEffect(() => {
    ref.current = newValue;
  });

  return ref.current;
};
