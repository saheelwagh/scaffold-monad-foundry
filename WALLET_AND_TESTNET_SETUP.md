# Wallet & Testnet Setup Guide

## Understanding the Error

### Error Explanation
```
HttpRequestError: HTTP request failed.
URL: http://127.0.0.1:8545
Request body: {"method":"eth_accounts"}
Details: Failed to fetch
```

**What it means**: The frontend is trying to connect to a local blockchain node (Foundry/Anvil) at `127.0.0.1:8545`, but no local chain is running.

**Is it critical?** ❌ **NO** - This error is **NOT blocking** your app. It's from the block explorer feature trying to fetch local blockchain data.

**Where it comes from**: 
- File: `/packages/nextjs/hooks/scaffold-eth/useFetchBlocks.ts` (line 20)
- Purpose: Block explorer functionality (the `/blockexplorer` page)
- Connects to: `ws://127.0.0.1:8545` (WebSocket to local chain)

**When does it matter?**
- ✅ **Ignore it** if you're deploying directly to Monad testnet
- ⚠️ **Fix it** if you want to test locally first

---

## Wallet Connection Architecture

### How the App Connects to Wallets

The app uses **RainbowKit + Wagmi** for wallet connections. Here's the flow:

```
User Opens App 
    ↓
RainbowKit "Connect Wallet" Button in Header
    ↓
User Selects Wallet (MetaMask, WalletConnect, Coinbase, etc.)
    ↓
User Approves Connection in Their Wallet
    ↓
App Gets User's Address + Network
    ↓
User Interacts with Smart Contract
```

### Supported Wallets

Your app supports these wallets out of the box (from `wagmiConnectors.tsx`):

1. **MetaMask** ⭐ (Most common)
2. **WalletConnect** (Mobile wallets)
3. **Ledger** (Hardware wallet)
4. **Coinbase Wallet**
5. **Rainbow Wallet**
6. **Safe Wallet** (Multisig)
7. **Burner Wallet** (Local testing only - auto-funded)

### Network Configuration

Your app is configured in `scaffold.config.ts` to support:
- **Foundry Local** (Chain ID: 31337) - for local testing
- **Monad Testnet** (Chain ID: 41454) - for hackathon demo

---

## Testnet Setup: Where to Send Your Tokens

### The Answer: Send Tokens to YOUR MetaMask Address

**Important**: The smart contract is deployed by YOU, but **users connect with their OWN wallets**.

### Here's How It Works:

#### 1. Deploy Contract (Uses Deployment Wallet)
```bash
# This uses the deployer account from .env
cd packages/foundry
yarn deploy --network monad
```

**Deployer address**: Found in `/packages/foundry/.env`
- `ETH_KEYSTORE_ACCOUNT=scaffold-eth-default` → Uses generated keystore
- This address needs testnet MON to pay for deployment gas

#### 2. Users Interact (Use Their Own Wallets)
- User clicks "Connect Wallet" in the app header
- User selects MetaMask (or another wallet)
- User approves connection
- User's OWN address is used for all transactions

**User addresses**: Completely independent from deployment
- Users use their personal MetaMask/wallet
- Each user pays their own gas
- Each user receives their share of donations

### Token Distribution for Hackathon

You mentioned organizers are giving you "free testnet tokens". Here's where to send them:

#### Option A: Your MetaMask (Recommended for Demo)
**Send to**: Your personal MetaMask address

**Why**: 
- You'll be the one demonstrating the app
- You need MON to:
  - Add lines to the story
  - Make donations
  - Pay gas fees

**How to get your address**:
1. Open MetaMask
2. Click on your account name at top
3. Copy your address (starts with `0x...`)

#### Option B: Deployment Keystore Address (For Contract Deployment)
**Send to**: The deployer address in Foundry keystore

**Why**: 
- Needed to deploy the contract
- Only used once for deployment

**How to find it**:
```bash
cd packages/foundry
# If using custom keystore:
cast wallet address --keystore /path/to/keystore

# If using default scaffold keystore:
# Address is in: ~/.foundry/keystores/scaffold-eth-default
```

#### Option C: Multiple Demo Accounts
**Recommended**: Create 2-3 MetaMask accounts for realistic demo

**Why**:
- Simulate multiple users contributing to the story
- Show collaboration in real-time
- Demonstrate the revenue distribution

**How**:
1. MetaMask → Create Account (Account 2, 3, etc.)
2. Get addresses for all accounts
3. Send testnet MON to each account
4. Switch between accounts during demo

---

## Step-by-Step: Complete Testnet Setup

### Step 1: Add Monad Testnet to MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Click "Add a network manually"
4. Enter:
   - **Network Name**: Monad Testnet
   - **RPC URL**: `https://testnet.monad.xyz`
   - **Chain ID**: `41454`
   - **Currency Symbol**: MON
   - **Block Explorer**: `https://explorer.testnet.monad.xyz`
