import BN from "bn.js";

import { StakeAccount } from "@/account";

export type StakeState = "inactive" | "activating" | "active" | "deactivating";

/**
 * Determins the current state of a stake account given the current epoch
 * @param stakeAccount
 * @param currentEpoch
 * @returns `stakeAccount`'s `StakeState`
 */
export function stakeAccountState(
  { type, info: { stake } }: StakeAccount,
  currentEpoch: BN,
): StakeState {
  if (type !== "delegated" || stake === null) {
    return "inactive";
  }

  const activationEpoch = new BN(stake.delegation.activationEpoch);
  const deactivationEpoch = new BN(stake.delegation.deactivationEpoch);

  if (activationEpoch.gt(currentEpoch)) {
    return "inactive";
  }
  if (activationEpoch.eq(currentEpoch)) {
    // if you activate then deactivate in the same epoch,
    // deactivationEpoch === activationEpoch.
    // if you deactivate then activate again in the same epoch,
    // the deactivationEpoch will be reset to EPOCH_MAX
    if (deactivationEpoch.eq(activationEpoch)) return "inactive";
    return "activating";
  }
  // activationEpoch < currentEpoch
  if (deactivationEpoch.gt(currentEpoch)) return "active";
  if (deactivationEpoch.eq(currentEpoch)) return "deactivating";
  return "inactive";
}
