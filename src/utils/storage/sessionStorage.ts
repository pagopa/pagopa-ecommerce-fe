export enum SessionItems {
  sessionToken = "sessionToken",
  outcomeInfo = "outcomeInfo",
}

export const getSessionItem = (item: SessionItems) => {
  try {
    const serializedState = sessionStorage.getItem(item);

    if (!serializedState) {
      return undefined;
    }

    return serializedState;
  } catch (e) {
    return undefined;
  }
};

export function setSessionItem(name: SessionItems, item: string) {
  sessionStorage.setItem(
    name,
    typeof item === "string" ? item : JSON.stringify(item)
  );
}

export const clearStorage = () => {
  sessionStorage.clear();
};
