const { nanoid } = require("nanoid");
let books = require("./books");

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  // Jika client tidak melampirkan property name
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });

    response.code(400);
    return response;
  }

  // Jika client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // Jika add data buku berhasil
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  // Jika add data buku gagal
  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = () => {
  books = books.map((book) => {
    const { id, name, publisher } = book;
    return {
      id,
      name,
      publisher,
    };
  });

  return {
    status: "success",
    data: { books },
  };
};

module.exports = { addBookHandler, getAllBooksHandler };
