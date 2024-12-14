export const AVAILABLE_ASSETS = [
  "eip155:11155111/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ethereum sepolia
  "eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // kaia kairos
  "eip155:8217/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // kaia
  "eip155:421614/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // arbitrum sepolia
  "eip155:84532/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // base sepolia
  "eip155:11124/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // abstract testnet
  "eip155:2522/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // fraxtal testnet
  "eip155:80084/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // berachain testnet bartio
  "eip155:4201/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // lukso testnet
  "eip155:1287/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // moonbase alpha testnet
  "eip155:2710/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // morph testnet
  "eip155:534351/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // scroll sepolia
  "eip155:420420421/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // westend asset hub polkadot 
  "eip155:169/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // manta pacific mainnet
  "eip155:3441006/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // manta sepolia testnet
  "polkadot:94220/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // polkadot paseo testnet
  "polkadot:0/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // polkadot relay chain
  "polkadot:6/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // polkadot bifrost parachain
  // "sui:2/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // sui testnet
];

export const ALL_SUPPORTED_ASSETS = [
  "eip155:11155111/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // ethereum sepolia
  "eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // kaia kairos
  "eip155:1001/erc20:0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746", // kaia kairos:test USDC:tUSDC
  "eip155:1001/erc20:0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d", // kaia kairos:test USDT:tUSDT
  "eip155:8217/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // kaia
  "eip155:421614/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // arbitrum sepolia
  "eip155:84532/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // base sepolia
  "eip155:11124/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // abstract testnet
  "eip155:2522/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // fraxtal testnet
  "eip155:80084/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // berachain testnet bartio
  "eip155:4201/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // lukso testnet
  "eip155:1287/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // moonbase alpha testnet
  "eip155:2710/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // morph testnet
  "eip155:534351/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // scroll sepolia
  "eip155:420420421/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // westend asset hub polkadot
  "eip155:169/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // manta pacific mainnet
  "eip155:169/slip44:0x95CeF13441Be50d20cA4558CC0a27B601aC544E5", // manta pacific mainnet token MANTA
  "eip155:3441006/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // manta sepolia testnet
  "polkadot:94220/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // polkadot paseo testnet
  "polkadot:0/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // polkadot relay chain
  "polkadot:6/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // polkadot bifrost parachain
  // "sui:2/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // sui testnet
]

export const ALL_SUPPORTED_ASSETS_V2 = [
  "eip155:11155111/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Ether:ETH:18/eth.svg:eth.svg", // ethereum sepolia
  "eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Kaia:KAIA:18/kaia.svg:kaia.svg", // kaia kairos
  "eip155:1001/erc20:0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746:Testnet:Test USDC:tUSDC:6/usdc.svg:kaia.svg", // kaia kairos:test USDC:tUSDC
  "eip155:1001/erc20:0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d:Testnet:Test USDT:tUSDT:6/usdt.svg:kaia.svg", // kaia kairos:test USDT:tUSDT
  "eip155:8217/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Mainnet:Kaia:KAIA:18/kaia.svg:kaia.svg", // kaia
  "eip155:421614/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Ether:ETH:18/eth.svg:arb.svg", // arbitrum sepolia
  "eip155:84532/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Ether:ETH:18/eth.svg:base.svg", // base sepolia
  "eip155:11124/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Ether:ETH:18/eth.svg:abs.svg", // abstract testnet
  "eip155:2522/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Frax Ether:frxETH:18/eth.svg:frax.svg", // fraxtal testnet
  "eip155:80084/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Bera Token:BERA:18/bera.svg:bera.svg", // berachain testnet bartio
  "eip155:4201/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Lukso:LYXT:18/lyxt.svg:lyxt.svg", // lukso testnet
  "eip155:1287/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Dev Token:DEV:18/moonbeam.svg:moonbeam.svg", // moonbase alpha testnet
  "eip155:2710/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Ether:ETH:18/eth.svg:morph.svg", // morph testnet
  "eip155:534351/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Ether:ETH:18/eth.svg:scroll.svg", // scroll sepolia
  "eip155:420420421/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Westend:WND:18/dot.svg:dot.svg", // westend asset hub polkadot
  "eip155:169/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Mainnet:Ether:ETH:18/eth.svg:manta.svg", // manta pacific mainnet
  "eip155:169/slip44:0x95CeF13441Be50d20cA4558CC0a27B601aC544E5:Mainnet:Manta token:MANTA:18/manta.svg:manta.svg", // manta pacific mainnet token MANTA
  "eip155:3441006/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Testnet:Ether:ETH:18/manta.svg:manta.svg", // manta sepolia testnet
  "polkadot:42/slip44:1ddddddddddddddddddddddddddddddddddddddddddddddd:Testnet:Paseo:PAS:10/paseo.svg:dot.svg", // polkadot paseo testnet
  "polkadot:0/slip44:1ddddddddddddddddddddddddddddddddddddddddddddddd:Relay:Polkadot:DOT/dot.svg:dot.svg", // polkadot relay chain
  "polkadot:6/slip44:1ddddddddddddddddddddddddddddddddddddddddddddddd:Mainnet:Bifrost:BNC/bifrost.svg:dot.svg", // polkadot bifrost parachain
  // "sui:2/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // sui testnet
]

export const ALL_SUPPORTED_MAINNET_ASSETS = [
  "eip155:8217/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Kaia Mainnet:Kaia:KAIA:18/kaia.svg:kaia.svg", // kaia
  "eip155:169/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE:Manta Pacific:Ether:ETH:18/eth.svg:manta.svg", // manta pacific mainnet
  "eip155:169/slip44:0x95CeF13441Be50d20cA4558CC0a27B601aC544E5:Manta Pacific:Manta token:MANTA:18/manta.svg:manta.svg", // manta pacific mainnet token MANTA
]