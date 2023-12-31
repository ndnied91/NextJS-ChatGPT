import { Configuration, OpenAIApi } from 'openai';
import { withNextSession } from '@/lib/session';
import bots from './bots.json';

import dBconnect from '@/lib/lowDb';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const USER_NAME = 'Human';
const MEMORY_SIZE = 6;

export default withNextSession(async (req, res) => {
  if (req.method === 'POST') {
    const body = req.body;
    const { stack } = req.query;
    const prompt = body.prompt || '';
    const user = { uid: 'u1' };
    console.log('user');
    console.log(user);

    if (!configuration.apiKey) {
      return res
        .status(500)
        .json({ error: { message: 'OpenAI API key is missing' } });
    }

    if (!user) {
      return res.status(500).json({ error: { message: 'Session is missing' } });
    }

    try {
      const db = await dBconnect();
      db.data.messageHistory[user.uid] = db.data.messageHistory[user.uid] || []; // if we have data, provide data, if not then init an empty array
      // db.data.messageHistory[user.uid] ||= []; // short hand way to write above statment

      db.data.messageHistory[user.uid].push(`${USER_NAME}: ${prompt}\n`);

      const aiPrompt = bots[stack].prompt;
      const aiName = bots[stack].name;

      const openai = new OpenAIApi(configuration);
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt:
          aiPrompt + db.data.messageHistory[user.uid].join('') + aiName + ':',
        temperature: 0.7, // randoness
        max_tokens: 1024, //1 token === 4 characters
      });

      const aiResponse = completion.data.choices[0].text.trim();
      db.data.messageHistory[user.uid].push(
        `${bots[stack].name}: ${aiResponse}\n`
      );

      if (db.data.messageHistory[user.uid].length > MEMORY_SIZE) {
        db.data.messageHistory[user.uid].splice(0, 2); //removes first two items
      }

      await db.write();

      return res.status(200).json({ result: aiResponse });
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ error: { message: e.message } });
    }
  } else if (req.method === 'PUT') {
    //send request to api
    const { uid } = req.query;

    if (!uid) {
      return res.status(500).json({ error: { message: 'Not a valid uid' } });
    }

    req.session.user = {
      uid,
    };

    await req.session.save();
    //this will store the session in the cookie

    return res.status(200).json(uid);
  } else if (req.method === 'DELETE') {
    const { user } = req.session;

    if (user) {
      const db = await dBconnect();
      db.data.messageHistory[user.uid] = [];
      await db.write();
      return res.status(200).json({ message: 'History Clearned' });
    }
    return res.status(200).json({ message: 'Nothing to clear' });
  } else {
    return res.status(500).json({ error: { message: 'Invalid Api Route' } });
  }
});
