// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @dev Interface of the Gelato Resolver
 */

interface IResolver {
    function checker()
        external
        view
        returns (bool canExec, bytes memory execPayload);
}