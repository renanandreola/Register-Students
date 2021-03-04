// PARA INSTALAR OS COMPONENTES:
//  abrir o terminal na pasta do arquivo desejado e utilizar o comando:
//  ' npm init -y '
//  esse comando vai criar o package.json com arquivos padrões
//  após, utilizar o comando:
//  ' npm install restify '
//  esse comando cria o package-look.json
//  ' npm install nodemon -g '
//  o nodemon inicializa o npm automaticamenete com as atualizacoes do código
//  para executar:
//  ' nodemon server.js '
//  instalar o mongoose pelo comando:
//  ' npm install mongoose '

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const restify = require('restify');
const mongoose = require('mongoose');
const MONGODB_URL = 'mongodb+srv://renan:renan@cluster-aluno-ijbjr.gcp.mongodb.net/store?retryWrites=true&w=majority';
const StudentsSchema = require('./Schemas/Students');
const md5 = require('md5');

var port = process.env.PORT || 3000;

let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.set('engine', env);

require('useful-nunjucks-filters')(env);

const Students = mongoose.model('students', StudentsSchema);

//MONGO
mongoose.connect(MONGODB_URL, {useNewUrlParser: true}, err => {
    if (err) {
        console.error('[SERVER_ERROR] MongoDB Connection:', err);
        process.exit(1);
    }
    console.info('Mongo connected');


    app.listen(port, () => {
      console.log('Escutando na porta ' + port);
    });

});


//

//NUNJUCKS
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
extended: true
}));

app.use(express.static('public'));

//

//PÁGINAS
app.get('/', (req, res) => {
  res.render('index.html');
});

//

//REQUISIÇÃO
app.post('/form', (req, res) => {
  var student = new Students(req.body);

  if (student.password && student.password.length > 0) {
    student.password = md5(student.password);
  }

  student.save((err, student) => {
    console.info(student.name + ' salvo');
    res.send('ok');
  })
});

app.put('/form', (req, res) => {
  const data = req.body;
  if (data.password && data.password.length > 0) {
    data.password = md5(data.password);
  }
  Students.updateOne({_id: data._id}, data,  (err, student) => {
    console.info(data.name + ' salvo');
    res.send('ok');
  });
});

app.get('/form', (req, res) => {
  Students.find((err, students) => {
       res.render('form.html', {students: students});
     });
 });

 app.delete('/form/:id', (req, res) => {
  Students.findOneAndRemove({_id: req.params.id}, (err, obj) => {
    if(err) {
      res.send('error');
    }
    res.send('ok');
  });
});
//

//API
app.get('/api/students', (req, res) => {
  res.send(listStudents);
});

app.get('/api/students/:id', (req, res) => {
  Students.find({"_id": req.params.id }, (err, obj) => {
      if (err) {
        res.send(null);
      } else {
        const student = obj[0];
        res.send(student);
      }
  });
});
