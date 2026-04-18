
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
  connectionString: 'postgresql://postgres.kpqvhoespkaxwlzpqzqj:cielphantomhive@aws-1-sa-east-1.pooler.supabase.com:6543/postgres'
});

app.get('/pokemon/nombre/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre.toLowerCase();

    console.log("Buscando:", nombre);

    const result = await pool.query(
      'SELECT * FROM pokemon WHERE LOWER(nombre) = $1',
      [nombre]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("ERROR REAL:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/pokemon/nombre/:nombre', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM pokemon WHERE LOWER(nombre) = LOWER($1)',
    [req.params.nombre]
  );
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});