const CustomBattleMtnDataAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "angelId",
				"type": "uint256"
			}
		],
		"name": "Mudslide",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "ABTokenDataContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newSeraphim",
				"type": "address"
			}
		],
		"name": "addSERAPHIM",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "toSpot",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "angelId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "petId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accessoryId",
				"type": "uint256"
			}
		],
		"name": "addTeam",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "angelId",
				"type": "uint256"
			},
			{
				"internalType": "uint16",
				"name": "power",
				"type": "uint16"
			},
			{
				"internalType": "uint8",
				"name": "toSpot",
				"type": "uint8"
			}
		],
		"name": "applyAuraColorDifference",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "angelId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "petId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accessoryId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "attacker",
				"type": "bool"
			},
			{
				"internalType": "uint8",
				"name": "toSpot",
				"type": "uint8"
			}
		],
		"name": "applyConditions",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "newPower",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "newSpeed",
				"type": "uint8"
			},
			{
				"internalType": "uint16",
				"name": "newRed",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "newYellow",
				"type": "uint16"
			},
			{
				"internalType": "uint16",
				"name": "newBlue",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "bigAuraEffect",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "Id",
				"type": "uint256"
			}
		],
		"name": "cardOnBattleMtn",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "cardsOnBattleMtn",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "cardsProhibited",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "changeConditions",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "angelId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "petId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accessoryId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "fromSpot",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "checkBattleParameters",
		"outputs": [],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "claimOwnerBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "creatorAddress",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "definePaths",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "delayTime",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "attackerAura",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "defenderAura",
				"type": "uint8"
			}
		],
		"name": "findAngelColorDifference",
		"outputs": [
			{
				"internalType": "int8",
				"name": "",
				"type": "int8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "position",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "actionNumber",
				"type": "uint8"
			}
		],
		"name": "getAction",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "angelId",
				"type": "uint256"
			}
		],
		"name": "getAuraCode",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_cardSeriesId",
				"type": "uint8"
			}
		],
		"name": "getCardRestricted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentConditions",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "auraBonus",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "petTypeBonus",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "lightAngelBonus",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "attackerBonus",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "petLevelBonus",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "superBerakiel",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "bridge1",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "bridge2",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "bridge3",
				"type": "bool"
			},
			{
				"internalType": "uint8",
				"name": "bonusLevel",
				"type": "uint8"
			},
			{
				"internalType": "uint64",
				"name": "lastConditionChangeTime",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getOwnerBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPayoutInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "lastPayoutTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastPayoutValue",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "lastPayoutPanel",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reservedBalance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_player",
				"type": "address"
			}
		],
		"name": "getPlayerAllowed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "maxRandom",
				"type": "uint16"
			},
			{
				"internalType": "uint8",
				"name": "min",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "privateAddress",
				"type": "address"
			}
		],
		"name": "getRandomNumber",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_position",
				"type": "uint8"
			}
		],
		"name": "getTeamByPosition",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "position",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "angelId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "petId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accessoryId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "slogan",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "round",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "spotContested",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "desiredAction",
				"type": "uint8"
			},
			{
				"internalType": "uint16",
				"name": "power",
				"type": "uint16"
			},
			{
				"internalType": "uint8",
				"name": "aura",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "petAuraStatus",
				"type": "uint8"
			}
		],
		"name": "getTurnResult",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "action",
				"type": "uint8"
			},
			{
				"internalType": "uint16",
				"name": "resultValue",
				"type": "uint16"
			},
			{
				"internalType": "uint8",
				"name": "newPetAuraStatus",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initMountain",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "angelSeriesId",
				"type": "uint8"
			}
		],
		"name": "isLightAngel",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "position",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "to",
				"type": "uint8"
			}
		],
		"name": "isValidMove",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastConditionChange",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mudslideChance",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "ownerBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playersAllowed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "playersRestricted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "powerBoost",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_oldSeraphim",
				"type": "address"
			}
		],
		"name": "removeSERAPHIM",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "seraphims",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "position",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "action0",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "action1",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "action2",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "action3",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "action4",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "action5",
				"type": "uint8"
			}
		],
		"name": "setActions",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_cardDataContract",
				"type": "address"
			}
		],
		"name": "setCardDataContact",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_cardSeries",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "_prohibited",
				"type": "bool"
			}
		],
		"name": "setCardProhibitedStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_player",
				"type": "address"
			}
		],
		"name": "setPlayerAllowed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "position",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "_slogan",
				"type": "string"
			}
		],
		"name": "setSlogan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "smallAuraEffect",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "specialLocation",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "fromSpot",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "toSpot",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "attacker",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "defender",
				"type": "uint256"
			}
		],
		"name": "switchTeams",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSeraphims",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "spot",
				"type": "uint8"
			},
			{
				"internalType": "uint64",
				"name": "angelId",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "petId",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "accessoryId",
				"type": "uint64"
			}
		],
		"name": "verifyPosition",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

export default CustomBattleMtnDataAbi;
