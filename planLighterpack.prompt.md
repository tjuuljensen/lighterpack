## Plan: Move database from Mongo to Postgres

TL;DR: Replace the Mongo adapter in `server/db.js` with a Postgres-backed implementation, preserve the existing document-like user library model with JSONB, and migrate current data and query behavior to Postgres.

**Steps**
1. Audit the current DB abstraction and call sites.
   - Core adapter: `server/db.js`
   - Server code using DB: `server/endpoints.js`, `server/auth.js`, `server/views.js`, `server/moderation-endpoints.js`
   - Scripts also use Mongo and may require updates if they remain relevant.

2. Design a Postgres schema.
   - `users` table containing credentials and user state.
   - Keep `library` as `jsonb` to preserve embedded asset structure.
   - Add columns for `username`, `email`, `password`, `token`, `sync_token`, and maybe `external_ids`.
   - Map Mongo `_id` to a string/UUID primary key to preserve `save()` semantics.

3. Replace `server/db.js` with Postgres semantics.
   - Add `pg` as a dependency and remove Mongo-specific packages once migration is complete.
   - Implement `getDb()` and pooled connections.
   - Reimplement `collection(name).find()`, `findOne()`, `save()`, `remove()`.
   - Translate Mongo query patterns:
     - equality queries for `username`, `email`, `token`
     - regex queries for moderation search on username/email
     - nested JSON search for `library.lists.externalId`
   - Keep the same wrapper API so server code changes stay minimal.

4. Migrate data from Mongo to Postgres.
   - Export existing Mongo documents to JSON.
   - Create Postgres schema and import the JSON into `users`.
   - Convert `_id` values to text and persist in the Postgres row.
   - Confirm JSONB library data imports correctly and nested searches work.

5. Update configuration and dependencies.
   - Change `config/default.json` to a Postgres connection string.
   - Update `package.json` to add `pg` and remove `mongodb`/`mongojs` if they are no longer used.
   - Update any scripts that still rely on `mongojs` if they are part of the migration path.

6. Verify and test.
   - Run the server and exercise register, signin, saveLibrary, externalId, forgot-password, moderator search, and share routes.
   - Confirm queries return expected results.
   - Validate imported data in Postgres with SQL and JSONB queries.

### Biggest complexity
- Preserving Mongo-like query semantics in Postgres is the main challenge.
- Using JSONB for `library` is the easiest path to avoid rewriting most app logic.
- The backend already has a centralized DB adapter, so the migration is manageable if done carefully.

### Files involved
- `server/db.js`
- `server/endpoints.js`
- `server/auth.js`
- `server/views.js`
- `server/moderation-endpoints.js`
- `config/default.json`
- `package.json`

I’ve saved a detailed plan in `/memories/session/plan.md` so we can continue from there.
