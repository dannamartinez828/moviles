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
        url: 'https://moviles-production-819b.up.railway.app'
      }
    ]
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🔥 CONEXIÓN DB (con debug)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // 🔥 IMPORTANTE para Supabase
});

// 🔍 ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 API funcionando');
});

/**
 * @swagger
 * /pokemon/nombre/{nombre}:
 *   get:
 *     summary: Obtener un Pokémon por nombre
 */
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


app.get('/', (req, res) => {
  res.send('🚀 API Pokedex funcionando');
});


// 🔥 servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
