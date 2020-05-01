require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')
const cors = require('cors')
const helmet = require('helmet')



console.log(process.env.API_TOKEN)


const app = express()
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'
app.use(morgan(morganSetting))

app.use(helmet())
app.use(cors())

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

app.use(function validateBearerToken(req, res, next) {
  const bearerToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN
  console.log('validate bearer token middleware')
  if(bearerToken !== apiToken){
    return res.status(401).json({error: 'ayyy you fucked up, gimme the code!'})
  }
  // move to the next middleware
  next()
})

function handleGetTypes(req, res) {
    res.json(validTypes)
  }

app.get('/types', handleGetTypes)

function handleGetPokemon(req,res){
  let response  = POKEDEX.pokemon
  
  if (req.query.name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }
  if (req.query.type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.type)
    )
  }
  res.send(response)
}

app.get('/pokemon', handleGetPokemon)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})