import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// two speicific special cases, that must be hard coded in because they require a different api call
const xyForms = ["charizard", "mewtwo"]

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
        console.log(pokemonData);

        if(!pokemonData) {
            console.log(`${myPokemon} does not exist`);
            res.render("index.ejs", {noData: myPokemon});
            return;
        }
        let megaData = null;

        if(xyForms.includes(myPokemon))
        {   
            // if they have two forms randomly send one of them back
            if (Math.floor(Math.random() * 2) + 1 == 1) {
                megaData = await dataExists(`https://pokeapi.co/api/v2/pokemon/${myPokemon}-mega-x/`);
            } else {
                megaData = await dataExists(`https://pokeapi.co/api/v2/pokemon/${myPokemon}-mega-y/`);
            }
        } else {
            megaData = await dataExists(`https://pokeapi.co/api/v2/pokemon/${myPokemon}-mega/`);
        }
        


        if (megaData) {
            console.log(`${myPokemon} has a mega!`);
            res.render("index.ejs", {mega: megaData});
        } else {
            console.log(`${myPokemon} exists but mega does not`);
            res.render("index.ejs", {pokemon: pokemonData});
        }
        
        
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.send();
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});