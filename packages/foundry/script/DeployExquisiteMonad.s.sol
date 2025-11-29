//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import "../contracts/ExquisiteMonad.sol";

/**
 * @notice Simple deploy script for ExquisiteMonad contract
 * Example:
 * forge script script/DeployExquisiteMonad.s.sol --rpc-url localhost --broadcast --legacy
 * forge script script/DeployExquisiteMonad.s.sol --rpc-url monad --broadcast --legacy
 */
contract DeployExquisiteMonad is Script {
    function run() external {
        vm.startBroadcast();
        
        // Deploy ExquisiteMonad contract
        ExquisiteMonad exquisiteMonad = new ExquisiteMonad();
        
        console.log("ExquisiteMonad deployed at:", address(exquisiteMonad));
        console.log("Ready to accept collaborative story contributions!");
        
        vm.stopBroadcast();
    }
}
