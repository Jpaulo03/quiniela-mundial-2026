 
const { body, validationResult } = require('express-validator');

const manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

const validarRegistro = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('El correo no tiene un formato válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  manejarErrores,
];

const validarLogin = [
  body('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('El correo no tiene un formato válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  manejarErrores,
];

const validarGrupo = [
  body('nombre')
    .notEmpty().withMessage('El nombre del grupo es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  manejarErrores,
];

const validarPronostico = [
  body('partidoId')
    .notEmpty().withMessage('El partido es obligatorio')
    .isInt().withMessage('El partidoId debe ser un número entero'),
  body('golesLocalPronosticado')
    .notEmpty().withMessage('Los goles del local son obligatorios')
    .isInt({ min: 0 }).withMessage('Los goles deben ser un número entero positivo'),
  body('golesVisitantePronosticado')
    .notEmpty().withMessage('Los goles del visitante son obligatorios')
    .isInt({ min: 0 }).withMessage('Los goles deben ser un número entero positivo'),
  manejarErrores,
];

const validarPartido = [
  body('equipoLocal')
    .notEmpty().withMessage('El equipo local es obligatorio'),
  body('equipoVisitante')
    .notEmpty().withMessage('El equipo visitante es obligatorio'),
  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('La fecha no tiene un formato válido'),
  body('fase')
    .notEmpty().withMessage('La fase es obligatoria'),
  body('ciudad')
    .notEmpty().withMessage('La ciudad es obligatoria'),
  body('estadio')
    .notEmpty().withMessage('El estadio es obligatorio'),
  manejarErrores,
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarGrupo,
  validarPronostico,
  validarPartido,
};