const NotesHandler = require("./handler");
const routes = require('./routes');

module.exports = {
  name: "notes",
  version: "1.0.0",
  register: async (server, { service, contoh }) => {
    console.log(contoh);

    const notesHandler = new NotesHandler(service);
    server.route(routes(notesHandler))
  },
};
