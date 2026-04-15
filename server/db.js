/* eslint-disable no-underscore-dangle */
const { MongoClient } = require('mongodb');
const config = require('config');
const { logger } = require('./log.js');

const collectionNames = ['users', 'libraries'];

function normalizeDatabaseUrl(databaseUrl) {
    const connectionString = String(databaseUrl);
    if (connectionString.indexOf('mongodb://') === 0 || connectionString.indexOf('mongodb+srv://') === 0) {
        return connectionString;
    }
    return `mongodb://${connectionString}`;
}

const client = new MongoClient(normalizeDatabaseUrl(config.get('databaseUrl')), {
    ignoreUndefined: true,
});

let dbPromise;

function getDb() {
    if (!dbPromise) {
        dbPromise = client.connect().then(() => client.db());
    }
    return dbPromise;
}

function run(callback, operation) {
    const promise = getDb().then(operation);

    if (callback) {
        promise
            .then((result) => callback(null, result))
            .catch((err) => callback(err));
    } else {
        promise.catch((err) => {
            logger.error({ message: 'Database operation failed', error: err.message });
        });
    }

    return promise;
}

function collection(name) {
    return {
        find(query, callback) {
            return run(callback, (db) => db.collection(name).find(query).toArray());
        },

        findOne(query, callback) {
            return run(callback, (db) => db.collection(name).findOne(query));
        },

        save(document, callback) {
            return run(callback, (db) => {
                if (document._id) {
                    return db.collection(name)
                        .replaceOne({ _id: document._id }, document, { upsert: true })
                        .then(() => document);
                }

                return db.collection(name)
                    .insertOne(document)
                    .then((result) => {
                        document._id = result.insertedId;
                        return document;
                    });
            });
        },

        remove(query, justOne, callback) {
            let removeJustOne = justOne;
            let done = callback;

            if (typeof justOne === 'function') {
                removeJustOne = false;
                done = justOne;
            }

            return run(done, (db) => {
                const collection = db.collection(name);
                const normalizedQuery = query && query._id ? { _id: query._id } : query;
                if (removeJustOne) {
                    return collection.deleteOne(normalizedQuery);
                }
                return collection.deleteMany(normalizedQuery);
            });
        },
    };
}

const db = {
    close() {
        dbPromise = null;
        return client.close();
    },
};

collectionNames.forEach((name) => {
    db[name] = collection(name);
});

module.exports = db;
