
const { Kafka } = require('kafkajs')


class KafkaService {
  constructor() {
    this.producer = null;
  }

  initService = async () => {
    try {
      const kafka = new Kafka({
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER]
      });
      const producer = kafka.producer()
      await producer.connect();
      this.producer = producer;
      console.log("Kafka Producer connected successfully.")

    } catch (err) {
      console.log(err);
    }
  }

  publishMessage = async (notificationType, topic, message, userId, orderId) => {
    try {
      const notification = {
        notificationType,
        eventTime: new Date().toISOString(),
        owner: userId,
        message,
        sourceID: orderId,
      };
      await this.producer.send({
        topic: topic,
        messages: [
          { value: JSON.stringify(notification) }
        ]
      });
      console.log(`Notification sent: ${JSON.stringify(notification)}`);
    } catch (err) {
      console.log(err);
    }
  }

  closeService = async () => {
    try {
      await this.producer.disconnect();
    } catch (err) {
      console.log(err);
    }
  }

}

module.exports = {
    KafkaService
}

