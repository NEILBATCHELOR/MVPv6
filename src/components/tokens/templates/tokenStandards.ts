export const TOKEN_STANDARDS = [
  {
    value: "ERC-20",
    label: "ERC-20 (Fungible Token)",
    description:
      "Standard for fungible tokens where each token is identical and interchangeable",
    mandatoryFunctions: [
      "totalSupply()",
      "balanceOf(address)",
      "transfer(address,uint256)",
      "transferFrom(address,address,uint256)",
      "approve(address,uint256)",
      "allowance(address,address)",
    ],
    optionalFunctions: ["name()", "symbol()", "decimals()"],
    configOptions: [
      "Initial Supply",
      "Minting/Burning",
      "Pausable",
      "Access Control",
    ],
  },
  {
    value: "ERC-721",
    label: "ERC-721 (Non-Fungible Token)",
    description:
      "Standard for non-fungible tokens where each token is unique and not interchangeable",
    mandatoryFunctions: [
      "balanceOf(address)",
      "ownerOf(uint256)",
      "safeTransferFrom(address,address,uint256)",
      "transferFrom(address,address,uint256)",
      "approve(address,uint256)",
      "getApproved(uint256)",
      "setApprovalForAll(address,bool)",
      "isApprovedForAll(address,address)",
    ],
    optionalFunctions: ["name()", "symbol()", "tokenURI(uint256)"],
    configOptions: ["Base URI", "Minting", "Royalties", "Metadata Storage"],
  },
  {
    value: "ERC-1155",
    label: "ERC-1155 (Multi Token)",
    description:
      "Standard for contracts that manage multiple token types (both fungible and non-fungible)",
    mandatoryFunctions: [
      "balanceOf(address,uint256)",
      "balanceOfBatch(address[],uint256[])",
      "setApprovalForAll(address,bool)",
      "isApprovedForAll(address,address)",
      "safeTransferFrom(address,address,uint256,uint256,bytes)",
      "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
    ],
    optionalFunctions: ["uri(uint256)"],
    configOptions: ["URI", "Minting", "Batch Operations", "Supply Tracking"],
  },
  {
    value: "ERC-1400",
    label: "ERC-1400 (Security Token)",
    description:
      "Standard for security tokens with transfer restrictions and compliance controls",
    mandatoryFunctions: [
      "getDocument(bytes32)",
      "setDocument(bytes32,string,bytes32)",
      "isControllable()",
      "isIssuable()",
      "canTransferByPartition(bytes32,address,address,uint256,bytes)",
      "transferByPartition(bytes32,address,uint256,bytes)",
    ],
    optionalFunctions: [
      "controllers()",
      "authorizeOperator(address)",
      "revokeOperator(address)",
      "isOperator(address,address)",
    ],
    configOptions: [
      "Partitions",
      "Transfer Restrictions",
      "Document Management",
      "Compliance Controls",
    ],
  },
  {
    value: "ERC-3525",
    label: "ERC-3525 (Semi-Fungible Token)",
    description:
      "Standard for semi-fungible tokens with slot-based value system",
    mandatoryFunctions: [
      "balanceOf(address)",
      "ownerOf(uint256)",
      "transferFrom(address,address,uint256)",
      "slotOf(uint256)",
      "valueDecimals()",
      "valueOf(uint256)",
      "transferValueFrom(uint256,uint256,uint256)",
    ],
    optionalFunctions: ["name()", "symbol()", "slotURI(uint256)"],
    configOptions: ["Slots", "Values", "Decimals", "Tranches"],
  },
  {
    value: "ERC-4626",
    label: "ERC-4626 (Tokenized Vault)",
    description: "Standard for tokenized yield-bearing vaults",
    mandatoryFunctions: [
      "asset()",
      "totalAssets()",
      "convertToShares(uint256)",
      "convertToAssets(uint256)",
      "maxDeposit(address)",
      "previewDeposit(uint256)",
      "deposit(uint256,address)",
      "maxMint(address)",
      "previewMint(uint256)",
      "mint(uint256,address)",
      "maxWithdraw(address)",
      "previewWithdraw(uint256)",
      "withdraw(uint256,address,address)",
      "maxRedeem(address)",
      "previewRedeem(uint256)",
      "redeem(uint256,address,address)",
    ],
    optionalFunctions: [],
    configOptions: [
      "Underlying Asset",
      "Yield Strategy",
      "Deposit/Withdrawal Limits",
      "Fee Structure",
    ],
  },
];
