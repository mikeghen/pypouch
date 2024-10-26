export const PYUSD_ADDRESS = '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8';
export const PYPOUCH_CONTRACT_ADDRESS = '0xb41174D2c1a587f894F5584748e1D30f3781e348';

export const pyusdContractConfig = {
    address: PYUSD_ADDRESS,
    abi: [
        {"type":"function","name":"transfer","inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable"},
        {"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"approve","inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable"},
        {"type":"function","name":"allowance","inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
    ]
} as const;

export const pyPouchContractConfig = {
    address: PYPOUCH_CONTRACT_ADDRESS,
    abi: [
        {"type":"function","name":"deposit","inputs":[{"name":"amount","type":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
        {"type":"function","name":"withdraw","inputs":[{"name":"amount","type":"uint256"},{"name":"receiver","type":"address"}],"outputs":[],"stateMutability":"nonpayable"},
        {"type":"function","name":"getNetDeposits","inputs":[{"name":"user","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"getAPYUSDBalance","inputs":[],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
    ]
} as const;

export const aavePoolConfig = {
    address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2' as const,
    abi: [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "asset",
                    "type": "address"
                }
            ],
            "name": "getReserveData",
            "outputs": [
                {
                    "components": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "data",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct DataTypes.ReserveConfigurationMap",
                            "name": "configuration",
                            "type": "tuple"
                        },
                        {
                            "internalType": "uint128",
                            "name": "liquidityIndex",
                            "type": "uint128"
                        },
                        {
                            "internalType": "uint128",
                            "name": "currentLiquidityRate",
                            "type": "uint128"
                        }
                    ],
                    "internalType": "struct DataTypes.ReserveData",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
} as const;