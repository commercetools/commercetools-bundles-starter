import React from 'react';

export const intlMock = {
  formatMessage: jest.fn((message) => message.id),
  formatDate: jest.fn(() => 'xxx'),
  formatTime: jest.fn(() => 'xxx'),
  formatRelative: jest.fn(() => 'xxx'),
  formatNumber: jest.fn((number) => number.toString()),
  formatPlural: jest.fn(() => 'xxx'),
  formatHTMLMessage: jest.fn(() => 'xxx'),
  now: jest.fn(() => 'xxx'),
  locale: 'en',
};

// https://github.com/airbnb/enzyme/issues/2086#issuecomment-549736940
export const useEffectMock = (effect, deps) => {
  const firstRun = Symbol('firstRun');
  const isFirstRun = React.useMemo(() => firstRun, []) === firstRun;
  const ref = React.useMemo(
    () => ({
      current: deps,
    }),
    []
  );
  const last = ref.current;
  const changed = deps && last.some((value, i) => value !== deps[i]);

  if (isFirstRun || changed) {
    ref.current = deps;
    effect();
  }
};
