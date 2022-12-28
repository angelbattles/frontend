export const angelTeamActions = [
    'is ready',
    'bravely strikes',
    'Gets sword tangled up in wings and misses a turn', // decided against using
    'Unleashes a furious purple strike at a vital artery for a sudden kill!',

    //4
    'adopts a stalwart defensive position',
    'tries to flee like a coward, but fails',
    'Escapes to fight another day',
    'Calls on his pet',
    //aura bursts
    'Whistles and calls pet back',
    'Unleashes a purple aura, but fails',
    'unleashes a purple aura for a sudden kill!',
    'unleashes an green aura for 100 hp bonus!',
    'unleashes a yellow aura that reduces enemy defense to 0',
    'unleashes an orange aura for +75 defense',
    'leaves it all out there with a desperate attack',
    //pet actions
    'rushes into the battle but trips',
    'unleashes a boring attack',
    'attacks with all its might',
    'attacks for 50, doubles speed, and heals',
    'valiantly perishes'
];

//Monster
//35% attack
//10% Defense buff
//15% Heal
//5% runs away
//5% desperate attack
//10% specific turn wasting attack
//10% specific strong attack
//5% specific debuf

export const monsterActions = [
    'appears',
    'Lauches an attack',
    'digs in to increase defense',
    'munches a delicious healing herb',
    'runs away like a little coward',
    'makes a desperate strike',
    //0 cornu
    'wastes a turn preening himself',
    'slices with his wing',
    'emits a piercing scream that lowers your defense buff to 0',
    //1 moko
    'gets caught up playing with his tail',
    'leaps forward and hits with both feet and claws',
    'gets really mad and increases attack by 5',

    //2 biersal
    'spills some beer and slips on it',
    'calls upon his friends',
    'takes a drink that increases his power by 20',
    //3 nix
    'gets caught up in her own enchanting song',
    'smacks you in the face with her tail',
    'accidentally increases your attack by 10',
    //4 colo colo
    'Looks at your blood and licks its lips',
    'Latches on to your jugular',
    'Drains your blood and lowers your attack by 8',
    //5 foawr
    'thinks too hard and confuses himself',
    'club... BASH!',
    'gets REALLY mad and increases attack by 35',
    //6 lunkus
    'swings from a tree branch and taunts you',
    'grabs your arm and swings you back and forth',
    'draws a sigil that sets your hp to 50',
    //7 pamba
    'sees a fish, has lunch instead of attacking',
    'splash and gash!',
    'sharpens teeth for +50 attack!',
    //8 dire moko
    'does an impressive flip',
    'launches a whirlwind attack',
    'draws a sigil that ups hp by 350',
    //9 lunkus captain
    'flexes his arm and admires his bicep',
    'launches off his hands and  hits with both feet',
    'meditates to increase defense by 75',
    //10 naughty nix
    'gives a suggestive wink',
    'unleashes her full fury',
    'heals and increases defense',
    //11 great foar
    'just sits there with a stupid grin',
    'pummels you with his stick',
    'flexes to heal and increase attack',
    //12 liquid metal cornu
    'is mesmerized',
    'strikes before you can blink',
    'meditates to increase all attributes!',
    // all monsters
    'screams in pain and fades away'
];

export const Monsters = [
    { name: 'Cornu', experience: 1 },
    { name: 'Moko', experience: 1 },
    { name: 'Biersal', experience: 1 },
    { name: 'Nix', experience: 1 },
    { name: 'Colo Colo', experience: 3 },
    { name: 'Foawr', experience: 3 },
    { name: 'Lunkus', experience: 3 },
    { name: 'Pamba', experience: 3 },
    { name: 'Dire Moko', experience: 5 },
    { name: 'Lunkus Captain', experience: 5 },
    { name: 'Naughty Nix', experience: 5 },
    { name: 'Great Foawr', experience: 5 },
    { name: 'Liquid Metal Cornu', experience: 10 },
];

export const battleStatus = [
    { 101: 'Angel Won' },
    { 102: 'Monster Won' },
    { 103: 'Angel ran away' },
    { 104: 'Monster ran away' },
];
