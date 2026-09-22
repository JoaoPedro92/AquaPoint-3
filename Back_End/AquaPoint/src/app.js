import express from "express";
import cors from "cors";
import swaggerUI from 'swagger-ui-express'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const swaggerDocument = require('./swagger.json')
import usersRoutes from "./routes/user.routes.js";
import aquaPointsRoutes from "./routes/aquapoints.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

import authRoutes from "./routes/auth.routes.js"
import localsRoutes from "./routes/locals.routes.js";
import typesRoutes from "./routes/types.routes.js"
import zonesRoutes from "./routes/zones.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import trustlevelsRoutes from "./routes/trustLevels.routes.js"
import trustLogsRoutes from "./routes/trustLogs.routes.js";
import statesRoutes from "./routes/states.routes.js"


const app = express();

// Extending upload image limit
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors({ origin: "*" }));       

app.get("/health", (req, res) => { // testar se está on
  res.json({ ok: true });
});

app.use("/api/users", usersRoutes);
app.use("/api/aquapoints", aquaPointsRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/reports", reportsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/locals", localsRoutes);
app.use("/api/types", typesRoutes);
app.use("/api/zones", zonesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/trustlevels", trustlevelsRoutes);
app.use("/api/trustlogs", trustLogsRoutes);
app.use("/api/states", statesRoutes);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default app;