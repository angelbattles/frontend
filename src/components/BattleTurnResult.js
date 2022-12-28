import React from 'react';
import './css/HeaderSection.css';

function BattleTurnResult(props) {
    var actionColor = 'red';
    var subject = props.subject;
    var resultValue = props.resultValue;
    var action = props.action;
    var number = props.number;

    if (
        action === 'rushes into the battle but trips' ||
        action === 'unleashes a boring attack' ||
        action === 'attacks with all its might' ||
        action === 'attacks for 50, doubles speed, and heals'
    ) {
        subject = props.pet;
    }
    if (action === 'munches a delicious healing herb') {
        actionColor = 'green';
    }

    //angel actions that shouldn't have number
    if (
        action === 'is ready' ||
        action ===
        'Unleashes a furious purple strike at a vital artery for a sudden kill!' ||
        action === 'tries to flee like a coward, but fails' ||
        action === 'Whistles and calls pet back' ||
        action === 'Unleashes a purple aura, but fails' ||
        action === 'unleashes a purple aura for a sudden kill!' ||
        action === 'unleashes an green aura for 100 hp bonus!' ||
        action === 'unleashes a yellow aura that reduces enemy defense to 0' ||
        action === 'unleashes an orange aura for +75 defense' ||
        action === 'Escapes to fight another day'
    ) {
        resultValue = '-1';
    }
    //monster actions that shouldn't have numbers
    if (
        action === 'appears' ||
        action === 'runs away like a little coward' ||
        action === 'wastes a turn preening himself' ||
        action === 'emits a piercing scream that lowers your defense buff to 0' ||
        action === 'gets caught up playing with his tail' ||
        action === 'gets really mad and increases attack by 5' ||
        action === 'spills some beer and slips on it' ||
        action === 'takes a drink that increases his power by 20' ||
        action === 'gets caught up in her own enchanting song' ||
        action === 'accidentally increases your attack by 10' ||
        action === 'Looks at your blood and licks its lips' ||
        action === 'Drains your blood and lowers your attack by 8' ||
        action === 'thinks too hard and confuses himself' ||
        action === 'is victorious' ||
        action === 'valiantly perishes'
    ) {
        resultValue = '-1';
    }
    if (
        action === 'gets REALLY mad and increases attack by 35' ||
        action === 'swings from a tree branch and taunts you' ||
        action === 'draws a sigil that sets your hp to 50' ||
        action === 'sharpens teeth for +50 attack!' ||
        action === 'sees a fish, has lunch instead of attacking' ||
        action === 'does an impressive flip' ||
        action === 'draws a sigil that ups hp by 350' ||
        action === 'meditates to increase defense by 75' ||
        action === 'flexes his arm and admires his bicep' ||
        action === 'gives a suggestive wink' ||
        action === 'just sits there with a stupid grin' ||
        action === 'is mesmerized' ||
        action === 'meditates to increase all attributes!' ||
        action === 'flexes to heal and increase attack' ||
        action === 'screams in pain and fades away'
    ) {
        resultValue = '-1';
    }
    if (
        action === 'adopts a stalwart defensive position' ||
        action === 'digs in to increase defense'
    ) {
        actionColor = 'orange';
    }

    return (
        <div className={`eight wide ui ${props.color} segment`}>
            {resultValue !== '-1' && (
                <h2>
                    {' '}
                    {number}   {subject} {action} for{' '}
                    <span style={{ color: `${actionColor}` }}> {resultValue}</span>
                </h2>
            )}
            {resultValue === '-1' && (
                <h2>
                    {' '}
                    {number}     {subject} {action}{' '}
                </h2>
            )}
        </div>
    );
}
export default BattleTurnResult;
