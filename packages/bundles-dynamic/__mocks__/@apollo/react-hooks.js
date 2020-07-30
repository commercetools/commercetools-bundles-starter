const base = {
  loading: false,
  error: null,
  data: null,
  refetch: jest.fn(),
};

let query = base;
let lazyQuery = base;
let mockLazyQuery = jest.fn();
let mutation = base;
let mockMutation = jest.fn(); // eslint-disable-line import/no-mutable-exports

function createMock(results, options = {}) {
  const { data, error } = results;
  const { onCompleted, onError } = options;
  return jest.fn(() => {
    if (error && onError) {
      onError(error);
    }

    if (data && onCompleted) {
      onCompleted(data);
    }

    return new Promise((resolve, reject) => {
      if (error) {
        reject(error);
      } else {
        resolve({ data });
      }
    });
  });
}

function createMockLazyQuery(options) {
  const mock = createMock(lazyQuery, options);
  mockLazyQuery = mock;
  return mock;
}

function createMockMutation(options) {
  const mock = createMock(mutation, options);
  mockMutation = mock;
  return mock;
}

function getQuery() {
  return query;
}

function getLazyQuery() {
  return mockLazyQuery;
}

function setQuery(value) {
  query = { ...base, ...value };
  query.refetch = createMock(query);
}

function setLazyQuery(value) {
  lazyQuery = { ...base, ...value };
  lazyQuery.refetch = createMock(lazyQuery);
}

function setMutation(value) {
  mutation = { ...base, ...value };
  mutation.refetch = createMock(mutation);
}

const useQuery = jest.fn(() => query);
const useLazyQuery = jest.fn((document, options) => [
  createMockLazyQuery(options),
  lazyQuery,
]);
const useMutation = jest.fn((document, options) => [
  createMockMutation(options),
  mutation,
]);

export {
  useQuery,
  useLazyQuery,
  useMutation,
  mockMutation,
  getQuery,
  getLazyQuery,
  setQuery,
  setLazyQuery,
  setMutation,
};
