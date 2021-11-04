const base = {
  loading: false,
  error: null,
  data: null,
  refetch: jest.fn(),
};

let query = base;
let mutation = base;
const mockMutations = {};

function createMockMutation(document, options = {}) {
  const { onCompleted, onError } = options;
  const { data, error } = mutation;
  const mock = jest.fn(
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
  mockMutations[JSON.stringify(document)] = mock;
  return mock;
}

function getQuery() {
  return query;
}

function getMutation(document) {
  return mockMutations[JSON.stringify(document)];
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
  createMockMutation(document, options),
  mutation,
]);

export { useQuery, useMutation, getQuery, getMutation, setQuery, setMutation };
