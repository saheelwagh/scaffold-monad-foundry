# Integration Plan: Mon ki baat - From Demo to Live Blockchain

## Current Status Assessment

### ✅ What's Working (Demo Mode)
- **Frontend**: Fully functional UI with 3 components
- **Mock Data**: Simulated transactions with setTimeout
- **Layout**: Responsive, polished design
- **User Flow**: Complete story creation and donation flow

### ❌ What's Missing (Real Blockchain)
- **Smart Contract**: ExquisiteMonad.sol not yet created
- **Contract Deployment**: No deployed contracts (deployedContracts.ts is empty)
- **Blockchain Connection**: Hooks not integrated in page.tsx
- **Wallet Integration**: Not connected to real transactions

---

## Q1: Do we need any other pages for the demo?

### Answer: **NO** - Current single page is sufficient

The `/my-app` page contains everything needed for the demo:
- Story display with all 10 slots
- Input interface for contributions
- Donation/revenue panel
- Progress stats and info

**Optional Enhancement** (NOT required for 4-hour sprint):
- The home page (`/`) already has a "Launch App" button linking to `/my-app`
- You could keep the home page as a landing page
- The `/debug` page will automatically work once contract is deployed (for testing)

**Recommendation**: Focus only on `/my-app` page for demo. It's self-contained and perfect.

---

## Q2: What do we need to make transactions real?

### 5 Steps to Enable Real Blockchain Transactions:

#### Step 1: Create ExquisiteMonad Smart Contract
**File**: `/packages/foundry/contracts/ExquisiteMonad.sol`
**Status**: Not created yet
**What it needs**:
```solidity
// State variables
string[] public lines;
address payable[] public authors;
uint256 public constant MAX_LINES = 10;

// Functions
function addLine(string memory _text) external
function donate() external payable
function getStory() external view returns (string[] memory)
function distributeRevenue() internal
```

#### Step 2: Deploy Contract
**Commands needed**:
```bash
# Local Foundry chain (for testing)
cd packages/foundry
yarn chain  # Terminal 1

# Deploy contract
yarn deploy  # Terminal 2

# Deploy to Monad Testnet (when ready)
yarn deploy --network monad
```

**What happens**: This creates deployment artifacts in `/packages/nextjs/contracts/deployedContracts.ts`

#### Step 3: Update page.tsx to use Scaffold-ETH hooks
**File**: `/packages/nextjs/app/my-app/page.tsx`
**Replace mock handlers with**:

```typescript
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

// Read contract data
const { data: lines } = useScaffoldReadContract({
  contractName: "ExquisiteMonad",
  functionName: "getStory",
});

const { data: authors } = useScaffoldReadContract({
  contractName: "ExquisiteMonad",
  functionName: "authors",
});

// Write to contract
const { writeContractAsync: addLine, isMining: isAddingLine } = 
  useScaffoldWriteContract({ contractName: "ExquisiteMonad" });

const { writeContractAsync: donate, isMining: isDonating } = 
  useScaffoldWriteContract({ contractName: "ExquisiteMonad" });

// Handle submissions
const handleAddLine = async (text: string) => {
  await addLine({
    functionName: "addLine",
    args: [text],
  });
};

const handleDonate = async (amount: string) => {
  await donate({
    functionName: "donate",
    value: parseEther(amount),
  });
};
```

#### Step 4: Add Wallet Connection Check
**Add to page.tsx**:
```typescript
const { address: connectedAddress } = useAccount();

if (!connectedAddress) {
  return (
    <div className="alert alert-warning">
      Please connect your wallet to participate
    </div>
  );
}
```

#### Step 5: Deploy Script for ExquisiteMonad
**File**: `/packages/foundry/script/DeployExquisiteMonad.s.sol`
```solidity
contract DeployExquisiteMonad is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        new ExquisiteMonad();
    }
}
```

---

## Q3: How to connect to Monad Testnet?

### Good News: Already Configured! ✅

The `scaffold.config.ts` already has Monad Testnet configured:

```typescript
export const monadTestnet = defineChain({
  id: 41454,
  name: "Monad Testnet",
  nativeCurrency: { symbol: "MON" },
  rpcUrls: { default: { http: ["https://testnet.monad.xyz"] }},
  testnet: true,
});

const scaffoldConfig = {
  targetNetworks: [chains.foundry, monadTestnet],
  // ...
};
```

### To Connect:
1. **User's Wallet**: Add Monad Testnet network to MetaMask
   - Network Name: Monad Testnet
   - RPC URL: https://testnet.monad.xyz
   - Chain ID: 41454
   - Currency: MON
   - Explorer: https://explorer.testnet.monad.xyz

2. **Network Switcher**: The app already has a network dropdown in the header (Scaffold-ETH default)
   - User selects "Monad Testnet" from dropdown
   - Wallet prompts to switch network

3. **Deploy Command**:
```bash
yarn deploy --network monad
```

---

