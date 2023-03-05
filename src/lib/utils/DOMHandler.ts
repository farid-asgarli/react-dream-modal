export default class DomHandler {
  static innerWidth(el: HTMLElement) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);

      width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

      return width;
    }

    return 0;
  }

  static width(el: HTMLElement) {
    if (el) {
      let width = el.offsetWidth;
      let style = getComputedStyle(el);

      width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

      return width;
    }

    return 0;
  }

  static getOuterWidth(el: HTMLElement | null, margin?: number) {
    if (el) {
      let width = el.getBoundingClientRect().width || el.offsetWidth;

      if (margin) {
        let style = getComputedStyle(el);

        width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      }

      return width;
    }

    return 0;
  }

  static getOuterHeight(el: HTMLElement | null, margin?: number) {
    if (el) {
      let height = el.getBoundingClientRect().height || el.offsetHeight;

      if (margin) {
        let style = getComputedStyle(el);

        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }

      return height;
    }

    return 0;
  }

  static getViewport() {
    let win = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      w = win.innerWidth || e.clientWidth || g.clientWidth,
      h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
  }

  static addClass(element: HTMLElement | null, className: string) {
    if (element && className) {
      if (element.classList) element.classList.add(className);
      else element.className += " " + className;
    }
  }

  static removeClass(element: HTMLElement | null, className: string) {
    if (element && className) {
      if (element.classList) element.classList.remove(className);
      else
        element.className = element.className.replace(
          new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
          " "
        );
    }
  }

  static hasClass(element: HTMLElement | null, className: string) {
    if (element) {
      if (element.classList) return element.classList.contains(className);
      else return new RegExp("(^| )" + className + "( |$)", "gi").test(element.className);
    }

    return false;
  }

  static find(element: HTMLElement, selector: any) {
    return element ? Array.from(element.querySelectorAll(selector)) : [];
  }

  static isFunction(obj: any) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  static appendChild(element: HTMLElement, target: any) {
    if (this.isElement(target)) target.appendChild(element);
    else if (target.el && target.el.nativeElement) target.el.nativeElement.appendChild(element);
    else throw new Error("Cannot append " + target + " to " + element);
  }

  static removeChild(element: HTMLElement, target: any) {
    if (this.isElement(target)) target.removeChild(element);
    else if (target.el && target.el.nativeElement) target.el.nativeElement.removeChild(element);
    else throw new Error("Cannot remove " + element + " from " + target);
  }

  static isElement(obj: any) {
    return typeof HTMLElement === "object"
      ? obj instanceof HTMLElement
      : obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string";
  }

  static isExist(element: HTMLElement | null): element is HTMLElement {
    return !!(element !== null && typeof element !== "undefined" && element.nodeName && element.parentNode);
  }

  static hasDOM() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
  }

  static getFocusableElements(element: HTMLElement | null, selector = "") {
    if (!element) return [];
    let focusableElements = DomHandler.find(
      element,
      `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector}`
    );

    let visibleFocusableElements = [];

    for (let focusableElement of focusableElements) {
      if (
        getComputedStyle(focusableElement).display !== "none" &&
        getComputedStyle(focusableElement).visibility !== "hidden"
      )
        visibleFocusableElements.push(focusableElement);
    }

    return visibleFocusableElements;
  }

  static getFirstFocusableElement(element: HTMLElement, selector?: string) {
    const focusableElements = DomHandler.getFocusableElements(element, selector);

    return focusableElements.length > 0 ? focusableElements[0] : null;
  }

  static getLastFocusableElement(element: HTMLElement, selector: string) {
    const focusableElements = DomHandler.getFocusableElements(element, selector);

    return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
  }

  static createInlineStyle(nonce?: string) {
    let styleElement = document.createElement("style");

    nonce && styleElement.setAttribute("nonce", nonce);
    document.head.appendChild(styleElement);

    return styleElement;
  }

  static removeInlineStyle(styleElement: HTMLElement | null) {
    if (this.isExist(styleElement)) {
      try {
        document.head.removeChild(styleElement);
      } catch (error) {
        // style element may have already been removed in a fast refresh
      }

      styleElement = null;
    }

    return styleElement;
  }

  static isRefObject(elem: any): elem is React.MutableRefObject<HTMLElement> {
    return typeof elem === "object" && elem.hasOwnProperty("current");
  }

  static getTargetElement(target: string | object | null) {
    if (!target) return null;

    if (target === "document") {
      return document;
    } else if (target === "window") {
      return window;
    } else if (this.isRefObject(target)) {
      return this.isExist(target.current) ? target.current : null;
    } else {
      const isFunction = (obj: any): obj is Function => !!(obj && obj.constructor && obj.call && obj.apply);
      const element = isFunction(target) ? target() : target;

      // NodeType 9 indicates it is a document element.
      if ((element && element.nodeType === 9) || this.isExist(element)) return element;
      return null;
    }
  }
}
