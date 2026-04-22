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
      url: 'https://moviles1-production.up.railway.app'
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
            description: 'Nombre del Pokémon (ej: pikachu)'
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));