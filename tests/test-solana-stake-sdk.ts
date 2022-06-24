import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { expect, use as chaiUse } from "chai";
import chaiAsPromised from "chai-as-promised";

import {
  findAllStakeAccountsByAuth,
  getStakeAccount,
  InvalidStakeAccAuthorityArgsError,
  StakeAccountDoesNotExistError,
} from "@/fetch";
import { stakeAccountState } from "@/state";
import { isStakeArraySameAccounts, sortStakeByPubkey } from "@/tests/utils";

chaiUse(chaiAsPromised);

describe("test", () => {
  const DEVNET_CONNECTION = new Connection(clusterApiUrl("devnet"));

  describe("fetch", () => {
    describe("findAllStakeAccountsByAuth", () => {
      it("Check InvalidStakeAccAuthorityArgsError", async () => {
        await expect(
          findAllStakeAccountsByAuth(DEVNET_CONNECTION, {}),
        ).to.be.rejectedWith(InvalidStakeAccAuthorityArgsError);
      });

      it("devnet socean findAllStakeAccountsByAuth", async () => {
        // Check that the validator stake accounts for socean stake pool fetched
        // match up across the 3 different args: staker-only, withdrawer-only, both

        // staker same as withdrawer
        const DEVNET_SOCEAN_AUTHORITY_PDA = new PublicKey(
          "2kNHAFADbhtSp7bu9dmXgKRu4od2PZrezoQdrh9ET42u",
        );

        const stakerOnly = (
          await findAllStakeAccountsByAuth(DEVNET_CONNECTION, {
            staker: DEVNET_SOCEAN_AUTHORITY_PDA,
          })
        ).sort(sortStakeByPubkey);
        const withdrawerOnly = (
          await findAllStakeAccountsByAuth(DEVNET_CONNECTION, {
            withdrawer: DEVNET_SOCEAN_AUTHORITY_PDA,
          })
        ).sort(sortStakeByPubkey);
        const both = (
          await findAllStakeAccountsByAuth(DEVNET_CONNECTION, {
            staker: DEVNET_SOCEAN_AUTHORITY_PDA,
            withdrawer: DEVNET_SOCEAN_AUTHORITY_PDA,
          })
        ).sort(sortStakeByPubkey);

        expect(stakerOnly.length).to.be.gt(0);
        expect(isStakeArraySameAccounts(stakerOnly, withdrawerOnly)).to.eq(
          true,
        );
        expect(isStakeArraySameAccounts(withdrawerOnly, both)).to.eq(true);
        expect(isStakeArraySameAccounts(both, stakerOnly)).to.eq(true);
      });
    });

    describe("getStakeAccount", () => {
      it("Check StakeAccountDoesNotExistError", async () => {
        const nonExistent = Keypair.generate().publicKey;
        await expect(
          getStakeAccount(DEVNET_CONNECTION, nonExistent),
        ).to.be.rejectedWith(StakeAccountDoesNotExistError);
      });
    });
  });

  describe("state", () => {
    let currentEpoch: BN;

    before(async () => {
      const { epoch } = await DEVNET_CONNECTION.getEpochInfo();
      currentEpoch = new BN(epoch);
    });

    it("devnet socean reserve account", async () => {
      // reserve account should be inactive
      const DEVNET_SOCEAN_RESERVE_ACCOUNT = new PublicKey(
        "HjmcUVFbj91aGds48UqLwPrKawVF3cwWpkCRRJaCymdt",
      );
      const reserveAcc = await getStakeAccount(
        DEVNET_CONNECTION,
        DEVNET_SOCEAN_RESERVE_ACCOUNT,
      );
      expect(stakeAccountState(reserveAcc.data, currentEpoch)).to.eq(
        "inactive",
      );
    });

    it("devnet socean validator stake account", async () => {
      // validator stake account should be active
      // Note: this might change with changes to delegation
      const DEVNET_SOCEAN_VALIDATOR_STAKE_ACCOUNT = new PublicKey(
        "FBSYLQi8YUurVDyveHPEWCPhna5TnXuCRT4seTM6jvBq",
      );
      const validatorStakeAcc = await getStakeAccount(
        DEVNET_CONNECTION,
        DEVNET_SOCEAN_VALIDATOR_STAKE_ACCOUNT,
      );
      expect(stakeAccountState(validatorStakeAcc.data, currentEpoch)).to.eq(
        "active",
      );
    });
  });
});
