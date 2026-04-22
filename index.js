const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

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
      description: 'Microservicio Pokémon'
    },
    servers: [
      {
        url: 'https://moviles1-production.up.railway.app'
      }
    ]
  },
  apis: ['**/*.js'], // 🔥 MUY IMPORTANTE
};

const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🔥 DB (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ Ruta base
app.get('/', (req, res) => {
  res.send('🚀 API Pokedex funcionando');
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

// 🔍 Buscar Pokémon
app.get('/pokemon/nombre/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre.toLowerCase();
    console.log("🔍 Buscando:", nombre);

    const result = await pool.query(
      'SELECT * FROM pokemon WHERE LOWER(nombre) = $1',
      [nombre]
    );

    console.log("📦 RESULT:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'este pokemon puede estar perdido'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("❌ ERROR REAL:", error);

    res.status(500).json({
      error: 'Error conectando con la base de datos'
    });
  }
});

// 🔥 servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});