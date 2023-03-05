import React from "react";
import { DialogIcons } from "../../icons";
import { classNames } from "../../utils/ClassNames";

function Button(
  {
    className,
    icon,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: keyof typeof DialogIcons;
  },
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <button ref={ref} type="button" className={classNames(className, "dialog-header-button")} {...props}>
      {React.createElement(DialogIcons[icon], {
        className: "dialog-header-icon",
      })}
    </button>
  );
}
export default React.forwardRef(Button);
