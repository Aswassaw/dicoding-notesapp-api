const Hapi = require("@hapi/hapi");

const init = async () => {
  try {
    const server = Hapi.server({
      port: 5000,
      host: "localhost",
      routes: {
        cors: {
          origin: ["*"],
        },
      },
    });

    server.route({
      method: "GET",
      path: "/",
      handler: () => "Halaman Home",
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  } catch (error) {
    console.log(error.message);
  }
};

init();
