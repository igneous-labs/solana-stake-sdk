import { AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { create } from "superstruct";

import { StakeAccount, StakeMeta } from "@/account";

export class ParseStakeAccountError extends Error {}

/**
 * Converts an `AccountInfo<ParsedAccountData>` to an `AccountInfo<StakeAccount>`
 * @param account raw accountinfo returned by getParsedProgramAccounts or getParsedAccountInfo
 * @returns the parsed StakeAccount
 * @throws ParseStakeAccountError if `account` is AccountInfo<Buffer> or if unable to parse account data
 */
export function parsedAccountInfoToStakeAccount({
  executable,
  owner,
  lamports,
  data,
  rentEpoch,
}: AccountInfo<Buffer | ParsedAccountData>): AccountInfo<StakeAccount> {
  if (!("parsed" in data)) {
    throw new ParseStakeAccountError(
      "Raw AccountInfo<Buffer>, data not parsed",
    );
  }
  try {
    return {
      executable,
      owner,
      lamports,
      data: create(data.parsed, StakeAccount),
      rentEpoch,
    };
  } catch (e) {
    throw new ParseStakeAccountError((e as Error).message);
  }
}

export interface IsLockupInForceArgs {
  meta: StakeMeta;
  currEpoch: number;
  currUnixTimestamp: number;
}

export function isLockupInForce({
  meta,
  currEpoch,
  currUnixTimestamp,
}: IsLockupInForceArgs): boolean {
  return (
    meta.lockup.unixTimestamp > currUnixTimestamp ||
    meta.lockup.epoch > currEpoch
  );
}
