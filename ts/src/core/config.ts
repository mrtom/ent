import * as fs from "fs";
import { load } from "js-yaml";
import DB, { Database, DBDict } from "./db";
import * as path from "path";
import { setLogLevels } from "./logger";

type logType = "query" | "warn" | "info" | "error" | "debug";

// ent.config.ts eventually. for now ent.yml
// or ent.yml?

enum graphqlMutationName {
  NOUN_VERB = "NounVerb",
  VERB_NOUN = "VerbNoun",
}

enum graphQLFieldFormat {
  LOWER_CAMEL = "lowerCamel",
  SNAKE_CASE = "snake_case",
}

export interface Config {
  dbConnectionString?: string;
  dbFile?: string; // config/database.yml is default
  db?: Database | DBDict;
  log?: logType | logType[]; // default is 'error'
  // warn will be deprecared or weird things
  // info is tbd. graphql/performance/timing/request stuff
  // query includes cache hit. redis|memcache etc eventually

  // config for codegen
  codegen?: CodegenConfig;

  // because of swc issues, we might not be able to
  // parse custom graphql via decorators so we put this
  // in a json file for now
  // the path should be relative to the root
  // this is hopefully a temporary solution...
  customGraphQLJSONPath?: string;
}

interface CodegenConfig {
  defaultEntPolicy?: PrivacyConfig;
  defaultActionPolicy?: PrivacyConfig;
  prettier?: PrettierConfig;
  // use relativeImports in generated files instead of "src/ent/user" etc
  // needed for legacy scenarios or situations where the custom compiler has issues
  relativeImports?: boolean;
  // the default graphql root is src/graphql/index.ts
  // if integrating into an existing project (with an existing root) or just
  // want to do something different, set this to true
  disableGraphQLRoot?: boolean;
  // add header to each generated file
  // if provided, we'd generate a header as follows:
  // /**
  //  * Copyright blah
  //  * Generated by github.com/lolopinto/... DO NOT EDIT.
  //
  //  */
  // If not provided, we'd do just:
  // // Generated by github.com/lolopinto/ent, DO NOT EDIT."
  // For files that are generated only once e.g. (src/ent/user.ts), if they exist on disk before this is provided,
  // they are not changed
  generatedHeader?: string;

  // disable base64encoding of id fields
  // when set to true, id fields aren't resolved with nodeIDEncoder and the actual uuid or integer is sent to the client
  disableBase64Encoding?: boolean;

  // generateRootResolvers for each type exposed to GraphQL instead of node(). Should be used in combination with
  // disableBase64Encoding
  generateRootResolvers?: boolean;

  // default names for graphql actions|mutations is nounVerb e.g. userCreate
  // if you wanna change it to verbNoun e.g. createUser, set this field to VERB_NOUN
  defaultGraphQLMutationName?: graphqlMutationName;

  // default format for fields is lowerCamelCase e.g. firstName
  // if you wanna change it to snake_case e.g. first_name, set this field to snake_case
  defaultGraphQLFieldFormat?: graphQLFieldFormat;

  // if we should generate schema.sql file and path to generate it
  schemaSQLFilePath?: boolean;

  // TODO: would be ideal not to need this. so eventually make this work without
  // if there's a schemaSQLFilePath, we compare against an empty database to see what
  // has changed. we need this because if no database is provided, we'd then try and compare
  // against database with same name as user
  databaseToCompareTo?: string;
}

interface PrettierConfig {
  // indicates you have your own custom prettier configuration and should use that instead of the ent default
  // https://prettier.io/docs/en/configuration.html
  custom?: boolean;
  // default glob is 'src/**/*.ts', can override this
  glob?: string;
}

interface PrivacyConfig {
  path: string; // e.g. "@snowtop/ent"
  policyName: string; // e.g. "AllowIfViewerHasIdentityPrivacyPolicy";
  class?: boolean;
}

function setConfig(cfg: Config) {
  if (cfg.log) {
    setLogLevels(cfg.log);
  }

  if (cfg.dbConnectionString || cfg.dbFile || cfg.db) {
    DB.initDB({
      connectionString: cfg.dbConnectionString,
      dbFile: cfg.dbFile,
      db: cfg.db,
    });
  }
}

function isBuffer(b: Buffer | Config): b is Buffer {
  return (b as Buffer).write !== undefined;
}

export function loadConfig(file?: string | Buffer | Config) {
  let data: string;
  if (typeof file === "object") {
    if (!isBuffer(file)) {
      return setConfig(file);
    }
    data = file.toString();
  } else {
    file = file || "ent.yml";
    if (!path.isAbsolute(file)) {
      file = path.join(process.cwd(), file);
    }
    if (!fs.existsSync(file)) {
      return DB.initDB();
    }
    try {
      data = fs.readFileSync(file, { encoding: "utf8" });
    } catch (e) {
      console.error(`error opening file: ${file}`);
      return DB.initDB();
    }
  }

  try {
    let yaml = load(data);
    if (typeof yaml !== "object") {
      throw new Error(`invalid yaml passed`);
    }
    setConfig(yaml as Config);
  } catch (e) {
    console.error(`error parsing yaml file`, e);
    throw e;
  }
}
