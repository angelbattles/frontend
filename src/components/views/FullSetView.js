import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import HeaderSection from '../HeaderSection';
import SetCard from '../SetCard';

const FullSetView = ({ cards }) => {
  const [loaded, setLoaded] = useState(false);

  const [mounted, setMounted] = useState(true);

  // Track unmount
  useEffect(() => {
    // clean up
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (mounted && cards.ownerTokens) {
      setLoaded(true);
    }
  }, [cards, mounted]);

  return (
    <div>
      <HeaderSection title="My Sets" />
      <div className="ui raised segment">
        <p>See which sub-sets of Angel Battles Cards you have collected. </p>{' '}
        <p>Fully collected sets will be in color.</p>
      </div>

      {loaded === false ? (
        <LoadingSpinner />
      ) : (
        <div className="ui four cards">
          <SetCard
            cards={cards}
            requiredCards={[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
              35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
              51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
              67, 68, 69, 70, 71, 72,
            ]}
            label={'all cards'}
            image={`images/bonuses/cards.jpg`}
            description={'Obtain all 72 cards in the game'}
          />

          <SetCard
            cards={cards}
            requiredCards={[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ]}
            label={'all angels'}
            image={`images/bonuses/angels.jpg`}
            description={'Obtain all 24 angel cards in the game'}
          />

          <SetCard
            cards={cards}
            requiredCards={[
              24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
              40, 41, 42,
            ]}
            label={'all pets'}
            image={`images/bonuses/pets.jpg`}
            description={'Obtain all 19 pets in the game'}
          />

          <SetCard
            cards={cards}
            requiredCards={[
              43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
              59, 60,
            ]}
            label={'all accessories'}
            image={`images/bonuses/accessories.jpg`}
            description={'Obtain all 18 accessories in the game'}
          />

          <SetCard
            cards={cards}
            requiredCards={[61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72]}
            label={'all accessories'}
            image={`images/bonuses/medals.jpg`}
            description={'Obtain all 12 medals in the game'}
          />
          <SetCard
            cards={cards}
            requiredCards={[24, 25, 26, 27]}
            label={'l1 pets'}
            image={`images/bonuses/l1.jpg`}
            description={
              'Obtain all of the level 1 pets - Gecko, Parakeet, Horse and Cat.'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[28, 29, 30, 31]}
            label={'l2 pets'}
            image={`images/bonuses/l2.jpg`}
            description={
              'Obtain all of the level 2 pets - Komodo, Falcon, Bobcat and Unicorn.'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[32, 33, 34, 35]}
            label={'l3 pets'}
            image={`images/bonuses/l3.jpg`}
            description={
              'Obtain all of the level 3 pets - Rock Dragon, Archaeopteryx, Sabertooth and Pegasus.'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[36, 37, 38, 39]}
            label={'l4 pets'}
            image={`images/bonuses/l4.jpg`}
            description={
              'Obtain all of the level 4 pets - Dire Dragon, Phoenix, Liger and Alicorn.'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[40, 41, 42]}
            label={'l5 pets'}
            image={`images/bonuses/l5.jpg`}
            description={
              'Obtain all 3 elementals - Fire Elemental, Water Elemental, Sun Elemental.'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[0, 9, 15, 21]}
            label={'blue angels'}
            image={`images/bonuses/blue.jpg`}
            description={
              'Obtain all blue aura angels - Berakiel, Eleleth, Gabriel and Ballzebub'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[1, 5, 11, 17]}
            label={'yellow angels'}
            image={`images/bonuses/yellow.jpg`}
            description={
              'Obtain all yellow aura angels - Zadkiel, Raguel, Ziwa and Rafael'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[2, 6, 12, 18]}
            label={'purple angels'}
            image={`images/bonuses/purple.jpg`}
            description={
              'Obtain all purple aura angels - Lucifer, Lilith, Cimeriel, and Melchezidek'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[3, 8, 14, 20]}
            label={'orange angels'}
            image={`images/bonuses/orange.jpg`}
            description={
              'Obtain all orange aura angels - Michael, Azazel, Bat Gol, and Abbadon'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[4, 10, 16, 22]}
            label={'red angels'}
            image={`images/bonuses/red.jpg`}
            description={
              'Obtain all red aura angels - Arel, Verin, Metatron, and Ben Nez'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[7, 13, 19, 23]}
            label={'green angels'}
            image={`images/bonuses/green.jpg`}
            description={
              'Obtain all green aura angels - Furlac, Numinel, Semyaza, and Jophiel'
            }
          />

          <SetCard
            cards={cards}
            requiredCards={[
              0, 1, 3, 4, 5, 6, 8, 11, 13, 14, 15, 16, 17, 18, 22, 23,
            ]}
            label={'light angels'}
            image={`images/bonuses/light.jpg`}
            description={'Obtain all 16 light angels'}
          />

          <SetCard
            cards={cards}
            requiredCards={[2, 7, 9, 10, 12, 19, 20, 21]}
            label={'dark angels'}
            image={`images/bonuses/dark.jpg`}
            description={'Obtain all 8 fallen angels'}
          />
        </div>
      )}
    </div>
  );
};

export default FullSetView;
