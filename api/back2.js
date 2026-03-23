const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '2127624',
  key: 'b50f0ba6a9a5cd200f68',
  secret: '07aeac96be754b929887',
  cluster: 'us2',
  useTLS: true
});

const jsondata = require('../messages2.json');
const messageHistory = jsondata.messages;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ messages: messageHistory });
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { username, message } = req.body;

  messageHistory.unshift({ username, message });
  if (messageHistory.length > 100) messageHistory.pop();

  try {
    await pusher.trigger('chan2', 'msg', { username, message });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
