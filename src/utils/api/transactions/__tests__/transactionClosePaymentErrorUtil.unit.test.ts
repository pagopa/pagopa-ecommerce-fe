import {
  getClosePaymentErrorsMap,
  IClosePaymentErrorItem,
} from '../transactionClosePaymentErrorUtil';
import { ViewOutcomeEnum } from '../types';

describe('getClosePaymentErrorsMap()', () => {
  let errors: IClosePaymentErrorItem[];

  beforeAll(() => {
    errors = getClosePaymentErrorsMap();
  });

  it('returns exactly 5 entries', () => {
    expect(errors).toHaveLength(5);
  });

  it('first entry has enablingDescriptions + REFUNDED', () => {
    expect(errors[0]).toEqual({
      statusCode: '422',
      enablingDescriptions: ['Node did not receive RPT yet'],
      outcome: ViewOutcomeEnum.REFUNDED,
    });
  });

  it('second entry omits enablingDescriptions and is GENERIC_ERROR', () => {
    const e = errors[1];
    expect(e.statusCode).toBe('422');
    expect(e.enablingDescriptions).toBeUndefined();
    expect(e.outcome).toBe(ViewOutcomeEnum.GENERIC_ERROR);
  });

  it('third + fourth are 400 & 404 mapping to REFUNDED', () => {
    const slice = errors.slice(2, 4);
    expect(slice.map(x => x.statusCode)).toEqual(['400', '404']);
    slice.forEach(x => expect(x.outcome).toBe(ViewOutcomeEnum.REFUNDED));
  });

  it('fifth entry is 5xx → GENERIC_ERROR', () => {
    const e = errors[4];
    expect(e.statusCode).toBe('5xx');
    expect(e.enablingDescriptions).toBeUndefined();
    expect(e.outcome).toBe(ViewOutcomeEnum.GENERIC_ERROR);
  });

  it('has no unintended duplicates', () => {
    const keys = errors.map(e => `${e.statusCode}|${e.outcome}`);
    expect(new Set(keys).size).toBe(errors.length);
  });
});