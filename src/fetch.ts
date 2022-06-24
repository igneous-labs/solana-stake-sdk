/* eslint-disable max-classes-per-file */

import {
  AccountInfo,
  Commitment,
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
  StakeProgram,
} from "@solana/web3.js";

import { KeyedStakeAccountInfo, StakeAccount } from "@/account";
import { parsedAccountInfoToStakeAccount } from "@/utils";

export type StakeAccAuthorityArgs = {
  staker?: PublicKey;
  withdrawer?: PublicKey;
};

export class InvalidStakeAccAuthorityArgsError extends Error {
  constructor() {
    super("At least one of staker or withdrawer must be provided");
  }
}

const META_AUTHORIZED_STAKER_OFFSET = 12;
const META_AUTHORIZED_WITHDRAWER_OFFSET = 44;

/**
 * Finds all `Initialized` and `Stake` stake accounts with the given staker and/or withdrawer authority.
 * Note: this uses getParsedProgramAccounts under the hood
 * @param connection
 * @param stakeAccAuthorityArgs
 * @returns
 * @throws `InvalidStakeAccAuthorityArgsError` if stakeAccAuthorityArgs does not container either staker or withdrawer
 */
export async function findAllStakeAccountsByAuth(
  connection: Connection,
  { staker, withdrawer }: StakeAccAuthorityArgs,
  commitment?: Commitment,
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
    throw new InvalidStakeAccAuthorityArgsError();
  }
  const parsedStakeAccounts = await connection.getParsedProgramAccounts(
    StakeProgram.programId,
    {
      commitment,
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

export class StakeAccountDoesNotExistError extends Error {
  constructor(publicKey: PublicKey) {
    super(`${publicKey.toString()} stake account does not exist`);
  }
}

/**
 * Fetches a stake account from on-chain
 * @param connection
 * @param publicKey
 * @param commitment
 * @returns
 * @throws StakeAccountDoesNotExistError if stake account does not exist
 * @throws
 */
export async function getStakeAccount(
  connection: Connection,
  publicKey: PublicKey,
  commitment?: Commitment,
): Promise<AccountInfo<StakeAccount>> {
  const { value } = await connection.getParsedAccountInfo(
    publicKey,
    commitment,
  );
  if (!value) throw new StakeAccountDoesNotExistError(publicKey);
  return parsedAccountInfoToStakeAccount(value);
}