## Q4: Potential Errors When Connecting to Testnet

### Investigation of page.tsx for Issues:

#### ✅ NO CRITICAL ISSUES FOUND

The current implementation will work smoothly ONCE hooks are integrated. However, here are **potential issues to watch for**:

### Issue 1: Authors Array Reading
**Problem**: Authors are stored as `address payable[]` but we need to read them
**Current code assumes**: Single array read
**Solution**: Create a getter in contract
```solidity
function getAuthors() external view returns (address[] memory) {
    address[] memory authorAddresses = new address[](authors.length);
    for (uint i = 0; i < authors.length; i++) {
        authorAddresses[i] = authors[i];
    }
    return authorAddresses;
}
```

Or read individually:
```typescript
const { data: author0 } = useScaffoldReadContract({
  contractName: "ExquisiteMonad",
  functionName: "authors",
  args: [BigInt(0)],
});
```

### Issue 2: Contract Balance Reading
**Current code**: Shows hardcoded "0.42" MON
**Need**: Real balance from blockchain
**Solution**:
```typescript
import { useBalance } from "wagmi";

const { data: deployedContract } = useDeployedContractInfo({
  contractName: "ExquisiteMonad"
});

const { data: balance } = useBalance({
  address: deployedContract?.address,
});

const contractBalance = balance ? formatEther(balance.value) : "0";
```

### Issue 3: Event Listening for Real-time Updates
**Current code**: Mock state updates instantly
**Need**: Listen for blockchain events
**Solution**:
```typescript
const { data: lineAddedEvents } = useScaffoldEventHistory({
  contractName: "ExquisiteMonad",
  eventName: "LineAdded",
  fromBlock: 0n,
});
```

### Issue 4: Transaction Confirmation Time
**Demo shows**: 1.5 second fake delay
**Monad reality**: ~1 second block time
**Fix**: Remove artificial delays, use `isMining` state from hooks
```typescript
const { isMining } = useScaffoldWriteContract({ 
  contractName: "ExquisiteMonad" 
});

// Use isMining for loading states instead of local state
```

### Issue 5: Story Completion Detection
**Current**: Checks `lines.length >= 10` in frontend
**Need**: Also listen for `StoryCompleted` event
**Solution**:
```typescript
const { data: completedEvents } = useScaffoldEventHistory({
  contractName: "ExquisiteMonad",
  eventName: "StoryCompleted",
});

const isComplete = (lines?.length ?? 0) >= 10 || 
                   (completedEvents?.length ?? 0) > 0;
```

### Issue 6: Network Mismatch Handling
**Potential problem**: User on wrong network
**Already handled**: `useScaffoldWriteContract` shows error notification
```typescript
// Line 104 in useScaffoldWriteContract.ts:
notification.error(`Wallet is connected to the wrong network. 
                    Please switch to ${selectedNetwork.name}`);
```

### Issue 7: Wallet Not Connected
**Potential problem**: User tries to interact without wallet
**Solution**: Add guard at component level
```typescript
const { address, isConnected } = useAccount();

if (!isConnected) {
  return <div className="alert alert-warning">
    Connect your wallet to participate in the story
  </div>;
}
```

### Issue 8: Missing Contract Deployment
**Problem**: User tries to use app before contract deployed
**Already handled**: Hooks show notification
```typescript
// Line 94 in useScaffoldWriteContract.ts:
notification.error("Target Contract is not deployed, 
                    did you forget to run `yarn deploy`?");
```

---

## Summary: What's Needed to Go Live

### Critical Path (Must Do):

1. **Create ExquisiteMonad.sol contract** (15-20 min)
   - Copy from gemini output in spot ideas.md
   - Add `getAuthors()` getter function

2. **Create deploy script** (5 min)
   - `DeployExquisiteMonad.s.sol`

3. **Deploy locally first** (5 min)
   - Test with local Foundry chain
   - Verify deployedContracts.ts populates

4. **Update page.tsx with hooks** (20-25 min)
   - Replace mock state with `useScaffoldReadContract`
   - Replace handlers with `useScaffoldWriteContract`
   - Add `useBalance` for contract balance
   - Add wallet connection check

5. **Test locally** (10 min)
   - Connect wallet
   - Add lines
   - Make donation
   - Verify events

6. **Deploy to Monad Testnet** (10 min)
   - Get testnet MON from faucet
   - Run `yarn deploy --network monad`
   - Test on testnet

### Optional (Nice to Have):

- Add event history for live updates
- Add confetti animation on completion
- Show transaction hash links
- Add loading skeletons
- Better error messages

---

## Risk Assessment: LOW ✅

**Why this will work smoothly**:
1. Scaffold-ETH framework handles all the hard parts
2. Monad is EVM-compatible (no special adaptations needed)
3. Contract is simple (no complex dependencies)
4. Frontend already built and tested
5. Network config already set up

**Estimated time to go from demo → live**: 60-75 minutes
