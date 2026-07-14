import { useCallback, useSyncExternalStore } from "react";

type ItemOption = {
  id: string;
  name: string;
  category: {
    name: string;
    id: string;
  } | null;
};

const EMPTY_RECENT_ITEMS: ItemOption[] = [];

const recentItemsCache = new Map<
  string,
  {
    raw: string | null;
    value: ItemOption[];
  }
>();

function getRecentItemsKey(groupId: string) {
  return `recentItems-${groupId}`;
}

function readRecentItems(storageKey: string) {
  const raw = window.localStorage.getItem(storageKey);
  const cached = recentItemsCache.get(storageKey);

  if (cached?.raw === raw) {
    return cached.value;
  }

  if (!raw) {
    recentItemsCache.set(storageKey, {
      raw,
      value: EMPTY_RECENT_ITEMS,
    });

    return EMPTY_RECENT_ITEMS;
  }

  try {
    const value = JSON.parse(raw) as ItemOption[];

    recentItemsCache.set(storageKey, {
      raw,
      value,
    });

    return value;
  } catch {
    recentItemsCache.set(storageKey, {
      raw,
      value: EMPTY_RECENT_ITEMS,
    });

    return EMPTY_RECENT_ITEMS;
  }
}

export function useRecentItems(groupId: string) {
  const storageKey = getRecentItemsKey(groupId);

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener("recent-items-change", callback);

    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener("recent-items-change", callback);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return readRecentItems(storageKey);
  }, [storageKey]);

  const getServerSnapshot = useCallback(() => {
    return EMPTY_RECENT_ITEMS;
  }, []);

  const recentItems = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setRecentItems = useCallback(
    (nextItems: ItemOption[] | ((prev: ItemOption[]) => ItemOption[])) => {
      const current = readRecentItems(storageKey);

      const resolvedItems =
        typeof nextItems === "function" ? nextItems(current) : nextItems;

      const raw = JSON.stringify(resolvedItems);

      recentItemsCache.set(storageKey, {
        raw,
        value: resolvedItems,
      });

      window.localStorage.setItem(storageKey, raw);
      window.dispatchEvent(new Event("recent-items-change"));
    },
    [storageKey],
  );

  return [recentItems, setRecentItems] as const;
}
