export const debug = {
  log: (message?: any, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV === "development") {
      if (optionalParams.length)
        console.log(`%c|DEBUG ${new Date().toLocaleTimeString()}| ` + message, "color:lightgreen", ...optionalParams);
      else console.log(message);
    }
  },
};
