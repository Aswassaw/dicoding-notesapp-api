const { addBookHandler, getAllBooksHandler } = require("./handler");

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
    handler: () => "Mendapatkan buku tertentu",
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
