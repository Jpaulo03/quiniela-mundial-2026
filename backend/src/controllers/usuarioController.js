 
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/index');

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nombre', 'correo', 'rol', 'createdAt'],
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.status(200).json({ usuario });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener perfil', error });
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (correo && correo !== usuario.correo) {
      const correoExistente = await Usuario.findOne({ where: { correo } });
      if (correoExistente) {
        return res.status(400).json({ mensaje: 'El correo ya está en uso' });
      }
      usuario.correo = correo;
    }

    if (nombre) {
      usuario.nombre = nombre;
    }

    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    await usuario.save();

    return res.status(200).json({
      mensaje: 'Perfil actualizado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al actualizar perfil', error });
  }
};

module.exports = { obtenerPerfil, actualizarPerfil };