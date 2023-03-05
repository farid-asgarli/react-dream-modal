//@ts-nocheck
export default class ObjectUtils {
  static isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  static findDiffKeys(obj1, obj2) {
    if (!obj1 || !obj2) {
      return {};
    }

    return Object.keys(obj1)
      .filter((key) => !obj2.hasOwnProperty(key))
      .reduce((result, current) => {
        result[current] = obj1[current];

        return result;
      }, {});
  }

  static getJSXElement(obj, ...params) {
    return this.isFunction(obj) ? obj(...params) : obj;
  }

  static getProp(props, prop = "", defaultProps = {}) {
    const value = props ? props[prop] : undefined;

    return value === undefined ? defaultProps[prop] : value;
  }

  static getMergedProps<A, B>(props: A, defaultProps: B): A & B {
    return Object.assign({}, defaultProps, props);
  }

  static getDiffProps(props, defaultProps) {
    return this.findDiffKeys(props, defaultProps);
  }

  static getPropValue(obj, ...params) {
    let methodParams = params;

    if (params && params.length === 1) {
      methodParams = params[0];
    }

    return this.isFunction(obj) ? obj(...methodParams) : obj;
  }

  static getComponentDiffProps(component, defaultProps) {
    return this.isNotEmpty(component) ? this.getDiffProps(component.props, defaultProps) : undefined;
  }

  static getRefElement(ref) {
    if (ref) {
      return typeof ref === "object" && ref.hasOwnProperty("current") ? ref.current : ref;
    }

    return null;
  }

  static combinedRefs(innerRef, forwardRef) {
    if (innerRef && forwardRef) {
      if (typeof forwardRef === "function") {
        forwardRef(innerRef.current);
      } else {
        forwardRef.current = innerRef.current;
      }
    }
  }

  static isEmpty(value) {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      (!(value instanceof Date) && typeof value === "object" && Object.keys(value).length === 0)
    );
  }

  static isNotEmpty(value) {
    return !this.isEmpty(value);
  }
}
