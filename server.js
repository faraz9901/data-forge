import dotenv from "dotenv";
import server from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

