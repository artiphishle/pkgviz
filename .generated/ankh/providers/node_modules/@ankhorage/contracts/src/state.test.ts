import { describe, expect, it } from 'bun:test';

import type {
  StateAdapter,
  StateListener,
  StatePath,
  StateResult,
  StateSubscription,
  StateValue,
} from './state';

function pathToKey(path: StatePath): string {
  return Array.isArray(path) ? path.join('.') : path;
}

function isStateValue(value: unknown): value is StateValue {
  if (value === null) {
    return true;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isStateValue);
  }

  if (typeof value !== 'object') {
    return false;
  }

  return Object.values(value).every(isStateValue);
}

function createError(code: string, message: string): StateResult {
  return {
    ok: false,
    error: { code, message },
  };
}

function createFakeStateAdapter(): StateAdapter {
  const values = new Map<string, StateValue>();
  const listeners = new Map<string, Set<StateListener>>();

  const emit = (path: StatePath, value: StateValue | undefined) => {
    const key = pathToKey(path);
    const pathListeners = listeners.get(key);

    if (!pathListeners) {
      return;
    }

    for (const listener of pathListeners) {
      listener({ path, value });
    }
  };

  return {
    capabilities: {
      subscriptions: true,
      computed: false,
      persistence: false,
    },
    get(path) {
      return { ok: true, data: values.get(pathToKey(path)) };
    },
    set(path, value) {
      if (!isStateValue(value)) {
        return createError('invalid_value', 'State value must be serializable.');
      }

      values.set(pathToKey(path), value);
      emit(path, value);
      return { ok: true };
    },
    subscribe(path, listener) {
      const key = pathToKey(path);
      const pathListeners = listeners.get(key) ?? new Set<StateListener>();
      pathListeners.add(listener);
      listeners.set(key, pathListeners);

      const subscription: StateSubscription = {
        unsubscribe() {
          pathListeners.delete(listener);
          if (pathListeners.size === 0) {
            listeners.delete(key);
          }
        },
      };

      return { ok: true, data: subscription };
    },
    delete(path) {
      values.delete(pathToKey(path));
      emit(path, undefined);
      return { ok: true };
    },
  };
}

describe('StateAdapter', () => {
  it('supports path-based set and get', () => {
    const adapter = createFakeStateAdapter();

    const setResult = adapter.set(['forms', 'contact', 'values'], {
      firstname: 'Fabio',
      newsletter: true,
    });
    const getResult = adapter.get(['forms', 'contact', 'values']);

    expect(setResult).toEqual({ ok: true });
    expect(getResult).toEqual({
      ok: true,
      data: {
        firstname: 'Fabio',
        newsletter: true,
      },
    });
  });

  it('supports string paths and serializable nested values', () => {
    const adapter = createFakeStateAdapter();
    const value: StateValue = {
      selectedIds: ['post-1', 'post-2'],
      filters: {
        search: 'hello',
        onlyPublished: true,
      },
    };

    adapter.set('collections.posts', value);

    expect(adapter.get('collections.posts')).toEqual({ ok: true, data: value });
  });

  it('notifies subscribers when a value changes', () => {
    const adapter = createFakeStateAdapter();
    const snapshots: StateValue[] = [];
    const subscriptionResult = adapter.subscribe('counter.value', ({ value }) => {
      if (value !== undefined) {
        snapshots.push(value);
      }
    });

    adapter.set('counter.value', 1);
    adapter.set('counter.value', 2);

    expect(subscriptionResult.ok).toBe(true);
    expect(snapshots).toEqual([1, 2]);
  });

  it('stops notifying after unsubscribe', async () => {
    const adapter = createFakeStateAdapter();
    const snapshots: StateValue[] = [];
    const subscriptionResult = adapter.subscribe('counter.value', ({ value }) => {
      if (value !== undefined) {
        snapshots.push(value);
      }
    });

    if (!subscriptionResult.ok) {
      throw new Error('Expected subscription to succeed.');
    }

    adapter.set('counter.value', 1);
    await subscriptionResult.data.unsubscribe();
    adapter.set('counter.value', 2);

    expect(snapshots).toEqual([1]);
  });

  it('supports deleting values when the adapter implements delete', () => {
    const adapter = createFakeStateAdapter();
    const snapshots: (StateValue | undefined)[] = [];
    adapter.subscribe('session.user', ({ value }) => {
      snapshots.push(value);
    });

    adapter.set('session.user', { id: 'user-1' });
    const deleteResult = adapter.delete?.('session.user');

    expect(deleteResult).toEqual({ ok: true });
    expect(adapter.get('session.user')).toEqual({ ok: true, data: undefined });
    expect(snapshots).toEqual([{ id: 'user-1' }, undefined]);
  });
});
