//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/console.sol";

/**
 * @title ExquisiteMonad
 * @notice A collaborative storytelling contract where users build a story one line at a time
 * @dev Story is complete after 10 lines, then all donations are distributed equally to contributors
 */
contract ExquisiteMonad {
    // State Variables
    string[] public lines;
    address payable[] public authors;
    uint256 public constant MAX_LINES = 10;

    // Events
    event LineAdded(address indexed author, string text);
    event DonationReceived(address indexed donor, uint256 amount);
    event StoryCompleted(uint256 totalDonations);

    /**
     * @notice Add a new line to the collaborative story
     * @param _text The sentence/line to add to the story
     */
    function addLine(string memory _text) external {
        require(lines.length < MAX_LINES, "Story is finished!");
        require(bytes(_text).length > 0, "Line cannot be empty");

        console.log("Adding line from:", msg.sender);
        console.log("Line text:", _text);

        lines.push(_text);
        authors.push(payable(msg.sender));

        emit LineAdded(msg.sender, _text);

        // Auto-distribute when story is complete
        if (lines.length == MAX_LINES) {
            console.log("Story complete! Distributing revenue...");
            distributeRevenue();
        }
    }

    /**
     * @notice Allow anyone to financially back the story
     * @dev Accepts ETH/MON and holds it in contract until distribution
     */
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        emit DonationReceived(msg.sender, msg.value);
        console.log("Donation received:", msg.value);
    }

    /**
     * @notice Retrieve all story lines
     * @return Array of all story lines added so far
     */
    function getStory() external view returns (string[] memory) {
        return lines;
    }

    /**
     * @notice Get all author addresses
     * @return Array of all contributor addresses
     */
    function getAuthors() external view returns (address[] memory) {
        address[] memory authorAddresses = new address[](authors.length);
        for (uint256 i = 0; i < authors.length; i++) {
            authorAddresses[i] = authors[i];
        }
        return authorAddresses;
    }

    /**
     * @notice Get the current number of lines in the story
     * @return Number of lines added so far
     */
    function getLineCount() external view returns (uint256) {
        return lines.length;
    }

    /**
     * @notice Check if the story is complete
     * @return True if story has reached MAX_LINES
     */
    function isComplete() external view returns (bool) {
        return lines.length >= MAX_LINES;
    }

    /**
     * @notice Distribute all contract funds equally to all contributors
     * @dev Called automatically when the 10th line is added
     */
    function distributeRevenue() internal {
        uint256 balance = address(this).balance;
        
        if (balance == 0) {
            console.log("No balance to distribute");
            emit StoryCompleted(0);
            return;
        }

        uint256 share = balance / authors.length;
        console.log("Distributing", share, "to each of", authors.length, "authors");

        for (uint256 i = 0; i < authors.length; i++) {
            // Note: Using transfer() for hackathon simplicity
            // Production should use call{value: share}("") with proper error handling
            authors[i].transfer(share);
            console.log("Paid", share, "to author", i, ":", authors[i]);
        }

        emit StoryCompleted(balance);
    }

    /**
     * @notice Allow contract to receive ETH/MON directly
     */
    receive() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }

    /**
     * @notice Fallback function to accept ETH/MON
     */
    fallback() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }
}
