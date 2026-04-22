const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

/* 🔥 SWAGGER (FUNCIONA 100%) */
const swaggerUi = require('swagger-ui-express');

const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'API Pokedex',
    version: '1.0.0',
    description: 'Microservicio Pokémon'
  },
  servers: [
  {
    url: '/'
  }
],
  paths: {
    '/pokemon/nombre/{nombre}': {
      get: {
        summary: 'Buscar Pokémon por nombre',
        parameters: [
          {
            name: 'nombre',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Ej: pikachu'
          }
        ],
        responses: {
          200: {
            description: 'Pokémon encontrado',
            content: {
              'application/json': {
                example: {
                  nombre: 'pikachu',
                  altura: 0.4,
                  peso: 6,
                  tipos: 'electrico',
                  imagen_frontal: 'url',
                  imagen_posterior: 'url',
                  imagen_shiny: 'url'
                }
              }
            }
          },
          404: {
            description: 'Este pokemon puede estar perdido',
            content: {
              'application/json': {
                example: {
                  error: 'este pokemon puede estar perdido'
                }
              }
            }
          }
        }
      }
    }
  }
};

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list'
    }
  })
);
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocs);
});

/* 🔥 BASE DE DATOS (SUPABASE) */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ✅ RUTA BASE */
app.get('/', (req, res) => {
  res.send('🚀 API Pokedex funcionando');
});

/* 🔍 BUSCAR POKÉMON */
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

/* 🔥 SERVIDOR */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});