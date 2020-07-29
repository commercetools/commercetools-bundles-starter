const base = {
  loading: false,
  error: null,
  data: null,
  refetch: jest.fn()
};

let query = base;
let mutation = base;
let mockMutation; // eslint-disable-line import/no-mutable-exports

function createMockMutation(options) {
  const { onCompleted, onError } = options || {};
  const { data, error } = mutation;
  mockMutation = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        if (error) {
          if (onError) {
            onError(error);
          }
          reject(error);
        } else {
          if (onCompleted) {
            onCompleted(data);
          }
          resolve(data);
        }
      })
  );
  return mockMutation;
}

function getQuery() {
  return query;
}

function setQuery(value) {
  query = { ...base, ...value };
  query.refetch = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        query.error ? reject(query.error) : resolve(query.data);
      })
  );
}

function setMutation(value) {
  mutation = { ...base, ...value };
  mutation.refetch = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        mutation.error ? reject(mutation.error) : resolve(mutation.data);
      })
  );
}

const useQuery = jest.fn(() => query);

const useMutation = jest.fn((document, options) => [
  createMockMutation(options),
  mutation
]);

export { useQuery, useMutation, mockMutation, getQuery, setQuery, setMutation };
