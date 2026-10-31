import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export async function conectarBanco() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "A variável MONGODB_URI não foi definida no arquivo .env."
    );
  }

  await mongoose.connect(uri);
  console.log("MongoDB conectado com sucesso.");
}