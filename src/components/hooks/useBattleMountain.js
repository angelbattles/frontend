import { useCallback, useMemo, useState } from 'react';
import {
  battle_mountain_address,
  vs_battle_address,
} from '../web3/SolidityContractsAddresses';
import * as ContractUtils from '../web3/Utilities';

const defaultData = {
  id: 0,
  active: true,
  title: 'Mt. Zion',
  description: '',
  battleMtnAddress: battle_mountain_address,
  vsBattleAddress: vs_battle_address,
};

const useBattleMountain = () => {
  const [data, setData] = useState(defaultData);

  /**
   * Switch to another address
   * @param mtnId - id of the mountain. This is not the mountain address
   */
  const switchBattleMountain = useCallback(
    (mtnId) => {
      if (+data.id === +mtnId) {
        return;
      }

      if (!mtnId || +mtnId === 0) {
        // Invalid id provided, default to AB official mountain
        setData(defaultData);
        return;
      }

      return ContractUtils.getBattleMountainByIndex(mtnId)
        .then((data) => {
          setData(data);
        })
        .catch(() => {
          console.log('default mountain');
          // Could not get mountain, default to AB official mountain
          setData(defaultData);
        });
    },
    [data]
  );

  // Memo return value, useApi was looping
  return useMemo(
    () => ({
      data,
      switchBattleMountain,
    }),
    [data, switchBattleMountain]
  );
};

export default useBattleMountain;
