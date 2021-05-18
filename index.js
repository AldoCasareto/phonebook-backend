const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :req[content-length] - :response-time ms :body')
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendick',
    number: '39-23-6423122',
    id: 4,
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

app.post('/api/persons', (req, res) => {
  const body = req.body;
  console.log(body);
  const checkName = persons.find((person) => person.name === body.name);

  if (!body.name || !body.number) {
    console.log(body.name, body.number);
    return res.status(400).json({
      error: 'information is missing',
    });
  }
  if (checkName) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = [
    {
      id: generateId(),
      name: body.name,
      number: body.number,
    },
  ];
  persons = persons.concat(person);

  res.json(person);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  res.send(`<p>PhoneBook has info for ${persons.length} people</p>
   ${new Date()}`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (request, res) => {
  const id = +request.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
