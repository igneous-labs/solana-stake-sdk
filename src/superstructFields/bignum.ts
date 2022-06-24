// copied from https://github.com/solana-labs/solana/blob/master/explorer/src/validators/bignum.ts

import BN from "bn.js";
import { coerce, instance, string } from "superstruct";

export const BigNumFromString = coerce(instance(BN), string(), (value) => {
  if (typeof value === "string") return new BN(value, 10);
  throw new Error("invalid big num");
});
