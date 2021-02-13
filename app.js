const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const apps = require("./playstore.js");
const app = express();
app.use(morgan("dev"));
app.use(cors());

app.get("/apps", (req, res) => {
  const { sort, genres } = req.query;
  const genreArray = [
    "Action",
    "Puzzle",
    "Strategy",
    "Casual",
    "Arcade",
    "Card",
  ];
  //validate genres and filter results if genre is valid
  let results;
  if (genres) {
    if (!genreArray.includes(genres)) {
      res
        .status(400)
        .send(
          "Please select a genre from the list: Action, Puzzle, Strategy, Casual, Arcade, or Card"
        );
    } else {
      results = apps.filter((item) =>
        item.Genres.toLowerCase().includes(genres.toLowerCase())
      );
    }
  }

  //validate sort query and filter app results if it is valid
  if (sort) {
    if (sort !== "app" && sort !== "rating") {
      res.status(400).send("Please sort your search by 'app' or 'rating'");
    } else if (sort === "rating") {
      results = apps.sort((a, b) => b.Rating - a.Rating);
    } else if (sort === "app") {
      results = apps.sort((a, b) =>
        a.App.localeCompare(b.App, "fr", { ignorePunctuation: true })
      );
    }
  }
  //return all apps if neither query is used
  if (!sort && !genres) {
    results = apps;
  }

  res.send(results);
});

module.exports = app;