5. Save

### Step 2: Get Testnet Tokens

**From organizers**: Send them your MetaMask address(es)

**Amount needed**:
- **Deployment**: ~0.5-1 MON (one-time)
- **Demo usage**: ~0.1 MON per user (gas for transactions)
- **Donations**: Whatever you want to demonstrate revenue sharing

**Recommended**: Get at least 2-3 MON total distributed across your demo accounts

### Step 3: Deploy Contract to Monad Testnet

```bash
# Make sure your deployment wallet has testnet MON
cd packages/foundry

# Deploy to Monad testnet
yarn deploy --file DeployExquisiteMonad.s.sol --network monad
```

**This will**:
- Deploy ExquisiteMonad contract to Monad testnet
- Auto-export ABI to `/packages/nextjs/contracts/deployedContracts.ts`
- Show deployed contract address

### Step 4: Verify App Connection

1. Start frontend: `cd packages/nextjs && yarn start`
2. Open: `http://localhost:3000/my-app`
3. Click "Connect Wallet" in header
4. Select MetaMask
5. Make sure MetaMask is on "Monad Testnet" network
6. Approve connection

### Step 5: Test Interactions

1. **Add a line**: Type in story input → submit
2. **Make a donation**: Enter amount → donate
3. **Switch accounts**: Change MetaMask account → add another line
4. **Complete story**: Get to 10 lines → see auto-distribution

---

## Common Issues & Solutions

### Issue: "Wrong Network" Error
**Problem**: MetaMask is on different network than app

**Solution**: 
- Click network switcher in app header
- Select "Monad Testnet"
- OR switch in MetaMask directly

### Issue: "Contract not deployed"
**Problem**: Contract not deployed or wrong network

**Solution**:
- Verify deployment: Check `packages/nextjs/contracts/deployedContracts.ts`
- Should show contract address for chain ID 41454
- Re-run deployment if empty

### Issue: Transaction Fails
**Problem**: Insufficient gas or wrong network

**Solution**:
- Check MetaMask has testnet MON
- Verify on correct network
- Check contract is deployed

### Issue: Can't See Deployed Contracts in Debug Page
**Problem**: deployedContracts.ts not populated

**Solution**:
- Check Foundry deployment script exports properly
- Verify `DeployExquisiteMonad.s.sol` has `ScaffoldEthDeployerRunner` modifier
- May need to manually copy ABI if auto-export fails

---

## Local Testing (Optional)

If you want to test locally before deploying to testnet:

### Start Local Chain
```bash
cd packages/foundry
yarn chain
```
**This starts**: Anvil (Foundry's local Ethereum node) at `127.0.0.1:8545`

### Deploy Locally
```bash
# In another terminal
cd packages/foundry
yarn deploy --file DeployExquisiteMonad.s.sol
```

### Use Burner Wallet
- App automatically provides a funded "Burner Wallet" for local testing
- No MetaMask needed for local
- Shows in wallet selector when on local network

---

## For Your Hackathon Demo

### Recommended Setup:

1. **Create 3 MetaMask Accounts**:
   - Account 1: "Deployer/User1" (your main)
   - Account 2: "User2"
   - Account 3: "User3"

2. **Get Testnet MON**:
   - Give organizers all 3 addresses
   - Request 1 MON per address (3 MON total)

3. **Deploy Contract**:
   - Use Account 1 to deploy
   - Note the contract address

4. **Demo Flow**:
   - Account 1: Add line 1, make donation
   - Switch to Account 2: Add line 2
   - Switch to Account 3: Add line 3
   - Continue until 10 lines
   - Show revenue distribution happened automatically
   - Check balances increased for all contributors

### Demo Script:
```
1. "Here's a collaborative story platform on Monad"
2. Connect wallet → Add first line
3. Switch account → "Now someone else adds a line"
4. Make donation → "Backers can support the story"
5. Continue to 10 lines
6. "Watch: Monad's 1-second blocks = instant updates"
7. Story completes → "Auto-distribution to all contributors!"
8. Check wallet balances → "Everyone got paid instantly"
```

---

## Summary

### Critical Answers:

**Q: Which wallet will the page be connected to?**
**A**: Whatever wallet the USER connects (their MetaMask, WalletConnect, etc.)

**Q: Where to send testnet tokens?**
**A**: Your MetaMask address(es) - the ones you'll use for demo

**Q: Is the error blocking?**
**A**: No, it's just the block explorer trying to connect to local chain. Ignore it.

### You Need MON For:
- ✅ Contract deployment (~0.5 MON)
- ✅ Adding lines to story (~0.01 MON per line)
- ✅ Making donations (whatever amount)
- ✅ Gas fees for all transactions

### You DON'T Need:
- ❌ Local Foundry chain (deploy directly to testnet)
- ❌ Special wallet setup (MetaMask is fine)
- ❌ Multiple keystores (use MetaMask accounts)
