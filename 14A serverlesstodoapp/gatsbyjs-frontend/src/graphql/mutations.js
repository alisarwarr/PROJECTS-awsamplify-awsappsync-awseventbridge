/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo($id: ID!, $detail: String!) {
    createTodo(id: $id, detail: $detail) {
      result
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      result
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo($id: ID!, $detail: String!) {
    updateTodo(id: $id, detail: $detail) {
      result
    }
  }
`;
