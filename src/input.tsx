import React, { useState } from 'react';
import axios from 'axios';

interface Definition {
  definition: string;
  example: string;
}

function WordInput() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState<Definition | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: `${word} meaning and sentence`,
        max_tokens: 60,
        n: 1,
        stop: '\n'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      });
      const data = response.data.choices[0].text;
      const regex = new RegExp(`${word}: (.+?) Example: (.+?)\n`);
      const match = regex.exec(data);
      if (match) {
        setDefinition({ definition: match[1], example: match[2] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="text" value={word} onChange={(event) => setWord(event.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {definition ? (
        <div>
          <h2>{word}</h2>
          <p>{definition.definition}</p>
          <p><em>Example: {definition.example}</em></p>
        </div>
      ) : null}
    </div>
  );
}
export default WordInput;
export {};
