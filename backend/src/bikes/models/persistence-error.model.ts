// Persistence failures translated at the repository boundary, without ORM types.
// The customers module already defines BikeNotFoundError (bike sales): reuse it.
export { BikeNotFoundError } from "../../customers/models/persistence-error.model";
export class BikeInUseError extends Error {}
