// copied from https://github.com/solana-labs/solana/blob/master/explorer/src/validators/accounts/stake.ts
// See https://docs.rs/solana-program/latest/src/solana_program/stake/state.rs.html for details on struct packing

/* eslint-disable @typescript-eslint/no-redeclare */
import { AccountInfo, PublicKey } from "@solana/web3.js";
import { enums, Infer, nullable, number, type } from "superstruct";

import { BigNumFromString, PublicKeyFromString } from "@/superstructFields";

export type StakeAccountType = Infer<typeof StakeAccountType>;
export const StakeAccountType = enums([
  "uninitialized",
  "initialized",
  "delegated",
  "rewardsPool",
]);

export type StakeMeta = Infer<typeof StakeMeta>;
export const StakeMeta = type({
  rentExemptReserve: BigNumFromString,
  authorized: type({
    staker: PublicKeyFromString,
    withdrawer: PublicKeyFromString,
  }),
  lockup: type({
    unixTimestamp: number(),
    epoch: number(),
    custodian: PublicKeyFromString,
  }),
});

export type StakeAccountInfo = Infer<typeof StakeAccountInfo>;
export const StakeAccountInfo = type({
  meta: StakeMeta,
  stake: nullable(
    type({
      delegation: type({
        voter: PublicKeyFromString,
        stake: BigNumFromString,
        activationEpoch: BigNumFromString,
        deactivationEpoch: BigNumFromString,
        warmupCooldownRate: number(),
      }),
      creditsObserved: number(),
    }),
  ),
});

export type StakeAccount = Infer<typeof StakeAccount>;
export const StakeAccount = type({
  type: StakeAccountType,
  info: StakeAccountInfo,
});

// custom additions

export type KeyedStakeAccountInfo = {
  accountId: PublicKey;
  accountInfo: AccountInfo<StakeAccount>;
};
