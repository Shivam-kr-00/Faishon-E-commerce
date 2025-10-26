# Copilot Instructions for E-Commerce Codebase

## Big Picture Architecture

- The project is split into `backend` and `frontend` directories.
- The backend is a Node.js/Express server (see `backend/server.js`) with modular controllers, routes, and a database library.
- Data flows from HTTP requests (handled in `routes/`) to controllers (business logic) and then to the database (via `lib/db.js`).
- MongoDB Atlas is used for database storage; connection logic is in `lib/db.js`.

## Developer Workflows

- Start backend: `npm run dev` from `backend/` (see `package.json` for scripts).
- Debugging: Check terminal output for errors, especially DB connection issues (IP whitelisting for Atlas).
- Add new API endpoints by creating controller functions and registering them in the appropriate route file.

## Project-Specific Conventions

- Controllers are in `backend/controllers/` and named as `<feature>.controller.js`.
- Routes are in `backend/routes/` and named as `<feature>.route.js`.
- Use ES6 module syntax (`export const ...`) for all controllers.
- Error handling is done via try/catch in controllers; always send a response in both success and error cases.
- Request bodies are destructured at the top of controller functions (e.g., `const { products, couponCode } = req.body;`).

## Integration Points

- MongoDB Atlas: Ensure IP is whitelisted for DB access.
- Coupon and payment logic: See `payment.controller.js` for patterns on extracting and validating request data.
- Auth logic: See `auth.controller.js` and `auth.route.js` for user authentication flows.

## Examples

- To add a new feature, create `<feature>.controller.js` and `<feature>.route.js`, then register the route in `server.js`.
- For database access, use functions from `lib/db.js`.
- Always validate incoming request data before processing.

## Key Files

- `backend/server.js`: Main Express app setup
- `backend/controllers/`: Business logic
- `backend/routes/`: API endpoint definitions
- `backend/lib/db.js`: Database connection
- `package.json`: Scripts and dependencies

---

For questions or unclear patterns, review the referenced files or ask for clarification. Update this file as new conventions emerge.
