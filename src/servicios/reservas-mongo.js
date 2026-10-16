const mongoose = require("mongoose");
const { Producto } = require("../modelos/reservas");

function representarReserva(documento) 
{
  return {
    id: documento._id.toString(),
    estudiante: documento.estudiante,
    email: documento.email,
    sala: documento.sala,
    fecha: documento.fecha,
    turno: documento.turno,
    personas: documento.personas,
    estado: documento.estado
  };
}

function crearServicioReservasMongo() 
{
  async function listar(categoria) {

    const filtro = {};

    if (categoria !== undefined) 
    {
      if (typeof categoria !== "string" || !categoria.trim()) 
      {
        const error = new Error("Categoría inválida");
        error.codigo = "FILTRO_INVALIDO";
        throw error;
      }
      filtro.categoria = categoria.trim();
    }

    const documentos = await Producto.find(filtro).lean();
    return documentos.map(representarProducto);
  }
  async function obtenerPorId(id) 
  {
    if (!mongoose.isObjectIdOrHexString(id)) 
    {
      const error = new Error("Identificador inválido");
      error.codigo = "ID_INVALIDO";
      throw error;
    }

    const documento = await Producto.findById(id).lean();
    return documento ? representarProducto(documento) : null;
  }

  async function crear(datos) 
  {
    const documento = await Producto.create({
      nombre: datos.nombre,
      categoria: datos.categoria,
      precio: datos.precio,
      descripcion: datos.descripcion,
    });

    return representarProducto(documento);
  }

  return { listar, obtenerPorId, crear };
}

module.exports = { crearServicioReservasMongo };
