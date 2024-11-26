import NodeCache from "node-cache";

export const cache = new NodeCache({
  checkperiod: 60 * 60,
  forceString: true,
  stdTTL: 60 * 60,
  deleteOnExpire: true,
});
