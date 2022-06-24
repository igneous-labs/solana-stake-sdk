# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.2] - 2022-05-16

### Changed
- `updateValidatorListBalanceTransactions` now only creates transactions for validators on the validator list that have not yet been updated.

## [0.4.1] - 2022-05-10

### Fixed
- `depositStake` bug that made it unusable in 0.4.0 (release yanked)

## [0.4.0] - 2022-05-10

### Changed
- `depositStake` and `depositStakeTransactions` now take an additional `amount` argument that can be used to split an active stake account before depositing. 

### Added
- `onStakePoolChange` and `onValidatorListChange`
- Export account schema types and classes

## [0.3.0] - 2022-04-28

### Fixed
- `Socean` constructor failing when `Connection` is passed in as arg when used in packages that contain their own installation of `@solana/web3.js`.

### Changed
- All `TransactionInstruction` functions are now exported

### Added
- utils:
  - `calcSolDepositInverse()`, `calcWithdrawalsInverse()`

## [0.2.1 - 0.2.4] - 2022-03/04

### Fixed
- `withdrawStake` not following on-chain logic of only withdrawing from transient/reserve stake accounts only if there are no active stake accounts in the entire stake pool
- issues with import and package resolution with `tsconfig-paths`

## [0.2.0] - 2022-03-10
### Changed
 - support for large withdrawal
 - `Socean` constructor to accept optional web3 connection or custom rpc url
 - `SoceanConfig` to be public
 - `buffer-layout` package was replaced by `@solana/buffer-layout`

### Added
 - types for bn.js
 - devnet support
 - `WithdrawalUnserviceableError` to accept description string `reason`
 - types:
   - `ConfirmOptions` (default preflightCommitment: "processed", commitment: "confirmed")
   - `DepositReceipt`
   - `WithdrawalReceipt`
   - `ValidatorWithdrawalReceipt`
 - utils:
   - `calcSolDeposit`
   - `calcStakeDeposit`
   - `stakeAvailableToWithdraw`



## [0.1.2] - 2022-02-15
### Fixed
 - esm module export
 - build procedure


## [0.1.1] - 2022-02-13
### Changed
 - update dependency `@types/node`: `17.0.10` -> `17.0.18`
 - update dependency `mocha`: `9.1.4` -> `9.2.0`
 - update dependency `ts-node`: `10.4.0` -> `10.5.0`


## [0.1.0] - 2022-02-13
### Added
TODO: intial spec list
