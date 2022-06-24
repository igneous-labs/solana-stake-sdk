import { AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { create } from "superstruct";

import { StakeAccount } from "@/account";

/**
 *
 * @param account raw accountinfo returned by getParsedProgramAccounts
 * @returns the parsed StakeAccount, null if unable to parse
 */
export function parsedAccountInfoToStakeAccount({
  executable,
  owner,
  lamports,
  data,
  rentEpoch,
}: AccountInfo<Buffer | ParsedAccountData>): AccountInfo<StakeAccount> {
  if (!("parsed" in data)) {
    throw new Error("Raw AccountInfo, not parsed");
  }
  return {
    executable,
    owner,
    lamports,
    data: create(data.parsed, StakeAccount),
    rentEpoch,
  };
}
