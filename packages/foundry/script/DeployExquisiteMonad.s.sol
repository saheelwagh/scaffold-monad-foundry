//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/ExquisiteMonad.sol";

/**
 * @notice Deploy script for ExquisiteMonad contract
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeployExquisiteMonad.s.sol  # local anvil chain
 * yarn deploy --file DeployExquisiteMonad.s.sol --network monad # Monad testnet
 */
contract DeployExquisiteMonad is ScaffoldETHDeploy {
    /**
     * @dev Deployer setup based on `ETH_KEYSTORE_ACCOUNT` in `.env`:
     *      - "scaffold-eth-default": Uses Anvil's account #9, no password prompt
     *      - "scaffold-eth-custom": requires password used while creating keystore
     *
     * Note: Must use ScaffoldEthDeployerRunner modifier to:
     *      - Setup correct `deployer` account and fund it
     *      - Export contract addresses & ABIs to `nextjs` packages
     */
    function run() external ScaffoldEthDeployerRunner {
        // Deploy ExquisiteMonad contract
        ExquisiteMonad exquisiteMonad = new ExquisiteMonad();
        
        console.log("ExquisiteMonad deployed at:", address(exquisiteMonad));
        console.log("Ready to accept collaborative story contributions!");
    }
}
