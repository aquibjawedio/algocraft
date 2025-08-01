import { app } from "./app.js";
import { env } from "./config/env.js";

const PORT: number = env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running`));
