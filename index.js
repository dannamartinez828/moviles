const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// 🔥 PRIMERO creas app
const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Pokedex',
      version: '1.0.0',
      description: 'Documentación del microservicio de Pokémon'
    },
    servers: [
      {
        url: 'https://moviles-production-819b.up.railway.app'
      }
    ]
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(options);


app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
    },
  })
);

// 🔥 DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/**
 * @swagger
 * /pokemon/nombre/{nombre}:
 *   get:
 *     summary: Obtener un Pokémon por nombre
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del Pokémon
 *     responses:
 *       200:
 *         description: Pokémon encontrado
 *       404:
 *         description: Este pokemon puede estar perdido
 */
app.get('/pokemon/nombre/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre.toLowerCase();

    const result = await pool.query(
      'SELECT * FROM pokemon WHERE LOWER(nombre) = $1',
      [nombre]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'este pokemon puede estar perdido'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 🔥 servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});