import React from 'react';
import {
    getVSBattleContract,
    getCardDataContract,
    getSkaleBattleMtnContract,
} from '../web3/SolidityContracts';
import { angelTeamActions } from '../../config/battles.js';
import ABCardInfo from '../../config/abcardinfo';
import BattleTurnResult from '../BattleTurnResult';
import Sound from 'react-sound';
import ConnectionContext from '../contexts/ConnectionContext';
import { getDefaultTransactionOptions } from '../web3/Utilities';


const mapSpots = {
    1: [1, 2, 3, 4, 5, 13, 20, 27],
    2: [6, 11, 12, 14, 15, 21, 22, 28],
    3: [7, 9, 16, 18, 23, 25, 30, 32],
    4: [8, 10, 17, 19, 24, 26, 34, 37],
    5: [29, 31, 33, 35, 38, 40, 42, 45],
    6: [36, 41, 44, 46, 48, 54, 55, 56],
    7: [39, 43, 47, 49, 50, 51, 52, 53],
    8: [57, 58, 59, 60, 61, 62, 63, 64],
};



const getBackground = (spot) => {


    if (mapSpots[1].includes(spot)) {
        return 'images/battles/backgrounds/top.png';
    }
    if (mapSpots[2].includes(spot)) {
        return 'images/battles/backgrounds/top.png';
    }
    if (mapSpots[3].includes(spot)) {
        return 'images/battles/backgrounds/forest.png';
    }
    if (mapSpots[4].includes(spot)) {
        return 'images/battles/backgrounds/yellow.png';
    }
    if (mapSpots[5].includes(spot)) {
        return 'images/battles/backgrounds/lava.png';
    }
    if (mapSpots[6].includes(spot)) {
        return 'images/battles/backgrounds/snow.png';
    }

    // 7, 8 and default are meadows
    return 'images/battles/backgrounds/meadow.png';
};

const getPanel = (spot) => {
    for (let i = 1; i < 9; i++) {
        if (mapSpots[i].includes(spot)) {
            return i
        }
    }
    return 'unknown panel'
}

