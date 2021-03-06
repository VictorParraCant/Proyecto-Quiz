var path = require('path');

// Postgres DATABASE_URL = postgres://user:password@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = ( url[6] || null );
var user      = ( url[2] || null );
var pwd       = ( url[3] || null );
var protocol  = ( url[1] || null );
var dialect   = ( url[1] || null );
var port      = ( url[5] || null );
var host      = ( url[4] || null );
var storage   = process.env.DATABASE_STORAGE;

// Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o PostgreSQL
var sequelize = new Sequelize(DB_name, user, pwd, {
  dialect   : protocol,
  protocol  : protocol,
  port      : port,
  host      : host,
  storage   : storage, // solo SQLite (.env)
  omitNull  : true    // solo PostgreSQL
});

// Importar la definición de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definción de la tabla Comments
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Relaciones entre tablas (1-a-N)
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportar la definiciones de tablas
exports.Quiz = Quiz;
exports.Comment = Comment;

// Crea e inicializa la tabla de preguntas en la DB
sequelize
  .sync()
  .then(function () {
    Quiz
      .count()
      .then(function (count) {

        // La tabla se inicializa sólo si está vacía
        if (count === 0) {
          Quiz.create({
            pregunta  : "Capital de Italia",
            respuesta : "Roma",
            tema: "humanidades"
          });
          Quiz.create({
            pregunta  : "Capital de Portugal",
            respuesta : "Lisboa",
            tema: "humanidades"
          })
          .then(function () {
            console.log("Base de datos inicializada");
          });
        }
      });
  });
