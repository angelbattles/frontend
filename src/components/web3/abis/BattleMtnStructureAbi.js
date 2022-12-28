const BattleMtnStructureAbi = [
  {
    inputs: [],
    name: 'definePaths',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'panel',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'spot',
        type: 'uint8',
      },
    ],
    name: 'getSpotFromPanel',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'position',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'to',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: 'battleMtnDataContract',
        type: 'address',
      },
    ],
    name: 'isValidMove',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    name: 'specialLocation',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export default BattleMtnStructureAbi;
