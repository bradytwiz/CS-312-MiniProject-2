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

app.get("/check", async (req, res) => {
    const myPokemon = req.query.pokemon.toLowerCase();
    console.log(myPokemon);
    try {
        if(myPokemon === 'charizard' || myPokemon === 'mewtwo' || myPokemon === 'raichu')
        {   
            // This needs seperate work since they have 2 diff versions, but this is the api call for it
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${myPokemon}-mega-y/`);
        } else {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${myPokemon}-mega/`);
        }
        const result = response.data;
        res.send(result);
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.send(`${myPokemon} cannot mega evolve (yet). Maybe soon though!`);
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});