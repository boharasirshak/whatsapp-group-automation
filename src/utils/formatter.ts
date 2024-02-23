import { MessageAck } from 'whatsapp-web.js'

export function formatMessageAck (ack: MessageAck): string {
  switch (ack) {
    case MessageAck.ACK_ERROR:
      return 'Failed to send'
    case MessageAck.ACK_PENDING:
      return 'Pending to be seen'
    case MessageAck.ACK_SERVER:
      return 'Sent by server'
    case MessageAck.ACK_DEVICE:
      return 'Sent by device'
    case MessageAck.ACK_READ:
      return 'Read by recipient'
    case MessageAck.ACK_PLAYED:
      return 'Played by recipient'
    default:
      return 'Unknown'
  }
}

export function formatNumber(number: string): string {
  number = number.replace(/\+/g, '');
  if (!number.endsWith('@c.us')) {
    number += '@c.us'
  }
  return number
}
