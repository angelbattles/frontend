const PetsAbi = [
  {
    inputs: [],
    name: 'ABTokenDataContract',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pet1Id',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pet2Id',
        type: 'uint256',
      },
    ],
    name: 'Breed',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_ABTokenDataContract',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_HaloContract',
        type: 'address',
      },
    ],
    name: 'DataContacts',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'HaloContract',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newSeraphim',
        type: 'address',
      },
    ],
    name: 'addSERAPHIM',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'auraDecrease',
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
    name: 'auraIncrease',
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
    name: 'auraIncreaseChance',
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
    name: 'breedingDelay',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'breedingPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'creatorAddress',
    outputs: [
      {
        internalType: 'address payable',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deadAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'pet1CardSeries',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'pet2CardSeries',
        type: 'uint8',
      },
    ],
    name: 'getNewPetLine',
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
    inputs: [
      {
        internalType: 'uint8',
        name: 'pet1CardSeries',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'pet2CardSeries',
        type: 'uint8',
      },
    ],
    name: 'getNewPetPower',
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
    name: 'getParameters',
    outputs: [
      {
        internalType: 'uint16',
        name: '_minRetireAura',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '_maxRetireAura',
        type: 'uint16',
      },
      {
        internalType: 'uint64',
        name: '_breedingDelay',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: '_breedingPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_upgradeChance',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_auraIncrease',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_auraDecrease',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'maxRandom',
        type: 'uint16',
      },
      {
        internalType: 'uint8',
        name: 'min',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: 'privateAddress',
        type: 'address',
      },
    ],
    name: 'getRandomNumber',
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
    name: 'kill',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxRetireAura',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minRetireAura',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_oldSeraphim',
        type: 'address',
      },
    ],
    name: 'removeSERAPHIM',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'pet1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pet2',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pet3',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pet4',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pet5',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pet6',
        type: 'uint256',
      },
    ],
    name: 'retirePets',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'seraphims',
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
        internalType: 'uint16',
        name: '_minRetireAura',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: '_maxRetireAura',
        type: 'uint16',
      },
      {
        internalType: 'uint64',
        name: '_breedingDelay',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_breedingPrice',
        type: 'uint64',
      },
      {
        internalType: 'uint8',
        name: '_upgradeChance',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_auraIncrease',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: '_auraDecrease',
        type: 'uint8',
      },
    ],
    name: 'setParameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSeraphims',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'upgradeChance',
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

export default PetsAbi;
