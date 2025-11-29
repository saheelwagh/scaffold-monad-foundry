# ExquisiteMonad Contract Overview

## High-Level Purpose

ExquisiteMonad is a collaborative storytelling smart contract where multiple users build a story together, one sentence at a time, limited to exactly 10 lines. When the story is complete, all donations collected are automatically distributed equally among all contributors.

## Core Concept

- **Collaborative Creation**: Anyone can add a line to the ongoing story
- **Fixed Length**: Story is complete after exactly 10 lines (MAX_LINES = 10)
- **Revenue Sharing**: Backers can donate to support the story, funds split equally among authors
- **Auto-Distribution**: When the 10th line is added, all accumulated funds are distributed immediately

## State Variables

### `string[] public lines`
- **Type**: Dynamic array of strings
- **Purpose**: Stores all story lines in order
- **Max Size**: 10 elements

### `address payable[] public authors`
- **Type**: Dynamic array of payable addresses
- **Purpose**: Tracks the contributor address for each line
- **Max Size**: 10 elements (parallel to `lines` array)

### `uint256 public constant MAX_LINES`
- **Type**: Constant unsigned integer
- **Value**: 10
- **Purpose**: Defines when story is complete

## Public Functions

### 1. `addLine(string memory _text)`
**Purpose**: Add a new line to the story

**Inputs**:
- `_text`: The sentence/line to add to the story (string)

**Requirements**:
- Story must not be complete (`lines.length < MAX_LINES`)
- Text must not be empty (`bytes(_text).length > 0`)

**Effects**:
- Adds `_text` to the `lines` array
- Adds `msg.sender` to the `authors` array
- Emits `LineAdded` event
- If this is the 10th line, triggers `distributeRevenue()`

**Returns**: None (state-changing transaction)

### 2. `donate()`
**Purpose**: Allow anyone to financially back the story

**Inputs**:
- Value sent with transaction (payable)

**Requirements**:
- None (anyone can donate any amount)

**Effects**:
- Accepts ETH/MON into contract balance
- Emits `DonationReceived` event

**Returns**: None (payable transaction)

### 3. `getStory()`
**Purpose**: Retrieve all story lines for display

**Inputs**: None

**Requirements**: None (view function)

**Effects**: None (read-only)

**Returns**: 
- `string[] memory`: Array of all story lines added so far

## Internal Functions

### `distributeRevenue()`
**Purpose**: Distribute all contract funds equally to all contributors

**Visibility**: Internal (called automatically when 10th line is added)

**Logic**:
1. Get current contract balance
2. If balance is 0, return early
3. Calculate equal share: `balance / authors.length`
4. Loop through all authors and transfer their share
5. Emit `StoryCompleted` event

**Note**: Uses `.transfer()` for simplicity in hackathon context. Production would use `.call{value: share}("")` with failure handling.

## Events

### `LineAdded(address author, string text)`
- Emitted when a new line is added
- Frontend uses this for real-time updates

### `DonationReceived(address donor, uint256 amount)`
- Emitted when someone donates
- Frontend uses this to update balance display

### `StoryCompleted(uint256 totalDonations)`
- Emitted when 10th line triggers distribution
- Frontend uses this to show celebration/completion state

## User Flow Examples

### Flow 1: Contributing a Line
```
User → addLine("Once upon a time...") 
     → Contract stores line + author address
     → Event emitted
     → Frontend updates display
```

### Flow 2: Backing the Story
```
User → donate() with 0.1 MON
     → Contract holds funds
     → Event emitted
     → Frontend updates balance counter
```

### Flow 3: Completing the Story (10th Line)
```
User → addLine("The end.")
     → Contract stores line + author
     → lines.length == 10, trigger distributeRevenue()
     → Each of 10 authors receives 1/10 of balance
     → StoryCompleted event emitted
     → Frontend shows celebration
```

## Why This Works on Monad

### 1. Low Gas Costs
- **The Problem on Ethereum**: Looping through 10 transfers costs significant gas
- **Monad Solution**: Cheap gas makes push distribution viable

### 2. Fast Block Times
- **The Problem on Ethereum**: 12+ second blocks make collaboration feel slow
- **Monad Solution**: 1-second blocks = instant feedback, feels like a chat app

### 3. Instant Finality
- **The Problem on Ethereum**: Wait for confirmations before UI updates
- **Monad Solution**: Fast finality = immediately show new lines

## Security Considerations

### Intentional Simplifications (Hackathon-Appropriate)
- **No duplicate address check**: Same user can add multiple lines
- **Simple transfer**: Uses `.transfer()` instead of safer `.call()`
- **No refund mechanism**: If distribution fails, funds may be stuck
- **No content moderation**: Anyone can add any text

### Production Upgrades Would Include
- Reentrancy guards
- Pull payment pattern instead of push
- Content length limits enforced
- Duplicate author prevention
- Emergency withdraw function

## Gas Estimates (Approximate)

- `addLine()`: ~50,000-80,000 gas
- `donate()`: ~21,000 gas (base transfer)
- `getStory()`: 0 gas (view function)
- `distributeRevenue()`: ~200,000-300,000 gas (10 transfers)

**Total for full story cycle**: ~800,000 gas for 10 lines + distribution

On Monad with cheap gas, this is economically viable.
