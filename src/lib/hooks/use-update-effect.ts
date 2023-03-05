/* eslint-disable */
import * as React from "react";

export const useUpdateEffect = (fn?: () => void, deps?: React.DependencyList) => {
  const mounted = React.useRef(false);
  return React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    return fn && fn();
  }, deps);
};

/* eslint-enable */
