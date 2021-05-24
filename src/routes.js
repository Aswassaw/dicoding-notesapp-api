const { addBookHandler, getAllBooksHandler, getBookByIdHandler } = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookByIdHandler,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: () => "Mengubah data buku",
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: () => "Menghapus buku tertentu",
  },
];

module.exports = routes;
