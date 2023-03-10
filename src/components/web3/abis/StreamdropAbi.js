const streamdropAbi = [
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Claim',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'claimant',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'ClaimForOtherAddress',
        type: 'event',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'allStreams',
        outputs: [
            { internalType: 'uint64', name: 'id', type: 'uint64' },
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'balance', type: 'uint256' },
            { internalType: 'uint256', name: 'initialBalance', type: 'uint256' },
            { internalType: 'uint64', name: 'endTime', type: 'uint64' },
            { internalType: 'uint64', name: 'startTime', type: 'uint64' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
            { internalType: 'bytes32[]', name: 'proof', type: 'bytes32[]' },
        ],
        name: 'claimStream',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'newAddress', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
            { internalType: 'bytes32[]', name: 'proof', type: 'bytes32[]' },
        ],
        name: 'claimStreamForOtherAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_to', type: 'address' }],
        name: 'claimTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claimedBalance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
        name: 'getClaimAmount',
        outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'getLeaf',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'hasClaimed',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'incentivizedStreamsInitialized',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'merkleRoot',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'numStreams',
        outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_battleMountainAddress',
                type: 'address',
            },
            { internalType: 'address', name: '_battleArenaAddress', type: 'address' },
            { internalType: 'address', name: '_lightAngelAddress', type: 'address' },
            { internalType: 'address', name: '_darkAngelAddress', type: 'address' },
            { internalType: 'address', name: '_freeCardAddress', type: 'address' },
            { internalType: 'address', name: '_l2CardsAddress', type: 'address' },
        ],
        name: 'startIncentivizedStreams',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_treasuryAddress', type: 'address' },
        ],
        name: 'startTreasuryStream',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'streamForAddress',
        outputs: [
            { internalType: 'uint64', name: 'id', type: 'uint64' },
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'balance', type: 'uint256' },
            { internalType: 'uint256', name: 'initialBalance', type: 'uint256' },
            { internalType: 'uint64', name: 'endTime', type: 'uint64' },
            { internalType: 'uint64', name: 'startTime', type: 'uint64' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'streamLength',
        outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'tokenAddress',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'treasuryStreamInitialized',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
            { internalType: 'bytes32[]', name: 'proof', type: 'bytes32[]' },
        ],
        name: 'verifyProof',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'pure',
        type: 'function',
    },
];
export default streamdropAbi;
