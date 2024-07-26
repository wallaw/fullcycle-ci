const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Gera uma nova questão de adição
function generateQuestion() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    num1,
    num2,
    answer: num1 + num2
  };
}

app.get('/', (req, res) => {
  const question = generateQuestion();
  req.session.question = question;
  res.render('index', { question });
});

app.post('/submit', (req, res) => {
  const { answer } = req.body;
  const correctAnswer = req.session.question.answer;
  let result;

  if (parseInt(answer, 10) === correctAnswer) {
    result = 'Correto!';
  } else {
    result = `Incorreto! A resposta correta é ${correctAnswer}.`;
  }

  const question = generateQuestion();
  req.session.question = question;
  res.render('result', { result, question });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
