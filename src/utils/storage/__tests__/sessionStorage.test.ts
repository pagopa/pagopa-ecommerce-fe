import {
    SessionItems,
    getSessionItem,
    setSessionItem,
    clearStorage,
  } from '../sessionStorage';
  import type { NewTransactionResponse } from '../../../../generated/definitions/payment-ecommerce-v1/NewTransactionResponse';
  
  describe('sessionStorage utilities', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });
  
    describe('getSessionItem', () => {
      it('returns undefined when nothing is stored', () => {
        expect(getSessionItem(SessionItems.sessionToken)).toBeUndefined();
      });
  
      it('returns the stored string', () => {
        sessionStorage.setItem(SessionItems.sessionToken, 'abc123');
        expect(getSessionItem(SessionItems.sessionToken)).toBe('abc123');
      });
    });
  
    describe('setSessionItem', () => {
      it('stores a string value under the given key', () => {
        setSessionItem(SessionItems.sessionToken, 'hello');
        expect(sessionStorage.getItem(SessionItems.sessionToken)).toBe('hello');
      });
  
      it('stores a JSON string when given an object', () => {
        const obj = {
          transactionId: 'tx1',
          payments: [] as any,
          status: 'OK' as any
        } as unknown as NewTransactionResponse;
  
        setSessionItem(SessionItems.sessionToken, obj);
        expect(sessionStorage.getItem(SessionItems.sessionToken)).toBe(JSON.stringify(obj));
      });
    });
  
    describe('clearStorage', () => {
      it('removes all items from sessionStorage', () => {
        sessionStorage.setItem('foo', 'bar');
        sessionStorage.setItem('baz', 'qux');
        clearStorage();
        expect(sessionStorage.getItem('foo')).toBeNull();
        expect(sessionStorage.getItem('baz')).toBeNull();
      });
    });
  });
  