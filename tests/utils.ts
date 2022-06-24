import { KeyedStakeAccountInfo } from "@/account";

export function sortStakeByPubkey(
  a: KeyedStakeAccountInfo,
  b: KeyedStakeAccountInfo,
): number {
  const aPubkey = a.accountId.toString();
  const bPubkey = b.accountId.toString();
  if (aPubkey > bPubkey) return 1;
  if (aPubkey < bPubkey) return -1;
  return 0;
}

export function isStakeArraySameAccounts(
  a1: KeyedStakeAccountInfo[],
  a2: KeyedStakeAccountInfo[],
): boolean {
  if (a1.length !== a2.length) return false;
  return a1.every((left, i) => {
    const right = a2[i];
    return left.accountId.equals(right.accountId);
  });
}
