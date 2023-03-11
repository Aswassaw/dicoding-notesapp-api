const amqp = require("amqplib");

const ProducerService = {
  sendMessage: async (queue, message) => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      const channel = await connection.createChannel();

      // mengecek ketersediaan queue
      await channel.assertQueue(queue, {
        durable: true,
      });

      await channel.sendToQueue(queue, Buffer.from(message));

      // tutup koneksi 1 detik setelah pengiriman antrian
      setTimeout(() => {
        connection.close();
      }, 1000);
    } catch (error) {
      console.log(error.message);
      console.log("Gagal membuat queue");
    }
  },
};

module.exports = ProducerService;
