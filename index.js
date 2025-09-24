import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.render("index.ejs")
});

async function dataExists(url) {
    try {
        const response = await axios.get(url)
        return response.data;
    } catch {
        return null;
    }
}


app.get("/check", async (req, res) => {
    const myPokemon = req.query.pokemon.toLowerCase();
    console.log(myPokemon);
    try {
        const pokemonData = await dataExists(`https://pokeapi.co/api/v2/pokemon/${myPokemon}/`);

        if(!pokemonData) {
            console.log(`${myPokemon} does not exist`);
            return res.send(`${myPokemon} does not exist. Maybe soon though!`);
        }

        const megaData = await dataExists(`https://pokeapi.co/api/v2/pokemon-form/${myPokemon}-mega/`);

        if (megaData) {
            console.log(`${myPokemon} has a mega!`);
            res.send(megaData)
        } else {
            console.log(`${myPokemon} exists but mega does not`);
            res.send(pokemonData);
        }

        // if(myPokemon === 'charizard' || myPokemon === 'mewtwo' || myPokemon === 'raichu')
        // {   
        //     // This needs seperate work since they have 2 diff versions, but this is the api call for it
        //     const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${myPokemon}-mega-y/`);
        // } else {
        //     const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${myPokemon}-mega/`);
        // }
        
        
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.send();
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});