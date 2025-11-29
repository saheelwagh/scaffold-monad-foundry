# main idea: Mon ki baat

build a collaborative story one sentence at a time.

start with initial (genesis?) sentence. next person can add the next sentence. 

story is completed when the 10 lines are added. 

story can recieve tokens from backers. and the revenue gets distributed to all contributors.
Note : you can add multiple sentences from same address

## demo plan
- deploy genesis sentence on testnet and get a link of this page. this page has
- before or during demo, ask few people to visit and connect to the page
- they will see the contribute button. The demo will entirely be made up by them completing the story in 10 sentnces
- advanced step only if time permits: distribute tokens to all contributors

### gemini output so far
Verdict: YES, this is perfectly scoped for a 4-hour sprint, especially on Monad.

The constraint of "10 lines" simplifies the technical complexity enough that you can finish the full loop (Contract + UI + Integration) in one session. Monad’s 1-second block times will make the "add sentence" interaction feel like a real chat app rather than a slow blockchain transaction.

Here is your 4-Hour Vibe Code Execution Plan.

1. The "Hack" Architecture (Solidity)
Don't use OpenZeppelin's PaymentSplitter (it’s too heavy/complex for a 4-hour build). Do write a custom "Push" payment loop.

Note: On Ethereum Mainnet, looping through payments is bad practice (gas limits). On Monad, with a fixed array of 10 people and cheap gas, it is the fastest way to build a working demo.

The Logic:

State: string[] public storyLines; and address payable[] public authors;

Constraint: require(storyLines.length < 10, "Story is complete");

Revenue: A donate() function.

Payout: When the 10th line is added, the contract automatically loops through the authors array and sends address(this).balance / 10 to each.

The Code Snippet (Copy-Paste Ready)
Solidity

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExquisiteMonad {
    string[] public lines;
    address payable[] public authors;
    uint256 public constant MAX_LINES = 10;
    
    event LineAdded(address author, string text);
    event StoryCompleted(uint256 totalDonations);
    event DonationReceived(address donor, uint256 amount);

    // 1. Add a Line (The Core Action)
    function addLine(string memory _text) external {
        require(lines.length < MAX_LINES, "Story is finished!");
        require(bytes(_text).length > 0, "Line cannot be empty");
        
        lines.push(_text);
        authors.push(payable(msg.sender));
        
        emit LineAdded(msg.sender, _text);

        // Auto-Payout Trigger
        if (lines.length == MAX_LINES) {
            distributeRevenue();
        }
    }

    // 2. Back the Story (Revenue)
    function donate() external payable {
        emit DonationReceived(msg.sender, msg.value);
    }

    // 3. The "Push" Distribution (Hackathon Simplified)
    function distributeRevenue() internal {
        uint256 balance = address(this).balance;
        if (balance == 0) return;

        uint256 share = balance / authors.length;
        
        for (uint256 i = 0; i < authors.length; i++) {
            // In a hackathon, we ignore the success bool to save time/logic
            // In prod, use "Call" and handle failures
            authors[i].transfer(share); 
        }
        
        emit StoryCompleted(balance);
    }

    // View function for UI
    function getStory() external view returns (string[] memory) {
        return lines;
    }
}
2. The Build Roadmap (Hour-by-Hour)
Hour 1: Contract & Deploy

Paste the code above into your Scaffold-ETH YourContract.sol.

Deploy to Monad Testnet.

Verify: Use the "Debug Contracts" tab to manually add a line and send some dummy MON (testnet tokens) to the contract.

Hour 2: The Reading UI

Use useScaffoldContractRead to fetch getStory().

Visual: Map through the array and display each line as a paragraph <p>.

Style: Make the text look like a book page or a terminal window.

Hour 3: The Writing UI

Create a simple input field.

Logic: Hide the input if lines.length >= 10.

Monad Magic: Add a specific "Back this Story" button that calls donate().

Visual Feedback: When a user submits a line, show a loading spinner. On Monad, this spinner will only spin for ~1 second before success. Highlight this speed in your demo.

Hour 4: Polish & "The Hook"

The Hook: Add a "Live Revenue" counter. Show Contract Balance: 5.00 MON.

The Demo: Have a friend (or a second browser window) fill the 9th line. You fill the 10th line live.

The Climax: Show the Contract Balance drop to 0 and your wallet balance increase instantly.



###### backup idea
 "Unlockable" (The 1-Click Paywall)

Concept: A blur overlay on an image/text. The user clicks "Unlock (0.5 MON)". The transaction unblurs it locally and gives them a permanent on-chain "View Access" token.

Why Monad: Instant unlock. No waiting 15s for the transaction to clear to see the content.

Vibe Code: Mapping hasAccess[user]. Frontend checks this boolean to remove the CSS blur filter.