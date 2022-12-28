import React from 'react';
import HeaderSection from '../HeaderSection';

const AboutView = () => {
  return (
    <div>
      <p>. </p>
      <p>. </p>
      <HeaderSection title="About" />
      <div className="ui raised segment">
        <p>
          Angel Battles 2 was created as a side project by a small group of
          volunteers who believe in the future of blockchain technology and
          wanted to learn by building (ie, the Team Entity). All intellectual
          property (ie, smart contract code, front end code, and artwork) is
          released for free into the public domain. Computer code is released
          under the MIT License while artwork is released under the CC0 License.{' '}
        </p>
        <p>
          100% of Halo Tokens were created when the contract was initialized and
          are given to community members for free. These tokens are gradually
          streamed over 5 years to the battle mountain and various arenas, to
          airdrop participants, and to the DAO treasury (over 10 years). The
          amount of tokens airdrop players receive is representative of what
          active players would use playing the game.
        </p>
        <p>
          There are no investors, and the Team Entity has never sold any Halo
          Tokens and will never sell any Halo Tokens in any jurisdiction. The
          Team Entity and its members receive no Halo Tokens for their work
          generating computer code and artwork for Angel Battles 2.
        </p>
        <p>
          At launch, the Angel Battles 2 game is fully functional. Halo Tokens
          can immediately be used for their intended purpose, which is as a
          one-time consumable in order to breed pets within the game or in
          exchange for certain powerful cards. Halo tokens may also be
          immediately used by players to vote about the management of the game
          in the Angel Battles Decentralized Autonomous Organization (DAO).
        </p>
        <p>
          Management of the game consists of changing certain parameters (ie,
          amount of experience points received for winning a battle) or
          deploying new contracts. In order for new contracts to affect the
          state of Angel Battles 2 cards, these contracts must be approved (ie,
          become seraphim) by the main contracts. Both of these powers rest
          solely in the admin key (ie, creatorAddress). The Team Entity will
          transfer this key to the DAO.
        </p>
        <p>
          Halo tokens should not be considered to be an investment or store of
          any value. Because Halo tokens are consumed in a one-way process
          during normal gameplay and will cease to exist over time, the DAO will
          eventually need to transition to another form of voting.
        </p>
        <p>
          The Team Entity has no custody of any funds or tokens of users. Any
          matic used to purchase NFTs is held in the store contract until any
          player transfers it to Gitcoin matching pool wallet..
        </p>
        <p>
          The Team Entity has not created any primary or secondary market for
          Halo tokens.
        </p>
        <p>
          After launch, the Team Entity will not engage in any substantial
          development, promotion, marketing or similar activities. Without the
          admin key, ability of the Team Entity or its members to promote or
          improve the game will be no more than any other community member.
        </p>
      </div>
    </div>
  );
};

export default AboutView;
