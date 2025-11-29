# Smart Testnet Token Distribution Strategy

## Your Approach (Recommended!)

Instead of the default workflow, use this smarter approach:

### Why This is Better:
1. ✅ **Single Source**: All testnet MON in one place (MetaMask)
2. ✅ **Flexibility**: Easy to distribute as needed
3. ✅ **Testing**: Keep tokens for app interaction
4. ✅ **Recovery**: If you forget cast wallet password, your main funds are safe

---

## Step-by-Step Setup

### 1. Get Your New Cast Wallet Address

**New wallet created**:
- Address: `0x10A39F3c9260ABCB61E14D8ADF18De6598Cc1c57`
- Private Key: `0x67238cd7f8d332a3bf77fe3211329abeb650a1583d4a502523829ea026366da6`

**Import to keystore** (when prompted for password, use something simple like "hackathon"):
```bash
cast wallet import monad-hackathon --private-key 0x67238cd7f8d332a3bf77fe3211329abeb650a1583d4a502523829ea026366da6
```

**Verify the address**:
```bash
cast wallet address --account monad-hackathon
# Should output: 0x10A39F3c9260ABCB61E14D8ADF18De6598Cc1c57
```

---

### 2. Request Testnet Tokens to Your MetaMask

**Give organizers**: Your MetaMask address (NOT the cast wallet)

**Example**: If your MetaMask is `0xYourMetaMaskAddress...`
- Request testnet MON to that address
- This keeps all funds in one secure, familiar place

**Recommended amount to request**: 
- 3-5 MON total
- Deployment costs ~0.5 MON
- Keep rest for testing interactions

---

### 3. Distribution Strategy

Once you have testnet MON in MetaMask:

#### A. Fund Cast Wallet for Deployment
```bash
# In MetaMask:
# - Switch to Monad Testnet
# - Send 1 MON to: 0x10A39F3c9260ABCB61E14D8ADF18De6598Cc1c57
```

**Why 1 MON?**
- Deployment: ~0.5 MON
- Safety buffer: ~0.5 MON
- Enough for multiple deployments if needed

#### B. Keep in MetaMask for Testing
- Remaining ~2-4 MON
- Use for app interactions
- Add story lines
- Make donations
- Test the full user experience

---

### 4. Deploy to Monad Testnet

Once cast wallet is funded:

```bash
cd packages/foundry

# Deploy using the new keystore
forge create contracts/ExquisiteMonad.sol:ExquisiteMonad \
  --rpc-url monad_testnet \
  --account monad-hackathon \
  --broadcast

# Or use the deployment script
forge script script/DeployExquisiteMonad.s.sol \
  --rpc-url monad_testnet \
  --account monad-hackathon \
  --broadcast
```

**Enter password when prompted** (the one you set during import)

---

### 5. Update Frontend Config for Testnet

**Enable Monad testnet in config**:

```typescript
// packages/nextjs/scaffold.config.ts
targetNetworks: [monadTestnet], // Remove foundry, use only testnet for demo
```

---

### 6. Generate ABIs After Deployment

```bash
cd packages/foundry
make generate-abis
```

This updates `/packages/nextjs/contracts/deployedContracts.ts` with your testnet deployment.

---

## Testing the App

### With MetaMask (Your Main Tokens)

1. **Start frontend**:
```bash
cd packages/nextjs
yarn start
```

2. **Open app**: `http://localhost:3000/my-app`

3. **Connect MetaMask**:
   - Click the prominent "Connect Wallet" button
   - Select MetaMask
   - Switch to Monad Testnet

4. **Interact**:
   - Add lines to the story (costs ~0.01 MON)
   - Make donations (any amount)
   - Test until story completes (10 lines)
   - Verify revenue distribution

### Multiple Account Testing

**Create additional MetaMask accounts**:
1. MetaMask → Create Account
2. Make Accounts 2, 3, etc.
3. Send small amounts from your main account (0.5 MON each)
4. Switch accounts in MetaMask to simulate multiple users

---

## Wallet Addresses Summary

| Wallet | Purpose | Needs Funding |
|--------|---------|--------------|
| **MetaMask** (your main) | Testing, interactions, donations | ✅ YES - request from organizers |
| **Cast Wallet** `0x10A3...c57` | Contract deployment only | ✅ YES - transfer from MetaMask |
| **scaffold-eth-default** | Old wallet (password forgotten) | ❌ NO - deprecated |

---

## Benefits of This Approach

### Security
- Main funds in familiar MetaMask
- Deployment wallet separate (security best practice)
- Can regenerate cast wallet if needed

### Flexibility
- Easy to send tokens between accounts
- Quick to create test accounts
- Simple to distribute for multi-user demo

### Practical
- One request to organizers (MetaMask)
- You control distribution
- Can adjust amounts as needed

---

## If Cast Wallet Password is Forgotten Again

**No problem! Just recreate**:
```bash
# Generate new wallet
cast wallet new

# Import with NEW name
cast wallet import monad-hackathon-2 --private-key <new_private_key>

# Send 1 MON from MetaMask to new address
# Deploy again
```

**Your MetaMask tokens are always safe!**

---

## Quick Reference Commands

### Check Balances
```bash
# Cast wallet balance
cast balance 0x10A39F3c9260ABCB61E14D8ADF18De6598Cc1c57 --rpc-url https://testnet-rpc.monad.xyz

# MetaMask balance (check in MetaMask UI or use your address)
cast balance <your_metamask_address> --rpc-url https://testnet-rpc.monad.xyz
```

### Deploy Contract
```bash
forge create contracts/ExquisiteMonad.sol:ExquisiteMonad \
  --rpc-url monad_testnet \
  --account monad-hackathon \
  --broadcast
```

### Send Tokens (from MetaMask to Cast Wallet)
Use MetaMask UI or:
```bash
cast send 0x10A39F3c9260ABCB61E14D8ADF18De6598Cc1c57 \
  --value 1ether \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key <your_metamask_private_key>
```

---

## Summary

✅ **Get tokens**: Request to your MetaMask from organizers  
✅ **Split wisely**: 1 MON to cast wallet, rest in MetaMask  
✅ **Deploy**: Use cast wallet keystore  
✅ **Test**: Use MetaMask for all app interactions  
✅ **Demo**: Easy to show multi-user with MetaMask accounts

**This strategy gives you maximum flexibility and security for your hackathon demo!**
