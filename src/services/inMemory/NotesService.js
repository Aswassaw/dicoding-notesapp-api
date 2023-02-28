const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class NotesService {
  constructor() {
    this._notes = [];
  }

  addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      id,
      title,
      body,
      tags,
      createdAt,
      updatedAt,
    };

    this._notes.push(newNote);

    const isSuccess = this._notes.filter((note) => note.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError("Catatan gagal ditambahkan");
    }

    return id;
  }

  getNotes() {
    return this._notes;
  }

  getNoteById(id) {
    const note = this._notes.filter((note) => note.id === id);

    if (Boolean(note.length > 0)) {
      return note[0];
    }

    throw new NotFoundError("Catatan tidak ditemukan");
  }

  editNoteById(id, { title, body, tags }) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
    }

    const updatedAt = new Date().toISOString();

    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
    }
    this._notes.splice(index, 1);
  }
}

module.exports = NotesService;
