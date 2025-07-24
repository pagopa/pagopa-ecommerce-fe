import { pollingConfig } from "./api/client";

export const onBrowserUnload = () => {
  pollingConfig.counter.reset();
};
