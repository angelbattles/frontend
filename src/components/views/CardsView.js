import React, { useCallback, useEffect, useState } from 'react';
import ABCard from '../ABCard';
import HeaderSection from '../HeaderSection';

const CardsView = ({ globalCardCounts }) => {
  const [state, setState] = useState({
    angels: [],
    pets: [],
    accessories: [],
    medals: [],
  });

  const getGlobalCardCount = useCallback(
    (cardSeriesId) => (globalCardCounts ? globalCardCounts[cardSeriesId] : ''),
    [globalCardCounts]
  );

  useEffect(() => {
    const angels = [];
    const pets = [];
    const accessories = [];
    const medals = [];

    for (let i = 0; i < 24; i++) {
      angels.push(
        <ABCard
          cardId={i}
          key={i}
          view={'Home'}
          globalCardCount={getGlobalCardCount(i)}
        />
      );
    }
    for (let i = 24; i < 43; i++) {
      pets.push(
        <ABCard
          cardId={i}
          view={'Home'}
          key={i}
          globalCardCount={getGlobalCardCount(i)}
        />
      );
    }

    for (let i = 43; i < 61; i++) {
      accessories.push(
        <ABCard
          cardId={i}
          key={i}
          view={'Home'}
          globalCardCount={getGlobalCardCount(i)}
        />
      );
    }
    for (let i = 61; i < 73; i++) {
      medals.push(
        <ABCard
          cardId={i}
          key={i}
          view={'Home'}
          globalCardCount={getGlobalCardCount(i)}
        />
      );
    }

    setState({ angels, pets, accessories, medals });
  }, [globalCardCounts, getGlobalCardCount]);

  return (
    <div>
      <div className="ui stackable grid ">
        <HeaderSection title="Angels" />
        {state.angels}
        <HeaderSection title="Pets" />
        {state.pets}
        <HeaderSection title="Accessories" />
        {state.accessories}
        <HeaderSection title="Medals" />
        {state.medals}
      </div>
    </div>
  );
};

export default CardsView;
