const { nanoid } = require('nanoid');
const booksData = require('./books');

const errorHandler = (error, h) => {
  const response = h.response({
    status: 'error',
    message: error.message,
  });
  response.code(500);
  return response;
};

const addBookHandler = (req, h) => {
  try {
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
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });

      response.code(400);
      return response;
    }

    // Jika client melampirkan nilai properti readPage lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
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
        status: 'error',
        message: 'Buku gagal ditambahkan',
      });

      response.code(500);
      return response;
    }

    // Jika add data buku berhasil
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  } catch (error) {
    return errorHandler(error, h);
  }
};

const getAllBooksHandler = (req, h) => {
  try {
    let books = null;
    const {
      name: nameQuery,
      finished: finishedQuery,
      reading: readingQuery,
    } = req.query;

    if (nameQuery) {
      books = booksData.filter((b) => b.name.toLowerCase().includes(nameQuery.toLowerCase()));
    } else if (readingQuery) {
      books = booksData.filter((b) => b.reading === Boolean(parseInt(readingQuery, 10)));
    } else if (finishedQuery) {
      books = booksData.filter((b) => b.finished === Boolean(parseInt(finishedQuery, 10)));
    } else {
      books = booksData;
    }

    books = books.map((b) => {
      const { id, name, publisher } = b;
      return {
        id,
        name,
        publisher,
      };
    });

    return {
      status: 'success',
      data: { books },
    };
  } catch (error) {
    return errorHandler(error, h);
  }
};

const getBookByIdHandler = (req, h) => {
  try {
    const { bookId } = req.params;
    const book = booksData.filter((b) => b.id === bookId)[0];

    // Jika buku tidak ditemukan
    if (!book) {
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });

      response.code(404);
      return response;
    }

    // Jika buku ditemukan
    return {
      status: 'success',
      data: {
        book,
      },
    };
  } catch (error) {
    return errorHandler(error, h);
  }
};

const editBookByIdHandler = (req, h) => {
  try {
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
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });

      response.code(400);
      return response;
    }

    // Jika client melampirkan nilai properti readPage lebih besar dari nilai properti pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });

      response.code(400);
      return response;
    }

    // Jika id tidak ditemukan
    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
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
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  } catch (error) {
    return errorHandler(error, h);
  }
};

const deleteBookByIdHandler = (req, h) => {
  try {
    const { bookId } = req.params;
    const index = booksData.findIndex((b) => b.id === bookId);

    // Jika buku tidak ditemukan
    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });

      response.code(404);
      return response;
    }

    // Jika buku ditemukan
    booksData.splice(index, 1);

    return {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
  } catch (error) {
    return errorHandler(error, h);
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
