import React from 'react';
import HeaderSection from '../HeaderSection';
import CustomBattleMtns from '../customBattleMtn/CustomBattleMtns';

const MyBattleMtnView = () => {
  return (
    <div>
      <HeaderSection title={`My Battle Mountains`} />
      <div className="ui raised segment">
        On this page you can create new battle mountains or manage the mountains
        where you are an owner. When you manage a mountain, you can choose which
        cards are allowed on the mountain and / or which players are allowed
      </div>
      <CustomBattleMtns />
    </div>
  );
};

export default MyBattleMtnView;
