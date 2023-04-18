import express from "express";
import axios from "axios";
require("dotenv").config();

const app = express();
app.use(express.json());
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error("Google API Key is required!");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

app.post("/translate", async (req, res) => {
  const translateText = async () => {
    const { text, target } = req.body;
    const url = new URL("https://translation.googleapis.com/language/translate/v2");
    url.searchParams.append("key", apiKey);

    const response = await axios.post(
      url.toString(),
      { q: text, target: target },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data.data.translations;
    } else {
      throw new Error(`Error: ${response.data.error.message}`);
    }
  };
  translateText().then((a) => res.send(a));
});
