const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

let contacts = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('content', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :content'
  )
);

app.get('/api/persons', (request, response) => {
  response.json(contacts);
});

app.get('/info', (request, response) => {
  const p1 = `<h1>Phonebook has info for ${contacts.length} people</h1>`;
  const today = new Date();
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const p2 = `<h2>${weekday[today.getDay()]}, ${today.toLocaleString()}</h2>`;
  response.send(`${p1}${p2}`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.find(c => c.id === id);

  if (!contact) {
    return response
      .status(404)
      .send(`Contact with id ${id} cannot be found`)
      .end();
  }

  response.json(contact);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  contacts = contacts.filter(c => c.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' }).end();
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number missing' }).end();
  }

  if (contacts.find(c => c.name === body.name)) {
    return response.status(400).json({ error: 'name exists' }).end();
  }

  const newContact = {
    id: getRandomId(),
    name: body.name,
    number: body.number,
  };

  contacts = contacts.concat(newContact);
  response.json(newContact);
});

const getRandomId = () => Math.floor(Math.random() * 10000000000000);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
