// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

contract NearLink {
    
    mapping(address => bytes32) nearID;

    function addNearID(bytes32 _nearID) external {
        nearID[msg.sender] = _nearID;
    }
    
}
