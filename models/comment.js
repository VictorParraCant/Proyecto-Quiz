// Definicion del modelo de Quiz con validación
module.exports = function (sequelize, DataTypes) {

  var commentModel = {
    texto: {
      type: DataTypes.STRING,
      validate: { notEmpty: { msg: '-> Falta comentario' }}
    },
    publicado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  };

  return sequelize.define('Comment', commentModel);

};
