import { config } from '@notifications/config';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';
import { sendEmail } from '@notifications/queues/mail.transport';
import { winstonLogger, IEmailLocals } from '@flowercordoba/task-shared-library';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    const exchangeName = 'task-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const taskQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(taskQueue.queue, exchangeName, routingKey);
    channel.consume(taskQueue.queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Zx2NPXR/task-habitando.png',
        username,
        verifyLink,
        resetLink
      };
      await sendEmail(template, receiverEmail, locals);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
  }
}

export { consumeAuthEmailMessages };
