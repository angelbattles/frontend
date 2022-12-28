//File abcpackInfo.js contains information about the various packs in the game.
//Most of this information is also on the blockchain, but this file loads up constant information much more quickly than reading from the chain.

//object containing information strings, etc about various angel battle packs. The pack id is the position.
const ABPackInfo = [
  {
    id: 'free',
    name: 'free_pack',
    title: 'Free Pack',
    cost: 0,
    angels: [0],
    angelsDescription: '1 barakel angel',
    pets: [24, 25, 26, 27],
    petsDescription: 'ONE RANDOM 1-STAR PET',
    accessories: [],
    image: 'free.png',
  },
  {
    id: 'bronze',
    name: 'bronze_pack',
    title: 'Bronze Pack',
    cost: 10,
    angels: [4, 5, 6, 7, 8, 9],
    angelsDescription: '1 random low to mid level angel',
    pets: [28, 29, 30, 31],
    petsDescription: 'ONE RANDOM 2-STAR PET',
    accessories: [],
    image: 'bronze.png',
  },
  {
    id: 'silver',
    name: 'silver_pack',
    title: 'Silver Pack',
    cost: 25,
    angels: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    angelsDescription: '1 random low to mid to high level angel',
    pets: [28, 29, 30, 31],
    petsDescription: 'ONE RANDOM 2-STAR PET',
    accessories: [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
    accessoriesDescription: 'ONE RANDOM ACCESSORY',
    image: 'silver.png',
  },
  {
    id: 'gold',
    name: 'gold_pack',
    title: 'Gold Pack',
    cost: 50,
    angels: [19, 20, 21, 22, 23],
    angelsDescription: '1 random mid to high level angel',
    pets: [32, 33, 34, 35],
    petsDescription: 'ONE RANDOM 3-STAR PET',
    accessories: [
      43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
    ],
    accessoriesDescription: 'ONE RANDOM ACCESSORY',
    image: 'gold.png',
  },
  {
    id: 'special',
    name: 'special_pack',
    title: 'Special Pack',
    cost: 1000,
    angels: [1, 2, 3, 59, 60, 65, 66, 67],
    angelsDescription: 'Chance to get the best cards',
    pets: [],
    petsDescription: '',
    accessories: [],
    accessoriesDescription: '',
    image: 'ultimate.png',
  },
];

export default ABPackInfo;
