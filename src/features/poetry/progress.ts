import { useEffect, useState } from 'react';
import { findPoem } from './model';

const storageKey = 'time-travel-guide:memorized:v1';

function loadProgress(): Set<string> {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (Array.isArray(stored)) {
      return new Set(stored.filter((id): id is string => typeof id === 'string' && Boolean(findPoem(id))));
    }
  } catch {
    // Browser restrictions or malformed saved data still allow in-session progress.
  }
  return new Set();
}

export function useProgress() {
  const [memorized, setMemorized] = useState(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...memorized]));
    } catch {
      // Keep the in-memory state when storage is unavailable.
    }
  }, [memorized]);

  function toggleMemorized(id: string) {
    setMemorized((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return { memorized, toggleMemorized };
}
