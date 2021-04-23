/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addBookmark = /* GraphQL */ `
  mutation AddBookmark(
    $id: ID!
    $title: String!
    $url: String!
    $description: String!
  ) {
    addBookmark(id: $id, title: $title, url: $url, description: $description) {
      result
    }
  }
`;
export const delBookmark = /* GraphQL */ `
  mutation DelBookmark($id: ID!) {
    delBookmark(id: $id) {
      result
    }
  }
`;
