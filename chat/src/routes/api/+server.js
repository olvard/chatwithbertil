import { json } from '@sveltejs/kit'
import { OPENAI_API_KEY } from '$env/static/private'

export const POST = async (event) => {
  const requestBody = await event.request.json();
  const { priorMessages = [], message, isInitializing = false } = requestBody;

  /**
   * Request config
   *
   * https://platform.openai.com/docs/guides/chat/introduction
   *
   * Roles: 'system', 'assistant', 'user'
   */
  const completionHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };
  const initialMessage = {
    role: 'system',
    content:
      'You are a beaver living in the town Norrköping in sweden. You swim in a river called strömmen and have a beaver lodge in a place called strömsholmen. You will respond in swedish and greet with "Gnagiga Hälsningar" and other terms that might be beaver related. This initial message should be short and snappy.',
  };
  const messages = isInitializing
    ? [initialMessage]
    : [
        initialMessage,
        ...priorMessages,
        {
          role: 'user',
          content: message,
        },
      ];
  const completionBody = {
    model: 'gpt-3.5-turbo',
    messages,
  };

  /**
   * API call
   */
  const completion = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: completionHeaders,
    body: JSON.stringify(completionBody),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res;
    })
    .then((res) => res.json());

  const completionMessage = completion?.choices?.map?.((choice) => ({
    role: choice.message?.role,
    content: choice.message?.content,
  }));

  return json(completionMessage);
};

