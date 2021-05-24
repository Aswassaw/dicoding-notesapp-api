const { nanoid } = require("nanoid");
const booksData = require("./books");

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

  booksData.push(newBook);
  const isSuccess = booksData.filter((book) => book.id === id).length > 0;

  // Jika add data buku gagal
  if (!isSuccess) {
    const response = h.response({
      status: "error",
      message: "Buku gagal ditambahkan",
    });

    response.code(500);
    return response;
  }

  // Jika add data buku berhasil
  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });

  response.code(201);
  return response;
};

const getAllBooksHandler = (req) => {
  let books = [...booksData];
  const {
    name: nameQuery,
    finished: finishedQuery,
    reading: readingQuery,
  } = req.query;

  // Jika terdapat query param dengan key name
  if (nameQuery) {
    books = books
      .filter((b) => b.name.toLowerCase().includes(nameQuery.toLowerCase()))
      .map((b) => {
        const { id, name, publisher } = b;
        return {
          id,
          name,
          publisher,
        };
      });
  } else if (readingQuery) {
    books = books
      .filter((b) => b.reading === Boolean(parseInt(readingQuery, 10)))
      .map((b) => {
        const { id, name, publisher } = b;
        return {
          id,
          name,
          publisher,
        };
      });
  } else if (finishedQuery) {
    books = books
      .filter((b) => b.finished === Boolean(parseInt(finishedQuery, 10)))
      .map((b) => {
        const { id, name, publisher } = b;
        return {
          id,
          name,
          publisher,
        };
      });
  } else {
    books = books.map((b) => {
      const { id, name, publisher } = b;
      return {
        id,
        name,
        publisher,
      };
    });
  }

  return {
    status: "success",
    data: { books },
  };
};

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const book = booksData.filter((b) => b.id === bookId)[0];

  // Jika buku tidak ditemukan
  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  // Jika buku ditemukan
  return {
    status: "success",
    data: {
      book,
    },
  };
};

const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
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
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = booksData.findIndex((b) => b.id === bookId);

  // Jika client tidak melampirkan property name
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });

    response.code(400);
    return response;
  }

  // Jika client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  }

  // Jika id tidak ditemukan
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  // Jika id ditemukan
  booksData[index] = {
    ...booksData[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });

  response.code(200);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const index = booksData.findIndex((b) => b.id === bookId);

  // Jika buku tidak ditemukan
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  // Jika buku ditemukan
  booksData.splice(index, 1);

  return {
    status: "success",
    message: "Buku berhasil dihapus",
  };
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
