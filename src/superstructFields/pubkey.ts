// copied from https://github.com/solana-labs/solana/blob/master/explorer/src/validators/pubkey.ts

import { PublicKey } from "@solana/web3.js";
import { coerce, instance, string } from "superstruct";

export const PublicKeyFromString = coerce(
  instance(PublicKey),
  string(),
  (value) => new PublicKey(value),
);
