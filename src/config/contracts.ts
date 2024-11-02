export const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS as `0x${string}`;
export const ATOKEN_ADDRESS = import.meta.env.VITE_ATOKEN_ADDRESS as `0x${string}`;

// PYUSD Token Configuration
export const tokenContractConfig = {
    abi: [
        {"type":"function","name":"transfer","inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable"},
        {"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"approve","inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable"},
        {"type":"function","name":"allowance","inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string"}],"stateMutability":"view"},
    ]
} as const;

// PyPouchFactory Configuration
export const PYPOUCH_FACTORY_ADDRESS = '0x9e42737Bc5FCEE35bcCe8B8F277F266C01a20817' as `0x${string}`;

export const pyPouchFactoryConfig = {
    address: PYPOUCH_FACTORY_ADDRESS,
    abi: [
        {
            "inputs": [
                { "internalType": "address", "name": "_pyusdToken", "type": "address" },
                { "internalType": "address", "name": "_aPYUSD", "type": "address" },
                { "internalType": "address", "name": "_aavePool", "type": "address" }
            ],
            "name": "createPyPouch",
            "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
            "name": "getPyPouchAddress",
            "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
            "stateMutability": "view",
            "type": "function"
        }
    ]
} as const;

// PyPouch Instance Configuration
export const pyPouchConfig = {
    abi: [
        {"type":"function","name":"deposit","inputs":[{"name":"amount","type":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},
        {"type":"function","name":"withdraw","inputs":[{"name":"amount","type":"uint256"},{"name":"to","type":"address"}],"outputs":[],"stateMutability":"nonpayable"},
        {"type":"function","name":"initialize","inputs":[{"name":"owner","type":"address"},{"name":"pyusdToken","type":"address"},{"name":"aPYUSD","type":"address"},{"name":"aavePool","type":"address"}],"outputs":[],"stateMutability":"nonpayable"},
    ]
} as const;

export const aavePoolConfig = {
    address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2' as `0x${string}`,
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
