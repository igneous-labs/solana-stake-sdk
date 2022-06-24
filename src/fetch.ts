import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
  StakeProgram,
} from "@solana/web3.js";

import { KeyedStakeAccountInfo } from "@/account";
import { parsedAccountInfoToStakeAccount } from "@/utils";

export type StakeAccAuthorityArgs = {
  staker?: PublicKey;
  withdrawer?: PublicKey;
};

const META_AUTHORIZED_STAKER_OFFSET = 12;
const META_AUTHORIZED_WITHDRAWER_OFFSET = 44;

/**
 * Finds all `Initialized` and `Stake` stake accounts with the given staker and/or withdrawer authority.
 * Note: this uses getParsedProgramAccounts under the hood
 * @param connection
 * @param stakeAccAuthorityArgs
 * @returns
 */
export async function findAllStakeAccountsByAuth(
  connection: Connection,
  { staker, withdrawer }: StakeAccAuthorityArgs,
): Promise<KeyedStakeAccountInfo[]> {
  const filters: GetProgramAccountsFilter[] = [];
  if (staker) {
    filters.push({
      memcmp: {
        offset: META_AUTHORIZED_STAKER_OFFSET,
        bytes: staker.toBase58(),
      },
    });
  }
  if (withdrawer) {
    filters.push({
      memcmp: {
        offset: META_AUTHORIZED_WITHDRAWER_OFFSET,
        bytes: withdrawer.toBase58(),
      },
    });
  }
  if (filters.length === 0) {
    return [];
  }
  const parsedStakeAccounts = await connection.getParsedProgramAccounts(
    StakeProgram.programId,
    {
      filters,
    },
  );

  // `as` cast safety: filter() filters out null entries
  return parsedStakeAccounts
    .map(({ pubkey, account }) => {
      try {
        const casted = parsedAccountInfoToStakeAccount(account);
        return {
          accountId: pubkey,
          accountInfo: casted,
        };
      } catch (e) {
        return null;
      }
    })
    .filter((maybeAcc) => Boolean(maybeAcc)) as KeyedStakeAccountInfo[];
}
