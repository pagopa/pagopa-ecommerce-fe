import { createCounter } from "../counter";

beforeEach(() => {
  sessionStorage.clear();
});

describe("createCounter", () => {
  it("initializes with default 0 and is zero", () => {
    const counter = createCounter();
    expect(counter.getValue()).toBe(0);
    expect(counter.isZero()).toBe(true);
  });

  it("initializes with provided initial value", () => {
    const counter = createCounter(5);
    expect(counter.getValue()).toBe(5);
    expect(counter.isZero()).toBe(false);
  });

  it("increments by 1 when no argument is passed", () => {
    const counter = createCounter();
    counter.increment();
    expect(counter.getValue()).toBe(1);
  });

  it("increments by the specified value", () => {
    const counter = createCounter(2);
    counter.increment(3);
    expect(counter.getValue()).toBe(5);
  });

  it("decrements by 1 when no argument is passed", () => {
    const counter = createCounter(2);
    counter.decrement();
    expect(counter.getValue()).toBe(1);
  });

  it("decrements by the specified value", () => {
    const counter = createCounter(10);
    counter.decrement(4);
    expect(counter.getValue()).toBe(6);
  });

  it("isZero returns false when counter is not zero", () => {
    const counter = createCounter(1);
    expect(counter.isZero()).toBe(false);
  });

  it("reset sets the counter back to zero", () => {
    const counter = createCounter(7);
    counter.increment(3);
    expect(counter.getValue()).toBe(10);
    counter.reset();
    expect(counter.getValue()).toBe(0);
    expect(counter.isZero()).toBe(true);
  });

  it("handles a sequence of operations correctly", () => {
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

describe("createCounter with sessionStorage", () => {
  const storageKey = "testCounterKey";

  beforeEach(() => {
    sessionStorage.clear();
  });

  test("should read initial value from sessionStorage if present", () => {
    sessionStorage.setItem(storageKey, "42");
    const newCounter = createCounter(0, storageKey);
    expect(newCounter.getValue()).toBe(42);
  });

  test("should persist value to sessionStorage after increment", () => {
    const counter = createCounter(0, storageKey);
    counter.increment(3);
    expect(sessionStorage.getItem(storageKey)).toBe("3");
  });

  test("should persist value to sessionStorage after decrement", () => {
    const counter = createCounter(0, storageKey);
    counter.decrement(2);
    expect(sessionStorage.getItem(storageKey)).toBe("-2");
  });

  test("should reset and persist zero value to sessionStorage", () => {
    const counter = createCounter(10, storageKey);
    counter.reset();
    expect(sessionStorage.getItem(storageKey)).toBe("0");
  });

  test("should retain value after re-creating the counter (simulating refresh)", () => {
    const storageKey = "testCounterKey";
    /* eslint-disable functional/no-let */
    let counter = createCounter(0, storageKey);
    counter.increment(7);
    // Simulate a page refresh with re-create the counter using the same storage key
    counter = createCounter(0, storageKey);
    expect(counter.getValue()).toBe(7);
  });

  test("should reset to initial value after sessionStorage is cleared", () => {
    const initialValue = 5;

    const counter1 = createCounter(initialValue, storageKey);
    counter1.increment(3);
    expect(counter1.getValue()).toBe(8);
    sessionStorage.clear();

    expect(sessionStorage.getItem(storageKey)).toBeNull();
    const counter2 = createCounter(initialValue, storageKey);
    expect(counter2.getValue()).toBe(initialValue);
  });
});
