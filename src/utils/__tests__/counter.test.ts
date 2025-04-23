import { createCounter } from '../counter';

describe('createCounter', () => {
  it('initializes with default 0 and is zero', () => {
    const counter = createCounter();
    expect(counter.getValue()).toBe(0);
    expect(counter.isZero()).toBe(true);
  });

  it('initializes with provided initial value', () => {
    const counter = createCounter(5);
    expect(counter.getValue()).toBe(5);
    expect(counter.isZero()).toBe(false);
  });

  it('increments by 1 when no argument is passed', () => {
    const counter = createCounter();
    counter.increment();
    expect(counter.getValue()).toBe(1);
  });

  it('increments by the specified value', () => {
    const counter = createCounter(2);
    counter.increment(3);
    expect(counter.getValue()).toBe(5);
  });

  it('decrements by 1 when no argument is passed', () => {
    const counter = createCounter(2);
    counter.decrement();
    expect(counter.getValue()).toBe(1);
  });

  it('decrements by the specified value', () => {
    const counter = createCounter(10);
    counter.decrement(4);
    expect(counter.getValue()).toBe(6);
  });

  it('isZero returns false when counter is not zero', () => {
    const counter = createCounter(1);
    expect(counter.isZero()).toBe(false);
  });

  it('reset sets the counter back to zero', () => {
    const counter = createCounter(7);
    counter.increment(3);
    expect(counter.getValue()).toBe(10);
    counter.reset();
    expect(counter.getValue()).toBe(0);
    expect(counter.isZero()).toBe(true);
  });

  it('handles a sequence of operations correctly', () => {
    const counter = createCounter(3);
    counter.increment(2);
    counter.decrement(1);
    counter.increment();
    counter.decrement(5);
    expect(counter.getValue()).toBe(0);
    expect(counter.isZero()).toBe(true);
    counter.decrement(2);
    expect(counter.getValue()).toBe(-2);
    expect(counter.isZero()).toBe(false);
  });
});
