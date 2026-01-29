import oracledb from "oracledb";

// Force Thin mode for easier setup without Instant Client dependencies on the host if possible
try {
  oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB_DIR });
} catch (err) {
  console.log(
    "Oracle Instant Client not found, attempting Thin mode or already initialized.",
  );
}

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true; // Default auto commit, can be overridden in options

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONN_STRING,
  // Example: "localhost:1521/XEPDB1" or simplified tns
};

/**
 * Connects to the database, executes a query, and releases the connection.
 * @param sql The SQL query string
 * @param binds The bind parameters (array or object)
 * @param options Execution options (autoCommit, outFormat, etc.)
 */
export async function query<T>(
  sql: string,
  binds: oracledb.BindParameters = [],
  options?: oracledb.ExecuteOptions,
): Promise<T[]> {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Default to autoCommit if not specified (for SELECTs it doesn't matter, for DML it does)
    const execOptions: oracledb.ExecuteOptions = {
      autoCommit: true,
      ...options,
    };

    const result = await connection.execute<T>(sql, binds, execOptions);

    return (result.rows as T[]) || [];
  } catch (err) {
    console.error("Oracle Query Error:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

/**
 * Performs a transaction with multiple queries.
 * @param callback A function that receives the connection to execute queries.
 */
export async function transaction<T>(
  callback: (connection: oracledb.Connection) => Promise<T>,
): Promise<T> {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rbErr) {
        console.error("Error rolling back:", rbErr);
      }
    }
    console.error("Transaction Error:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}
