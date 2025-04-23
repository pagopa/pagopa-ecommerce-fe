import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { ecommerceIOGetTransactionInfo, ecommerceCHECKOUTGetTransaction } from '../getTransactionInfo';
import { ecommerceIOClientWithPollingV2, ecommerceCHECKOUTClientClientWithPollingV2 } from '../../client';

jest.mock('../../client', () => ({
  ecommerceIOClientWithPollingV2: { getTransactionInfo: jest.fn() },
  ecommerceCHECKOUTClientClientWithPollingV2: { getTransactionInfo: jest.fn() }
}));

describe('ecommerceIOGetTransactionInfo', () => {
  const mockResponse = { id: 'tx123', amount: 100 }; // shape matches IOTransactionInfo

  it('returns Some(value) when client returns Right with status 200', async () => {
    (ecommerceIOClientWithPollingV2.getTransactionInfo as jest.Mock).mockResolvedValue(
      E.right({ status: 200, value: mockResponse })
    );
    const result = await ecommerceIOGetTransactionInfo('tx123', 'token');
    expect(result).toEqual(O.some(mockResponse));
  });

  it('returns None when client returns Right with non-200 status', async () => {
    (ecommerceIOClientWithPollingV2.getTransactionInfo as jest.Mock).mockResolvedValue(
      E.right({ status: 404, value: mockResponse })
    );
    const result = await ecommerceIOGetTransactionInfo('tx123', 'token');
    expect(result).toEqual(O.none);
  });

  it('returns None when client throws an error', async () => {
    (ecommerceIOClientWithPollingV2.getTransactionInfo as jest.Mock).mockRejectedValue(
      new Error('network error')
    );
    const result = await ecommerceIOGetTransactionInfo('tx123', 'token');
    expect(result).toEqual(O.none);
  });
});

describe('ecommerceCHECKOUTGetTransaction', () => {
  const mockResponse = { transactionId: 'tx456', status: 'COMPLETED' }; // shape matches CHECKOUTTransactionInfo

  it('returns Some(value) when client returns Right with status 200', async () => {
    (ecommerceCHECKOUTClientClientWithPollingV2.getTransactionInfo as jest.Mock).mockResolvedValue(
      E.right({ status: 200, value: mockResponse })
    );
    const result = await ecommerceCHECKOUTGetTransaction('tx456', 'token');
    expect(result).toEqual(O.some(mockResponse));
  });

  it('returns None when client returns Right with non-200 status', async () => {
    (ecommerceCHECKOUTClientClientWithPollingV2.getTransactionInfo as jest.Mock).mockResolvedValue(
      E.right({ status: 500, value: mockResponse })
    );
    const result = await ecommerceCHECKOUTGetTransaction('tx456', 'token');
    expect(result).toEqual(O.none);
  });

  it('returns None when client throws an error', async () => {
    (ecommerceCHECKOUTClientClientWithPollingV2.getTransactionInfo as jest.Mock).mockRejectedValue(
      new Error('timeout')
    );
    const result = await ecommerceCHECKOUTGetTransaction('tx456', 'token');
    expect(result).toEqual(O.none);
  });
});