class VSBattleArenaView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            skale_battle_contract: null,
            currentResults: [],
            id: 4,
            round: 0,
            playerTurn: true,
            animation: 'normal',
            battleOver: false,
            onBattleEnd: this.props.onBattleEnd,
            attackerFirst: false,
            auraColor: 'blue',
            angelName: this.props.angel,
            angelTeam: {
                angelId: null,
                petId: null,
                accessoryId: null,
                hp: 0,
                summonedPet: false,
                releasedAura: false,
                action: 'What will you do',
                resultValue: 0,
                defenseBuff: 0,
                power: 0,
                speed: 0,
                aura: 0,
                auraRed: 0,
                auraBlue: 0,
                auraYellow: 0,
            },
            defender: {
                angelId: 0,
                petId: 24,
                accessoryId: 0,
                hp: 0,
                power: 0,
                speed: 0,
                auraColor: 'blue',
                summonedPet: false,
                releasedAura: false,
                auraRed: 0,
                auraBlue: 0,
                auraYellow: 0,
                action: 'appears',
                resultValue: 0,
                defenseBuff: 0,
            },
            spotContested: this.props.spotContested,
            defenderAngelType: 99,
            connection: context,
            confirmResults: false,
            soundOn: false,
            battleMtnData: this.props.battleMtnData,
            imgUrl: 'images/battles/backgrounds/meadow.png',
        };
    }

    componentDidMount = async (props) => {
        await this.loadOpponentType();
        await this.getOpponentInfo();
        await this.updateBattleInfo();
    };

    loadOpponentType = async () => {
        let self = this;
        let skale_carddata_contract = getCardDataContract();
        let battle_mtn_contract = getSkaleBattleMtnContract(
            this.state.battleMtnData.battleMtnAddress
        );
        let result = await battle_mtn_contract.methods
            .getTeamByPosition(self.state.spotContested)
            .call();
        console.log('team contested result', result);

        let angelResult = await skale_carddata_contract.methods
            .getABToken(result.angelId)
            .call();
        console.log('angel result', angelResult);
        let petResult = await skale_carddata_contract.methods
            .getABToken(result.petId)
            .call();

        let attackerAngelResult = await skale_carddata_contract.methods
            .getABToken(this.props.angel)
            .call();
        console.log('attacker angel result', attackerAngelResult);

        self.setState({
            defenderAngelType: angelResult.cardSeriesId,
            defenderPetType: petResult.cardSeriesId,
            angelName: attackerAngelResult.cardSeriesId,
        });
    };

    //Function called once to get  information
    getOpponentInfo = () => {
        var self = this;
        let vs_battle_contract = getVSBattleContract(
            this.state.battleMtnData.vsBattleAddress
        );

        const img = getBackground(this.props.spotContested);
        self.setState({ imgUrl: img });

        vs_battle_contract.methods
            .getStaticOpponentStatsForCaller(this.state.connection.currentAddress)
            .call()
            .then(function (result) {
                console.log('static opponent stats result', result);
                var defender = { ...self.state.defender };
                defender.angelId = result.angelId;
                defender.petId = result.petId;
                defender.accessoryId = result.accessoryId;
                defender.power = result.power;
                defender.auraRed = result.auraRed;
                defender.auraBlue = result.auraBlue;
                defender.auraYellow = result.auraYellow;
                defender.aura = result.defenderAura;

                var auraColor = 'maroon';
                var defenderAuraColor = 'maroon';

                switch (result.attackerAura) {
                    case '0':
                        auraColor = 'blue';
                        break;
                    case '1':
                        auraColor = 'yellow';
                        break;
                    case '2':
                        auraColor = 'purple';
                        break;
                    case '3':
                        auraColor = 'orange';
                        break;
                    case '4':
                        auraColor = 'red';
                        break;
                    case '5':
                        auraColor = 'green';
                        break;
                    default:
                        break;
                }

                switch (result.defenderAura) {
                    case '0':
                        defenderAuraColor = 'blue';
                        break;
                    case '1':
                        defenderAuraColor = 'yellow';
                        break;
                    case '2':
                        defenderAuraColor = 'purple';
                        break;
                    case '3':
                        defenderAuraColor = 'orange';
                        break;
                    case '4':
                        defenderAuraColor = 'red';
                        break;
                    case '5':
                        defenderAuraColor = 'green';
                        break;
                    default:
                        break;
                }

                self.setState({
                    defender: defender,
                    auraColor: auraColor,
                    defenderAuraColor: defenderAuraColor,
                });
            });

        vs_battle_contract.methods
            .getStaticAttackerStatsForCaller(this.state.connection.currentAddress)
            .call()
            .then(function (result) {
                console.log('static attacker stats result', result);
                var angelTeam = { ...self.state.angelTeam };

                angelTeam.power = result.power;
                angelTeam.speed = result.speed;
                angelTeam.auraRed = result.auraRed;
                angelTeam.auraBlue = result.auraBlue;
                angelTeam.auraYellow = result.auraYellow;

                self.setState({ angelTeam });
            });
    };

    updateBattleInfo = async () => {
        var self = this;
      //  this.sleep(5000);
        await this.readUpdateFromChain();
        // self.setState({ lastRound: self.state.status })
        self.setState({ animation: 'normal' });
    };

    sleep = (milliseconds) => {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if (new Date().getTime() - start > milliseconds) {
                break;
            }
        }
    };

    //function called to update state after each turn/
    readUpdateFromChain = () => {
        const self = this;
        let vs_battle_contract = getVSBattleContract(
            this.state.battleMtnData.vsBattleAddress
        );

        if (this.state.round > 100) {
            self.setState({ confirmResults: true, playerTurn: false });
            return;
        }
        vs_battle_contract.methods
            .getBattleResultsForCaller(this.state.connection.currentAddress)
            .call()
            .then(function (result) {
                self.setState({ id: result.id, round: result.round });
                console.log('battle round result', result);

                const angelTeam = { ...self.state.angelTeam };
                angelTeam.hp = result.attackerHp;
                angelTeam.defenseBuff = result.attackerDefenseBuff;
                angelTeam.action = angelTeamActions[result.attackerAction]; //here change to string based on array.
                angelTeam.resultValue = result.attackerResultValue;

                const attackerPetAuraStatus = parseInt(result.attackerPetAuraStatus);
                if (attackerPetAuraStatus === 0) {
                    angelTeam.releasedAura = false;
                    angelTeam.summonedPet = false;
                }
                if (attackerPetAuraStatus === 1) {
                    angelTeam.releasedAura = true;
                    angelTeam.summonedPet = false;
                }
                if (attackerPetAuraStatus === 10) {
                    angelTeam.releasedAura = false;
                    angelTeam.summonedPet = true;
                }
                if (attackerPetAuraStatus === 11) {
                    angelTeam.releasedAura = true;
                    angelTeam.summonedPet = true;
                }

                //  angelTeam.power = result.power;
                //  angelTeam.speed = result.speed;

                const defender = { ...self.state.defender };
                defender.hp = result.defenderHp;
                defender.defenseBuff = result.defenderDefenseBuff;
                defender.action = angelTeamActions[result.defenderAction]; //here change to string based on array.
                defender.resultValue = result.defenderResultValue;

                const defenderPetAuraStatus = parseInt(result.attackerPetAuraStatus);
                if (defenderPetAuraStatus === 0) {
                    defender.releasedAura = false;
                    defender.summonedPet = false;
                }
                if (defenderPetAuraStatus === 1) {
                    defender.releasedAura = true;
                    defender.summonedPet = false;
                }
                if (defenderPetAuraStatus === 10) {
                    defender.releasedAura = false;
                    defender.summonedPet = true;
                }
                if (defenderPetAuraStatus === 11) {
                    defender.releasedAura = true;
                    defender.summonedPet = true;
                }

                self.setState({
                    angelTeam: angelTeam,
                    defender: defender,
                    playerTurn: true,
                    attackerFirst: result.attackerFirst,
                });

                //If battle is finished, send the results up to the BattlesView component.
                if (result.round > 100) {
                    console.log('Battle over');
                    self.setState({ confirmResults: true });
                }
            });
    };

    //Attack function. Call the attack method on the contract with the current batttle id, then update and rerender.
    attack = async () => {
        var self = this;
        this.setState({ playerTurn: false });
        this.setState({ animation: 'attack' });
        let vs_battle_contract = getVSBattleContract(
            this.state.battleMtnData.vsBattleAddress
        );
        const options = await getDefaultTransactionOptions();
        options.gas = 400000;
        options.from = this.state.connection.currentAddress
        vs_battle_contract.methods
            .battleRound(1)
            .send(options)
               
            // .on('receipt', function (hash) {
            //   self.updateBattleInfo();
            // })
            .on('confirmation', function (confirmationNumber) {
                if (confirmationNumber === 5) {
                    self.updateBattleInfo();
                }
            })
            .on('error', function (error) {
                self.setState({
                    playerTurn: true,
                    animation: 'normal',
                });
            });
    };

    //Defend function. Call the defend method on the contract with the current batttle id, then update and rerender.
    defend = async () => {
        var self = this;
        this.setState({ playerTurn: false });
        this.setState({ animation: 'defend' });
        let vs_battle_contract = getVSBattleContract(
            this.state.battleMtnData.vsBattleAddress
        );
        const options = await getDefaultTransactionOptions();
        options.gas = 400000;
        options.from = this.state.connection.currentAddress
        vs_battle_contract.methods
            .battleRound(2)
            .send(options)
            .on('receipt', function (hash) {
                self.updateBattleInfo();
            })
            .on('error', function (error) {
                self.setState({
                    playerTurn: true,
                    animation: 'normal',
                });
            });
    };

    //auraBurst function. Call the auraBurst method on the contract with the current batttle id, then update and rerender.
    releaseAura = async () => {
        const self = this;
        this.setState({ playerTurn: false });
        this.setState({ animation: 'auraBurst' + this.state.auraColor });
        const vs_battle_contract = getVSBattleContract(
            this.state.battleMtnData.vsBattleAddress
        );
        const options = await getDefaultTransactionOptions();
        options.gas = 400000;
        options.from = this.state.connection.currentAddress
        vs_battle_contract.methods
            .battleRound(3)
            .send(options)
            .on('receipt', function (hash) {
                self.updateBattleInfo();
            })
            .on('error', function (error) {
                self.setState({
                    playerTurn: true,
                    animation: 'normal',
                });
            });
    };

    //summonPet function. Call the summonPet method on the contract with the current batttle id, then update and rerender.
    summonPet = async () => {
        var self = this;
        this.setState({ playerTurn: false });
        this.setState({ animation: 'summonPet' });
        let vs_battle_contract = getVSBattleContract(
            this.state.battleMtnData.vsBattleAddress
        );
        const options = await getDefaultTransactionOptions();
        options.gas = 400000;
        options.from = this.state.connection.currentAddress
        vs_battle_contract.methods
            .battleRound( 4)
            .send(options)
            .on('receipt', function (hash) {
                self.updateBattleInfo();
            })
            .on('error', function (error) {
                self.setState({
                    playerTurn: true,
                    animation: 'normal',
                });
            });
    };

    render() {
        //Render if battle is still loading.
        if (this.state.defenderAngelType === 99) {
            return (
                <div>
                    <img
                        className=" ui centered fluid large image"
                        src={`images/battles/monsters/99.png`}
                        alt="loading"
                        style={styles.whiteBg}
                    />
                    <div className="one-em-padd">
                        <button
                            type="button"
                            className="ui button"
                            onClick={async () => {
                                await this.loadOpponentType();
                                await this.getOpponentInfo();
                                await this.updateBattleInfo();

                            }}
                        >
                            Manual Update{' '}
                        </button>
                    </div>
                </div>
                  
            );
        }

        return (
            <div
                style={{
                    flex: 1,
                }}
            >
                {this.state.soundOn && (
                    <Sound
                        url="sounds/fightMusic.m4a"
                        playStatus={Sound.status.PLAYING}
                    />
                )}
                <h4>
                    {' '}
                    Battle id: {this.state.id} -{' '}
                    Attacking Spot: {this.state.spotContested} (Panel: {getPanel(this.state.spotContested)}){' '}
                    {parseInt(this.state.round, 10) < 100 ? (
                        <span>Results for Round: {this.state.round} </span>
                    ) : (
                        <span> Final Results </span>
                    )}{' '}
                </h4>
                <div
                    className="ui centered fluid grid"
                    style={{
                        backgroundImage: `url(${this.state.imgUrl})`,
                        backgroundSize: 'cover',
                        overflow: 'hidden',
                    }}
                >
                    <div className="fourteen wide column">
                        {this.state.attackerFirst && (
                            <BattleTurnResult
                                color="blue"
                                subject={ABCardInfo.cards[this.state.angelName].name}
                                action={this.state.angelTeam.action}
                                resultValue={this.state.angelTeam.resultValue}
                                number={'1. '}
                            />
                        )}
                        {!this.state.attackerFirst && (
                            <BattleTurnResult
                                color="red"
                                subject={ABCardInfo.cards[this.state.defenderAngelType].name}
                                action={this.state.defender.action}
                                resultValue={this.state.defender.resultValue}
                                number={'1. '}
                            />
                        )}
                        {!this.state.attackerFirst && (
                            <BattleTurnResult
                                color="blue"
                                subject={ABCardInfo.cards[this.state.angelName].name}
                                action={this.state.angelTeam.action}
                                resultValue={this.state.angelTeam.resultValue}
                                number={'2. '}
                            />
                        )}
                        {this.state.attackerFirst && (
                            <BattleTurnResult
                                color="red"
                                subject={ABCardInfo.cards[this.state.defenderAngelType].name}
                                action={this.state.defender.action}
                                resultValue={this.state.defender.resultValue}
                                number={'2. '}
                            />
                        )}
                    </div>

                    <div className="row 3 columns">
                        <div className="six wide column">
                            <div className="ui red segment">
                                <div>Defender Stats</div>
                                <span>
                                    <i
                                        className="red heart icon"
                                        title={
                                            'Hit points (HP) - amount of damage taken before defeat'
                                        }
                                    ></i>
                                    {this.state.defender.hp || 0}
                                </span>
                                <span>
                                    <i
                                        className="bolt icon"
                                        title={
                                            'Battle Power - The more battle power, the harder likely to attack'
                                        }
                                    >
                                        {' '}
                                    </i>
                                    {this.state.defender.power || 0}
                                </span>
                                <span>
                                    {' '}
                                    <i
                                        className="red rocket icon"
                                        title={
                                            'Speed/Luck - Helps in determining whether the angel or the monster will go first'
                                        }
                                    ></i>{' '}
                                    {this.state.defender.speed || 0}{' '}
                                </span>
                                <span>
                                    <i
                                        className="red fire icon"
                                        title={'Red Aura - Affects Initial Attack Power'}
                                    ></i>
                                    {this.state.defender.auraRed || 0}
                                </span>
                                <span>
                                    <i
                                        className="blue tint icon"
                                        title={'Blue Aura - Affects Initial Defense Power'}
                                    >
                                        {' '}
                                    </i>
                                    {this.state.defender.auraBlue || 0}
                                </span>
                                <span>
                                    <i
                                        className="yellow sun icon"
                                        title={'Yellow Aura - Affects Initial Speed/Luck'}
                                    >
                                        {' '}
                                    </i>
                                    {this.state.defender.auraYellow || 0}
                                </span>

                                <span>
                                    <i
                                        className="green shield alternate icon"
                                        title={
                                            'Defense buff - Extra increase in defense that will result in enemy strikes causing less damage'
                                        }
                                    >
                                        {' '}
                                    </i>
                                    {this.state.defender.defenseBuff || 0}
                                </span>
                                <span>
                                    {' '}
                                    <i
                                        className={`${this.state.defenderAuraColor} fire icon`}
                                        title={'Defender aura color'}
                                    >
                                        {' '}
                                    </i>{' '}
                                    {this.state.defenderAuraColor}{' '}
                                </span>
                            </div>
                        </div>
                        <div className="column" />
                        <div className="six wide column">
                            <div className={`ui ${this.state.auraColor} segment`}>
                                <div> Angel Stats</div>
                                <span>
                                    {' '}
                                    <i
                                        className="red heart icon"
                                        title={
                                            'Hit points (HP) - amount of damage taken before defeat'
                                        }
                                    ></i>{' '}
                                    {this.state.angelTeam.hp || 0}{' '}
                                </span>
                                <span>
                                    {' '}
                                    <i
                                        className="bolt icon"
                                        title={
                                            'Battle Power - The more battle power, the harder likely to attack'
                                        }
                                    >
                                        {' '}
                                    </i>{' '}
                                    {this.state.angelTeam.power || 0}{' '}
                                </span>
                                <span>
                                    {' '}
                                    <i
                                        className="red rocket icon"
                                        title={
                                            'Speed/Luck - Helps in determining whether the angel or the monster will go first'
                                        }
                                    ></i>{' '}
                                    {this.state.angelTeam.speed || 0}{' '}
                                </span>
                                <span>
                                    <i
                                        className="red fire icon"
                                        title={'Red Aura - Affects Initial Attack Power'}
                                    ></i>
                                    {this.state.angelTeam.auraRed || 0}
                                </span>
                                <span>
                                    <i
                                        className="blue tint icon"
                                        title={'Blue Aura - Affects Initial Defense Power'}
                                    >
                                        {' '}
                                    </i>
                                    {this.state.angelTeam.auraBlue || 0}
                                </span>
                                <span>
                                    <i
                                        className="yellow sun icon"
                                        title={'Yellow Aura - Affects Initial Speed/Luck'}
                                    >
                                        {' '}
                                    </i>
                                    {this.state.angelTeam.auraYellow || 0}
                                </span>
                                <span>
                                    {' '}
                                    <i
                                        className="green shield alternate icon"
                                        title={
                                            'Defense buff - Extra increase in defense that will result in enemy strikes causing less damage'
                                        }
                                    >
                                        {' '}
                                    </i>{' '}
                                    {this.state.angelTeam.defenseBuff || 0}{' '}
                                </span>
                                <span>
                                    {' '}
                                    <i
                                        className={`${this.state.auraColor} fire icon`}
                                        title={'Angel color'}
                                    >
                                        {' '}
                                    </i>{' '}
                                    {this.state.auraColor}{' '}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row 2 columns vs-defenders">
                        <div>
                            <div style={styles.animation}>
                                {this.state.animation !== 'normal' && (
                                    <img
                                        className="ui centered fluid medium image"
                                        src={`images/battles/animations/${this.state.animation}.gif`}
                                        alt="battle action animation"
                                    />
                                )}
                            </div>
                            <img
                                className=" ui medium image"
                                src={
                                    this.state.defenderAngelType < 24
                                        ? `images/battles/angels/${this.state.defenderAngelType}.png`
                                        : 'images/battles/angels/0.png'
                                }
                                alt="defender angel"
                            />
                        </div>
                        <div>
                            <img
                                className=" ui medium image"
                                src={
                                    this.state.defenderPetType > 24
                                        ? `images/battles/pets/${this.state.defenderPetType}.png`
                                        : 'images/battles/pets/25.png'
                                }
                                alt="defender pet"
                            />
                        </div>
                    </div>
                    <div
                        className="row"
                        onClick={() => this.setState({ soundOn: !this.state.soundOn })}
                    >
                        {this.state.soundOn ? (
                            <img
                                height="30px"
                                src="./images/battles/soundOff.svg"
                                alt="turn sound off"
                            />
                        ) : (
                            <img
                                height="30px"
                                src="./images/battles/soundOn.svg"
                                alt="turn sound on"
                            />
                        )}
                    </div>
                    <div className="four column centered row">
                        {this.state.playerTurn && (
                            <div className="column" onClick={this.attack}>
                                {' '}
                                <div>
                                    <img
                                        className="ui centered fluid small image"
                                        src={`images/battles/Attack_Active.png`}
                                        alt="fight"
                                    />{' '}
                                </div>{' '}
                            </div>
                        )}
                        {!this.state.playerTurn && (
                            <div className="column">
                                {' '}
                                <div>
                                    <img
                                        className="ui centered fluid small image"
                                        src={`images/battles/Attack_Inactive.png`}
                                        alt="fight"
                                    />{' '}
                                </div>{' '}
                            </div>
                        )}
                        {this.state.playerTurn && (
                            <div className="column" onClick={this.defend}>
                                {' '}
                                <div>
                                    <img
                                        className="ui centered fluid small image"
                                        src={`images/battles/Defend_Active.png`}
                                        alt="defend"
                                    />{' '}
                                </div>{' '}
                            </div>
                        )}
                        {!this.state.playerTurn && (
                            <div className="column">
                                {' '}
                                <div>
                                    <img
                                        className="ui centered fluid small image"
                                        src={`images/battles/Defend_Inactive.png`}
                                        alt="defend"
                                    />{' '}
                                </div>{' '}
                            </div>
                        )}
                    </div>
                    <div className="four column centered row">
                        {this.state.playerTurn && !this.state.angelTeam.releasedAura && (
                            <div className="column" onClick={this.releaseAura}>
                                {' '}
                                <div>
                                    <img
                                        className="ui centered fluid small image"
                                        src={`images/battles/AuraBurst_Active.png`}
                                        alt="AuraBurst"
                                    />{' '}
                                </div>{' '}
                            </div>
                        )}
                        {(!this.state.playerTurn || this.state.angelTeam.releasedAura) && (
                            <div className="column">
                                {' '}
                                <div>
                                    <img
                                        className="ui centered fluid small image"
                                        src={`images/battles/AuraBurst_Inactive.png`}
                                        alt="auraBurst"
                                    />{' '}
                                </div>{' '}
                            </div>
                        )}
                        {this.state.playerTurn && !this.state.angelTeam.summonedPet && (
                            <div className="column" onClick={this.summonPet}>
                                {' '}
                                <div>
                                    <img
                                        className="ui centered fluid small image"
                                        src={`images/battles/Summon_Active.png`}
                                        alt="Summon Pet"
                                    />{' '}
                                </div>{' '}
                            </div>
                        )}
                        {(!this.state.playerTurn || this.state.angelTeam.summonedPet) && (
                            <div className="column">
                                {' '}
                                <div>
                                    <img
                                        className="ui centered fluid small image"
                                        src={`images/battles/Summon_Inactive.png`}
                                        alt="summon pet"
                                    />{' '}
                                </div>{' '}
                            </div>
                        )}
                    </div>
                    <div className="one-em-padd">
                        <button
                            type="button"
                            className="ui button"
                            onClick={() => this.updateBattleInfo()}
                        >
                            Manual Update{' '}
                        </button>
                    </div>
                    {this.state.confirmResults &&
                        <div className="one-em-padd">
                            <button
                                type="button"
                                className="ui button"
                                onClick={() =>
                                    this.state.onBattleEnd(
                                        this.state.spotContested,
                                        this.state.round
                                    )
                                }
                            >
                                Confirm Results{' '}
                            </button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

let styles = {
    whiteBg: {
        backgroundColor: 'white',
    },
    normal: {},
    attack: {
        backgroundSize: 'cover',
        overflow: 'hidden',
        zIndex: 100,
    },
    animation: {
        position: 'absolute',
        zIndex: 100,
        width: 300,
        height: 300,
    },
    relative: {
        position: 'relative',
        zIndex: 1,
        width: 300,
        height: 300,
    },
};

VSBattleArenaView.contextType = ConnectionContext;
export default VSBattleArenaView;
