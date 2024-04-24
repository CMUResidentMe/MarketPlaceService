const { Kafka } = require('kafkajs');
const moment = require('moment-timezone');

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

  getMomentDate = () => {
    return moment().tz(process.env.TIME_ZONE).format("MM-DD HH:mm");
  }

  publishMessage = async (notificationType, topic, message, userId, orderId) => {
    try {
      const eventTime = this.getMomentDate(); // Use moment to format the date
      const notification = {
        notificationType,
        eventTime: eventTime, // Now formatted "MM-DD HH:mm"
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
};
