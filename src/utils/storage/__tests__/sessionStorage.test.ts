import {
  SessionItems,
  getSessionItem,
  setSessionItem,
  clearStorage,
} from "../sessionStorage";

describe("sessionStorage utilities", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("getSessionItem", () => {
    it("returns undefined when nothing is stored", () => {
      expect(getSessionItem(SessionItems.sessionToken)).toBeUndefined();
    });

    it("returns the stored string", () => {
      sessionStorage.setItem(SessionItems.sessionToken, "abc123");
      expect(getSessionItem(SessionItems.sessionToken)).toBe("abc123");
    });
  });

  describe("setSessionItem", () => {
    it("stores a string value under the given key", () => {
      setSessionItem(SessionItems.sessionToken, "hello");
      expect(sessionStorage.getItem(SessionItems.sessionToken)).toBe("hello");
    });
  });

  describe("clearStorage", () => {
    it("removes all items from sessionStorage", () => {
      sessionStorage.setItem("foo", "bar");
      sessionStorage.setItem("baz", "qux");
      clearStorage();
      expect(sessionStorage.getItem("foo")).toBeNull();
      expect(sessionStorage.getItem("baz")).toBeNull();
    });
  });
});
