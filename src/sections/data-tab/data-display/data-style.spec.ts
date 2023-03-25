import { describe, expect, it } from 'vitest';

import { makeDimPath } from '../../../data/dimension-paths';
import { LeafDimensionValue } from '../../../data/dimensions';
import { DataOp } from '../../../data/transform/fact-processing';
import { getDefaultColorDimension } from './data-style-state';

describe('chart style', () => {
  describe('default group choice', () => {
    const MOTO_VAL: LeafDimensionValue = {
      type: 'leaf',
      ID: '1',
      AB: 'MOTO',
      NA: 'Motorcycles',
    };

    const VEH_TYPE_PATH = makeDimPath('Tech.VehType');

    const ONE_VALUE_OP: DataOp = {
      path: VEH_TYPE_PATH,
      ops: {
        aggregate: false,
        filter: [MOTO_VAL],
      },
    };

    const HYBRID_VAL: LeafDimensionValue = {
      type: 'leaf',
      ID: '1',
      AB: '1',
      NA: 'Hybrid',
    };

    const NON_HYBRID_VAL: LeafDimensionValue = {
      type: 'leaf',
      ID: '2',
      AB: '2',
      NA: 'Non-hybrid',
    };

    const HYBRID_PATH = makeDimPath('Tech.Hybrid');

    const TWO_VALUES_OP: DataOp = {
      path: HYBRID_PATH,
      ops: {
        aggregate: false,
        filter: [HYBRID_VAL, NON_HYBRID_VAL],
      },
    };

    const FUEL_PATH = makeDimPath('Tech.Fuel');

    const NO_FILTER_OP: DataOp = {
      path: FUEL_PATH,
      ops: {
        aggregate: false,
        filter: null,
      },
    };

    const ANOTHER_ONE_VALUE_OP: DataOp = {
      path: makeDimPath('Tech.Hybrid'),
      ops: {
        aggregate: false,
        filter: [HYBRID_VAL],
      },
    };

    it.each<[DataOp[], DataOp]>([
      [[ONE_VALUE_OP, TWO_VALUES_OP], TWO_VALUES_OP],
      [[ONE_VALUE_OP, NO_FILTER_OP, TWO_VALUES_OP], NO_FILTER_OP],
    ])(
      'returns first group with more than one value in filter or no filter applies',
      (ops, resOp) => {
        const result = getDefaultColorDimension(ops);
        expect(result).toBe(resOp);
      }
    );

    it('returns first group if none have more than one filter value', () => {
      const result = getDefaultColorDimension([
        ONE_VALUE_OP,
        ANOTHER_ONE_VALUE_OP,
      ]);

      expect(result).toBe(ONE_VALUE_OP);
    });
  });
});
