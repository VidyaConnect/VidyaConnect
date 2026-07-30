
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ClassRosterEntry
 * 
 */
export type ClassRosterEntry = $Result.DefaultSelection<Prisma.$ClassRosterEntryPayload>
/**
 * Model AttendanceRecord
 * 
 */
export type AttendanceRecord = $Result.DefaultSelection<Prisma.$AttendanceRecordPayload>
/**
 * Model AbsenceResponse
 * 
 */
export type AbsenceResponse = $Result.DefaultSelection<Prisma.$AbsenceResponsePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AttendanceStatus: {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXEMPTED: 'EXEMPTED',
  NOT_MARKED: 'NOT_MARKED'
};

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus]

}

export type AttendanceStatus = $Enums.AttendanceStatus

export const AttendanceStatus: typeof $Enums.AttendanceStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ClassRosterEntries
 * const classRosterEntries = await prisma.classRosterEntry.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ClassRosterEntries
   * const classRosterEntries = await prisma.classRosterEntry.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.classRosterEntry`: Exposes CRUD operations for the **ClassRosterEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClassRosterEntries
    * const classRosterEntries = await prisma.classRosterEntry.findMany()
    * ```
    */
  get classRosterEntry(): Prisma.ClassRosterEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.attendanceRecord`: Exposes CRUD operations for the **AttendanceRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AttendanceRecords
    * const attendanceRecords = await prisma.attendanceRecord.findMany()
    * ```
    */
  get attendanceRecord(): Prisma.AttendanceRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.absenceResponse`: Exposes CRUD operations for the **AbsenceResponse** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AbsenceResponses
    * const absenceResponses = await prisma.absenceResponse.findMany()
    * ```
    */
  get absenceResponse(): Prisma.AbsenceResponseDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ClassRosterEntry: 'ClassRosterEntry',
    AttendanceRecord: 'AttendanceRecord',
    AbsenceResponse: 'AbsenceResponse'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "classRosterEntry" | "attendanceRecord" | "absenceResponse"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ClassRosterEntry: {
        payload: Prisma.$ClassRosterEntryPayload<ExtArgs>
        fields: Prisma.ClassRosterEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClassRosterEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClassRosterEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>
          }
          findFirst: {
            args: Prisma.ClassRosterEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClassRosterEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>
          }
          findMany: {
            args: Prisma.ClassRosterEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>[]
          }
          create: {
            args: Prisma.ClassRosterEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>
          }
          createMany: {
            args: Prisma.ClassRosterEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClassRosterEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>[]
          }
          delete: {
            args: Prisma.ClassRosterEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>
          }
          update: {
            args: Prisma.ClassRosterEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>
          }
          deleteMany: {
            args: Prisma.ClassRosterEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClassRosterEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClassRosterEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>[]
          }
          upsert: {
            args: Prisma.ClassRosterEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClassRosterEntryPayload>
          }
          aggregate: {
            args: Prisma.ClassRosterEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClassRosterEntry>
          }
          groupBy: {
            args: Prisma.ClassRosterEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClassRosterEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClassRosterEntryCountArgs<ExtArgs>
            result: $Utils.Optional<ClassRosterEntryCountAggregateOutputType> | number
          }
        }
      }
      AttendanceRecord: {
        payload: Prisma.$AttendanceRecordPayload<ExtArgs>
        fields: Prisma.AttendanceRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AttendanceRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AttendanceRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>
          }
          findFirst: {
            args: Prisma.AttendanceRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AttendanceRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>
          }
          findMany: {
            args: Prisma.AttendanceRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>[]
          }
          create: {
            args: Prisma.AttendanceRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>
          }
          createMany: {
            args: Prisma.AttendanceRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AttendanceRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>[]
          }
          delete: {
            args: Prisma.AttendanceRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>
          }
          update: {
            args: Prisma.AttendanceRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>
          }
          deleteMany: {
            args: Prisma.AttendanceRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AttendanceRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AttendanceRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>[]
          }
          upsert: {
            args: Prisma.AttendanceRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendanceRecordPayload>
          }
          aggregate: {
            args: Prisma.AttendanceRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAttendanceRecord>
          }
          groupBy: {
            args: Prisma.AttendanceRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<AttendanceRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.AttendanceRecordCountArgs<ExtArgs>
            result: $Utils.Optional<AttendanceRecordCountAggregateOutputType> | number
          }
        }
      }
      AbsenceResponse: {
        payload: Prisma.$AbsenceResponsePayload<ExtArgs>
        fields: Prisma.AbsenceResponseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AbsenceResponseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AbsenceResponseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>
          }
          findFirst: {
            args: Prisma.AbsenceResponseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AbsenceResponseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>
          }
          findMany: {
            args: Prisma.AbsenceResponseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>[]
          }
          create: {
            args: Prisma.AbsenceResponseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>
          }
          createMany: {
            args: Prisma.AbsenceResponseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AbsenceResponseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>[]
          }
          delete: {
            args: Prisma.AbsenceResponseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>
          }
          update: {
            args: Prisma.AbsenceResponseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>
          }
          deleteMany: {
            args: Prisma.AbsenceResponseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AbsenceResponseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AbsenceResponseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>[]
          }
          upsert: {
            args: Prisma.AbsenceResponseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsenceResponsePayload>
          }
          aggregate: {
            args: Prisma.AbsenceResponseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAbsenceResponse>
          }
          groupBy: {
            args: Prisma.AbsenceResponseGroupByArgs<ExtArgs>
            result: $Utils.Optional<AbsenceResponseGroupByOutputType>[]
          }
          count: {
            args: Prisma.AbsenceResponseCountArgs<ExtArgs>
            result: $Utils.Optional<AbsenceResponseCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    classRosterEntry?: ClassRosterEntryOmit
    attendanceRecord?: AttendanceRecordOmit
    absenceResponse?: AbsenceResponseOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model ClassRosterEntry
   */

  export type AggregateClassRosterEntry = {
    _count: ClassRosterEntryCountAggregateOutputType | null
    _min: ClassRosterEntryMinAggregateOutputType | null
    _max: ClassRosterEntryMaxAggregateOutputType | null
  }

  export type ClassRosterEntryMinAggregateOutputType = {
    id: string | null
    schoolId: string | null
    classId: string | null
    className: string | null
    studentId: string | null
    studentName: string | null
    rollNumber: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClassRosterEntryMaxAggregateOutputType = {
    id: string | null
    schoolId: string | null
    classId: string | null
    className: string | null
    studentId: string | null
    studentName: string | null
    rollNumber: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClassRosterEntryCountAggregateOutputType = {
    id: number
    schoolId: number
    classId: number
    className: number
    studentId: number
    studentName: number
    rollNumber: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClassRosterEntryMinAggregateInputType = {
    id?: true
    schoolId?: true
    classId?: true
    className?: true
    studentId?: true
    studentName?: true
    rollNumber?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClassRosterEntryMaxAggregateInputType = {
    id?: true
    schoolId?: true
    classId?: true
    className?: true
    studentId?: true
    studentName?: true
    rollNumber?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClassRosterEntryCountAggregateInputType = {
    id?: true
    schoolId?: true
    classId?: true
    className?: true
    studentId?: true
    studentName?: true
    rollNumber?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClassRosterEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClassRosterEntry to aggregate.
     */
    where?: ClassRosterEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassRosterEntries to fetch.
     */
    orderBy?: ClassRosterEntryOrderByWithRelationInput | ClassRosterEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClassRosterEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassRosterEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassRosterEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClassRosterEntries
    **/
    _count?: true | ClassRosterEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClassRosterEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClassRosterEntryMaxAggregateInputType
  }

  export type GetClassRosterEntryAggregateType<T extends ClassRosterEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateClassRosterEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClassRosterEntry[P]>
      : GetScalarType<T[P], AggregateClassRosterEntry[P]>
  }




  export type ClassRosterEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClassRosterEntryWhereInput
    orderBy?: ClassRosterEntryOrderByWithAggregationInput | ClassRosterEntryOrderByWithAggregationInput[]
    by: ClassRosterEntryScalarFieldEnum[] | ClassRosterEntryScalarFieldEnum
    having?: ClassRosterEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClassRosterEntryCountAggregateInputType | true
    _min?: ClassRosterEntryMinAggregateInputType
    _max?: ClassRosterEntryMaxAggregateInputType
  }

  export type ClassRosterEntryGroupByOutputType = {
    id: string
    schoolId: string
    classId: string
    className: string
    studentId: string
    studentName: string
    rollNumber: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: ClassRosterEntryCountAggregateOutputType | null
    _min: ClassRosterEntryMinAggregateOutputType | null
    _max: ClassRosterEntryMaxAggregateOutputType | null
  }

  type GetClassRosterEntryGroupByPayload<T extends ClassRosterEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClassRosterEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClassRosterEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClassRosterEntryGroupByOutputType[P]>
            : GetScalarType<T[P], ClassRosterEntryGroupByOutputType[P]>
        }
      >
    >


  export type ClassRosterEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    schoolId?: boolean
    classId?: boolean
    className?: boolean
    studentId?: boolean
    studentName?: boolean
    rollNumber?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["classRosterEntry"]>

  export type ClassRosterEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    schoolId?: boolean
    classId?: boolean
    className?: boolean
    studentId?: boolean
    studentName?: boolean
    rollNumber?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["classRosterEntry"]>

  export type ClassRosterEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    schoolId?: boolean
    classId?: boolean
    className?: boolean
    studentId?: boolean
    studentName?: boolean
    rollNumber?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["classRosterEntry"]>

  export type ClassRosterEntrySelectScalar = {
    id?: boolean
    schoolId?: boolean
    classId?: boolean
    className?: boolean
    studentId?: boolean
    studentName?: boolean
    rollNumber?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClassRosterEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "schoolId" | "classId" | "className" | "studentId" | "studentName" | "rollNumber" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["classRosterEntry"]>

  export type $ClassRosterEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClassRosterEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      schoolId: string
      classId: string
      className: string
      studentId: string
      studentName: string
      rollNumber: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["classRosterEntry"]>
    composites: {}
  }

  type ClassRosterEntryGetPayload<S extends boolean | null | undefined | ClassRosterEntryDefaultArgs> = $Result.GetResult<Prisma.$ClassRosterEntryPayload, S>

  type ClassRosterEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClassRosterEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClassRosterEntryCountAggregateInputType | true
    }

  export interface ClassRosterEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClassRosterEntry'], meta: { name: 'ClassRosterEntry' } }
    /**
     * Find zero or one ClassRosterEntry that matches the filter.
     * @param {ClassRosterEntryFindUniqueArgs} args - Arguments to find a ClassRosterEntry
     * @example
     * // Get one ClassRosterEntry
     * const classRosterEntry = await prisma.classRosterEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClassRosterEntryFindUniqueArgs>(args: SelectSubset<T, ClassRosterEntryFindUniqueArgs<ExtArgs>>): Prisma__ClassRosterEntryClient<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClassRosterEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClassRosterEntryFindUniqueOrThrowArgs} args - Arguments to find a ClassRosterEntry
     * @example
     * // Get one ClassRosterEntry
     * const classRosterEntry = await prisma.classRosterEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClassRosterEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, ClassRosterEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClassRosterEntryClient<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClassRosterEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRosterEntryFindFirstArgs} args - Arguments to find a ClassRosterEntry
     * @example
     * // Get one ClassRosterEntry
     * const classRosterEntry = await prisma.classRosterEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClassRosterEntryFindFirstArgs>(args?: SelectSubset<T, ClassRosterEntryFindFirstArgs<ExtArgs>>): Prisma__ClassRosterEntryClient<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClassRosterEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRosterEntryFindFirstOrThrowArgs} args - Arguments to find a ClassRosterEntry
     * @example
     * // Get one ClassRosterEntry
     * const classRosterEntry = await prisma.classRosterEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClassRosterEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, ClassRosterEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClassRosterEntryClient<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClassRosterEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRosterEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClassRosterEntries
     * const classRosterEntries = await prisma.classRosterEntry.findMany()
     * 
     * // Get first 10 ClassRosterEntries
     * const classRosterEntries = await prisma.classRosterEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const classRosterEntryWithIdOnly = await prisma.classRosterEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClassRosterEntryFindManyArgs>(args?: SelectSubset<T, ClassRosterEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClassRosterEntry.
     * @param {ClassRosterEntryCreateArgs} args - Arguments to create a ClassRosterEntry.
     * @example
     * // Create one ClassRosterEntry
     * const ClassRosterEntry = await prisma.classRosterEntry.create({
     *   data: {
     *     // ... data to create a ClassRosterEntry
     *   }
     * })
     * 
     */
    create<T extends ClassRosterEntryCreateArgs>(args: SelectSubset<T, ClassRosterEntryCreateArgs<ExtArgs>>): Prisma__ClassRosterEntryClient<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClassRosterEntries.
     * @param {ClassRosterEntryCreateManyArgs} args - Arguments to create many ClassRosterEntries.
     * @example
     * // Create many ClassRosterEntries
     * const classRosterEntry = await prisma.classRosterEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClassRosterEntryCreateManyArgs>(args?: SelectSubset<T, ClassRosterEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClassRosterEntries and returns the data saved in the database.
     * @param {ClassRosterEntryCreateManyAndReturnArgs} args - Arguments to create many ClassRosterEntries.
     * @example
     * // Create many ClassRosterEntries
     * const classRosterEntry = await prisma.classRosterEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClassRosterEntries and only return the `id`
     * const classRosterEntryWithIdOnly = await prisma.classRosterEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClassRosterEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, ClassRosterEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClassRosterEntry.
     * @param {ClassRosterEntryDeleteArgs} args - Arguments to delete one ClassRosterEntry.
     * @example
     * // Delete one ClassRosterEntry
     * const ClassRosterEntry = await prisma.classRosterEntry.delete({
     *   where: {
     *     // ... filter to delete one ClassRosterEntry
     *   }
     * })
     * 
     */
    delete<T extends ClassRosterEntryDeleteArgs>(args: SelectSubset<T, ClassRosterEntryDeleteArgs<ExtArgs>>): Prisma__ClassRosterEntryClient<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClassRosterEntry.
     * @param {ClassRosterEntryUpdateArgs} args - Arguments to update one ClassRosterEntry.
     * @example
     * // Update one ClassRosterEntry
     * const classRosterEntry = await prisma.classRosterEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClassRosterEntryUpdateArgs>(args: SelectSubset<T, ClassRosterEntryUpdateArgs<ExtArgs>>): Prisma__ClassRosterEntryClient<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClassRosterEntries.
     * @param {ClassRosterEntryDeleteManyArgs} args - Arguments to filter ClassRosterEntries to delete.
     * @example
     * // Delete a few ClassRosterEntries
     * const { count } = await prisma.classRosterEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClassRosterEntryDeleteManyArgs>(args?: SelectSubset<T, ClassRosterEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClassRosterEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRosterEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClassRosterEntries
     * const classRosterEntry = await prisma.classRosterEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClassRosterEntryUpdateManyArgs>(args: SelectSubset<T, ClassRosterEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClassRosterEntries and returns the data updated in the database.
     * @param {ClassRosterEntryUpdateManyAndReturnArgs} args - Arguments to update many ClassRosterEntries.
     * @example
     * // Update many ClassRosterEntries
     * const classRosterEntry = await prisma.classRosterEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClassRosterEntries and only return the `id`
     * const classRosterEntryWithIdOnly = await prisma.classRosterEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClassRosterEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, ClassRosterEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClassRosterEntry.
     * @param {ClassRosterEntryUpsertArgs} args - Arguments to update or create a ClassRosterEntry.
     * @example
     * // Update or create a ClassRosterEntry
     * const classRosterEntry = await prisma.classRosterEntry.upsert({
     *   create: {
     *     // ... data to create a ClassRosterEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClassRosterEntry we want to update
     *   }
     * })
     */
    upsert<T extends ClassRosterEntryUpsertArgs>(args: SelectSubset<T, ClassRosterEntryUpsertArgs<ExtArgs>>): Prisma__ClassRosterEntryClient<$Result.GetResult<Prisma.$ClassRosterEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClassRosterEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRosterEntryCountArgs} args - Arguments to filter ClassRosterEntries to count.
     * @example
     * // Count the number of ClassRosterEntries
     * const count = await prisma.classRosterEntry.count({
     *   where: {
     *     // ... the filter for the ClassRosterEntries we want to count
     *   }
     * })
    **/
    count<T extends ClassRosterEntryCountArgs>(
      args?: Subset<T, ClassRosterEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClassRosterEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClassRosterEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRosterEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClassRosterEntryAggregateArgs>(args: Subset<T, ClassRosterEntryAggregateArgs>): Prisma.PrismaPromise<GetClassRosterEntryAggregateType<T>>

    /**
     * Group by ClassRosterEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClassRosterEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClassRosterEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClassRosterEntryGroupByArgs['orderBy'] }
        : { orderBy?: ClassRosterEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClassRosterEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassRosterEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClassRosterEntry model
   */
  readonly fields: ClassRosterEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClassRosterEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClassRosterEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClassRosterEntry model
   */
  interface ClassRosterEntryFieldRefs {
    readonly id: FieldRef<"ClassRosterEntry", 'String'>
    readonly schoolId: FieldRef<"ClassRosterEntry", 'String'>
    readonly classId: FieldRef<"ClassRosterEntry", 'String'>
    readonly className: FieldRef<"ClassRosterEntry", 'String'>
    readonly studentId: FieldRef<"ClassRosterEntry", 'String'>
    readonly studentName: FieldRef<"ClassRosterEntry", 'String'>
    readonly rollNumber: FieldRef<"ClassRosterEntry", 'String'>
    readonly isActive: FieldRef<"ClassRosterEntry", 'Boolean'>
    readonly createdAt: FieldRef<"ClassRosterEntry", 'DateTime'>
    readonly updatedAt: FieldRef<"ClassRosterEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClassRosterEntry findUnique
   */
  export type ClassRosterEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * Filter, which ClassRosterEntry to fetch.
     */
    where: ClassRosterEntryWhereUniqueInput
  }

  /**
   * ClassRosterEntry findUniqueOrThrow
   */
  export type ClassRosterEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * Filter, which ClassRosterEntry to fetch.
     */
    where: ClassRosterEntryWhereUniqueInput
  }

  /**
   * ClassRosterEntry findFirst
   */
  export type ClassRosterEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * Filter, which ClassRosterEntry to fetch.
     */
    where?: ClassRosterEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassRosterEntries to fetch.
     */
    orderBy?: ClassRosterEntryOrderByWithRelationInput | ClassRosterEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClassRosterEntries.
     */
    cursor?: ClassRosterEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassRosterEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassRosterEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClassRosterEntries.
     */
    distinct?: ClassRosterEntryScalarFieldEnum | ClassRosterEntryScalarFieldEnum[]
  }

  /**
   * ClassRosterEntry findFirstOrThrow
   */
  export type ClassRosterEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * Filter, which ClassRosterEntry to fetch.
     */
    where?: ClassRosterEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassRosterEntries to fetch.
     */
    orderBy?: ClassRosterEntryOrderByWithRelationInput | ClassRosterEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClassRosterEntries.
     */
    cursor?: ClassRosterEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassRosterEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassRosterEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClassRosterEntries.
     */
    distinct?: ClassRosterEntryScalarFieldEnum | ClassRosterEntryScalarFieldEnum[]
  }

  /**
   * ClassRosterEntry findMany
   */
  export type ClassRosterEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * Filter, which ClassRosterEntries to fetch.
     */
    where?: ClassRosterEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClassRosterEntries to fetch.
     */
    orderBy?: ClassRosterEntryOrderByWithRelationInput | ClassRosterEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClassRosterEntries.
     */
    cursor?: ClassRosterEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClassRosterEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClassRosterEntries.
     */
    skip?: number
    distinct?: ClassRosterEntryScalarFieldEnum | ClassRosterEntryScalarFieldEnum[]
  }

  /**
   * ClassRosterEntry create
   */
  export type ClassRosterEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a ClassRosterEntry.
     */
    data: XOR<ClassRosterEntryCreateInput, ClassRosterEntryUncheckedCreateInput>
  }

  /**
   * ClassRosterEntry createMany
   */
  export type ClassRosterEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClassRosterEntries.
     */
    data: ClassRosterEntryCreateManyInput | ClassRosterEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClassRosterEntry createManyAndReturn
   */
  export type ClassRosterEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * The data used to create many ClassRosterEntries.
     */
    data: ClassRosterEntryCreateManyInput | ClassRosterEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClassRosterEntry update
   */
  export type ClassRosterEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a ClassRosterEntry.
     */
    data: XOR<ClassRosterEntryUpdateInput, ClassRosterEntryUncheckedUpdateInput>
    /**
     * Choose, which ClassRosterEntry to update.
     */
    where: ClassRosterEntryWhereUniqueInput
  }

  /**
   * ClassRosterEntry updateMany
   */
  export type ClassRosterEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClassRosterEntries.
     */
    data: XOR<ClassRosterEntryUpdateManyMutationInput, ClassRosterEntryUncheckedUpdateManyInput>
    /**
     * Filter which ClassRosterEntries to update
     */
    where?: ClassRosterEntryWhereInput
    /**
     * Limit how many ClassRosterEntries to update.
     */
    limit?: number
  }

  /**
   * ClassRosterEntry updateManyAndReturn
   */
  export type ClassRosterEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * The data used to update ClassRosterEntries.
     */
    data: XOR<ClassRosterEntryUpdateManyMutationInput, ClassRosterEntryUncheckedUpdateManyInput>
    /**
     * Filter which ClassRosterEntries to update
     */
    where?: ClassRosterEntryWhereInput
    /**
     * Limit how many ClassRosterEntries to update.
     */
    limit?: number
  }

  /**
   * ClassRosterEntry upsert
   */
  export type ClassRosterEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the ClassRosterEntry to update in case it exists.
     */
    where: ClassRosterEntryWhereUniqueInput
    /**
     * In case the ClassRosterEntry found by the `where` argument doesn't exist, create a new ClassRosterEntry with this data.
     */
    create: XOR<ClassRosterEntryCreateInput, ClassRosterEntryUncheckedCreateInput>
    /**
     * In case the ClassRosterEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClassRosterEntryUpdateInput, ClassRosterEntryUncheckedUpdateInput>
  }

  /**
   * ClassRosterEntry delete
   */
  export type ClassRosterEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
    /**
     * Filter which ClassRosterEntry to delete.
     */
    where: ClassRosterEntryWhereUniqueInput
  }

  /**
   * ClassRosterEntry deleteMany
   */
  export type ClassRosterEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClassRosterEntries to delete
     */
    where?: ClassRosterEntryWhereInput
    /**
     * Limit how many ClassRosterEntries to delete.
     */
    limit?: number
  }

  /**
   * ClassRosterEntry without action
   */
  export type ClassRosterEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClassRosterEntry
     */
    select?: ClassRosterEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClassRosterEntry
     */
    omit?: ClassRosterEntryOmit<ExtArgs> | null
  }


  /**
   * Model AttendanceRecord
   */

  export type AggregateAttendanceRecord = {
    _count: AttendanceRecordCountAggregateOutputType | null
    _min: AttendanceRecordMinAggregateOutputType | null
    _max: AttendanceRecordMaxAggregateOutputType | null
  }

  export type AttendanceRecordMinAggregateOutputType = {
    id: string | null
    schoolId: string | null
    classId: string | null
    studentId: string | null
    studentName: string | null
    rollNumber: string | null
    date: Date | null
    status: $Enums.AttendanceStatus | null
    markedById: string | null
    markedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AttendanceRecordMaxAggregateOutputType = {
    id: string | null
    schoolId: string | null
    classId: string | null
    studentId: string | null
    studentName: string | null
    rollNumber: string | null
    date: Date | null
    status: $Enums.AttendanceStatus | null
    markedById: string | null
    markedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AttendanceRecordCountAggregateOutputType = {
    id: number
    schoolId: number
    classId: number
    studentId: number
    studentName: number
    rollNumber: number
    date: number
    status: number
    markedById: number
    markedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AttendanceRecordMinAggregateInputType = {
    id?: true
    schoolId?: true
    classId?: true
    studentId?: true
    studentName?: true
    rollNumber?: true
    date?: true
    status?: true
    markedById?: true
    markedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AttendanceRecordMaxAggregateInputType = {
    id?: true
    schoolId?: true
    classId?: true
    studentId?: true
    studentName?: true
    rollNumber?: true
    date?: true
    status?: true
    markedById?: true
    markedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AttendanceRecordCountAggregateInputType = {
    id?: true
    schoolId?: true
    classId?: true
    studentId?: true
    studentName?: true
    rollNumber?: true
    date?: true
    status?: true
    markedById?: true
    markedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AttendanceRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AttendanceRecord to aggregate.
     */
    where?: AttendanceRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AttendanceRecords to fetch.
     */
    orderBy?: AttendanceRecordOrderByWithRelationInput | AttendanceRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AttendanceRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AttendanceRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AttendanceRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AttendanceRecords
    **/
    _count?: true | AttendanceRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AttendanceRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AttendanceRecordMaxAggregateInputType
  }

  export type GetAttendanceRecordAggregateType<T extends AttendanceRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateAttendanceRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttendanceRecord[P]>
      : GetScalarType<T[P], AggregateAttendanceRecord[P]>
  }




  export type AttendanceRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttendanceRecordWhereInput
    orderBy?: AttendanceRecordOrderByWithAggregationInput | AttendanceRecordOrderByWithAggregationInput[]
    by: AttendanceRecordScalarFieldEnum[] | AttendanceRecordScalarFieldEnum
    having?: AttendanceRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AttendanceRecordCountAggregateInputType | true
    _min?: AttendanceRecordMinAggregateInputType
    _max?: AttendanceRecordMaxAggregateInputType
  }

  export type AttendanceRecordGroupByOutputType = {
    id: string
    schoolId: string
    classId: string
    studentId: string
    studentName: string
    rollNumber: string
    date: Date
    status: $Enums.AttendanceStatus
    markedById: string | null
    markedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AttendanceRecordCountAggregateOutputType | null
    _min: AttendanceRecordMinAggregateOutputType | null
    _max: AttendanceRecordMaxAggregateOutputType | null
  }

  type GetAttendanceRecordGroupByPayload<T extends AttendanceRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AttendanceRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AttendanceRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AttendanceRecordGroupByOutputType[P]>
            : GetScalarType<T[P], AttendanceRecordGroupByOutputType[P]>
        }
      >
    >


  export type AttendanceRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    schoolId?: boolean
    classId?: boolean
    studentId?: boolean
    studentName?: boolean
    rollNumber?: boolean
    date?: boolean
    status?: boolean
    markedById?: boolean
    markedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    absenceResponse?: boolean | AttendanceRecord$absenceResponseArgs<ExtArgs>
  }, ExtArgs["result"]["attendanceRecord"]>

  export type AttendanceRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    schoolId?: boolean
    classId?: boolean
    studentId?: boolean
    studentName?: boolean
    rollNumber?: boolean
    date?: boolean
    status?: boolean
    markedById?: boolean
    markedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["attendanceRecord"]>

  export type AttendanceRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    schoolId?: boolean
    classId?: boolean
    studentId?: boolean
    studentName?: boolean
    rollNumber?: boolean
    date?: boolean
    status?: boolean
    markedById?: boolean
    markedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["attendanceRecord"]>

  export type AttendanceRecordSelectScalar = {
    id?: boolean
    schoolId?: boolean
    classId?: boolean
    studentId?: boolean
    studentName?: boolean
    rollNumber?: boolean
    date?: boolean
    status?: boolean
    markedById?: boolean
    markedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AttendanceRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "schoolId" | "classId" | "studentId" | "studentName" | "rollNumber" | "date" | "status" | "markedById" | "markedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["attendanceRecord"]>
  export type AttendanceRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    absenceResponse?: boolean | AttendanceRecord$absenceResponseArgs<ExtArgs>
  }
  export type AttendanceRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AttendanceRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AttendanceRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AttendanceRecord"
    objects: {
      absenceResponse: Prisma.$AbsenceResponsePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      schoolId: string
      classId: string
      studentId: string
      studentName: string
      rollNumber: string
      date: Date
      status: $Enums.AttendanceStatus
      markedById: string | null
      markedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["attendanceRecord"]>
    composites: {}
  }

  type AttendanceRecordGetPayload<S extends boolean | null | undefined | AttendanceRecordDefaultArgs> = $Result.GetResult<Prisma.$AttendanceRecordPayload, S>

  type AttendanceRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AttendanceRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AttendanceRecordCountAggregateInputType | true
    }

  export interface AttendanceRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AttendanceRecord'], meta: { name: 'AttendanceRecord' } }
    /**
     * Find zero or one AttendanceRecord that matches the filter.
     * @param {AttendanceRecordFindUniqueArgs} args - Arguments to find a AttendanceRecord
     * @example
     * // Get one AttendanceRecord
     * const attendanceRecord = await prisma.attendanceRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AttendanceRecordFindUniqueArgs>(args: SelectSubset<T, AttendanceRecordFindUniqueArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AttendanceRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AttendanceRecordFindUniqueOrThrowArgs} args - Arguments to find a AttendanceRecord
     * @example
     * // Get one AttendanceRecord
     * const attendanceRecord = await prisma.attendanceRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AttendanceRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, AttendanceRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AttendanceRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceRecordFindFirstArgs} args - Arguments to find a AttendanceRecord
     * @example
     * // Get one AttendanceRecord
     * const attendanceRecord = await prisma.attendanceRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AttendanceRecordFindFirstArgs>(args?: SelectSubset<T, AttendanceRecordFindFirstArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AttendanceRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceRecordFindFirstOrThrowArgs} args - Arguments to find a AttendanceRecord
     * @example
     * // Get one AttendanceRecord
     * const attendanceRecord = await prisma.attendanceRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AttendanceRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, AttendanceRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AttendanceRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AttendanceRecords
     * const attendanceRecords = await prisma.attendanceRecord.findMany()
     * 
     * // Get first 10 AttendanceRecords
     * const attendanceRecords = await prisma.attendanceRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const attendanceRecordWithIdOnly = await prisma.attendanceRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AttendanceRecordFindManyArgs>(args?: SelectSubset<T, AttendanceRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AttendanceRecord.
     * @param {AttendanceRecordCreateArgs} args - Arguments to create a AttendanceRecord.
     * @example
     * // Create one AttendanceRecord
     * const AttendanceRecord = await prisma.attendanceRecord.create({
     *   data: {
     *     // ... data to create a AttendanceRecord
     *   }
     * })
     * 
     */
    create<T extends AttendanceRecordCreateArgs>(args: SelectSubset<T, AttendanceRecordCreateArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AttendanceRecords.
     * @param {AttendanceRecordCreateManyArgs} args - Arguments to create many AttendanceRecords.
     * @example
     * // Create many AttendanceRecords
     * const attendanceRecord = await prisma.attendanceRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AttendanceRecordCreateManyArgs>(args?: SelectSubset<T, AttendanceRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AttendanceRecords and returns the data saved in the database.
     * @param {AttendanceRecordCreateManyAndReturnArgs} args - Arguments to create many AttendanceRecords.
     * @example
     * // Create many AttendanceRecords
     * const attendanceRecord = await prisma.attendanceRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AttendanceRecords and only return the `id`
     * const attendanceRecordWithIdOnly = await prisma.attendanceRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AttendanceRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, AttendanceRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AttendanceRecord.
     * @param {AttendanceRecordDeleteArgs} args - Arguments to delete one AttendanceRecord.
     * @example
     * // Delete one AttendanceRecord
     * const AttendanceRecord = await prisma.attendanceRecord.delete({
     *   where: {
     *     // ... filter to delete one AttendanceRecord
     *   }
     * })
     * 
     */
    delete<T extends AttendanceRecordDeleteArgs>(args: SelectSubset<T, AttendanceRecordDeleteArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AttendanceRecord.
     * @param {AttendanceRecordUpdateArgs} args - Arguments to update one AttendanceRecord.
     * @example
     * // Update one AttendanceRecord
     * const attendanceRecord = await prisma.attendanceRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AttendanceRecordUpdateArgs>(args: SelectSubset<T, AttendanceRecordUpdateArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AttendanceRecords.
     * @param {AttendanceRecordDeleteManyArgs} args - Arguments to filter AttendanceRecords to delete.
     * @example
     * // Delete a few AttendanceRecords
     * const { count } = await prisma.attendanceRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AttendanceRecordDeleteManyArgs>(args?: SelectSubset<T, AttendanceRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AttendanceRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AttendanceRecords
     * const attendanceRecord = await prisma.attendanceRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AttendanceRecordUpdateManyArgs>(args: SelectSubset<T, AttendanceRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AttendanceRecords and returns the data updated in the database.
     * @param {AttendanceRecordUpdateManyAndReturnArgs} args - Arguments to update many AttendanceRecords.
     * @example
     * // Update many AttendanceRecords
     * const attendanceRecord = await prisma.attendanceRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AttendanceRecords and only return the `id`
     * const attendanceRecordWithIdOnly = await prisma.attendanceRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AttendanceRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, AttendanceRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AttendanceRecord.
     * @param {AttendanceRecordUpsertArgs} args - Arguments to update or create a AttendanceRecord.
     * @example
     * // Update or create a AttendanceRecord
     * const attendanceRecord = await prisma.attendanceRecord.upsert({
     *   create: {
     *     // ... data to create a AttendanceRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AttendanceRecord we want to update
     *   }
     * })
     */
    upsert<T extends AttendanceRecordUpsertArgs>(args: SelectSubset<T, AttendanceRecordUpsertArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AttendanceRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceRecordCountArgs} args - Arguments to filter AttendanceRecords to count.
     * @example
     * // Count the number of AttendanceRecords
     * const count = await prisma.attendanceRecord.count({
     *   where: {
     *     // ... the filter for the AttendanceRecords we want to count
     *   }
     * })
    **/
    count<T extends AttendanceRecordCountArgs>(
      args?: Subset<T, AttendanceRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AttendanceRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AttendanceRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AttendanceRecordAggregateArgs>(args: Subset<T, AttendanceRecordAggregateArgs>): Prisma.PrismaPromise<GetAttendanceRecordAggregateType<T>>

    /**
     * Group by AttendanceRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AttendanceRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AttendanceRecordGroupByArgs['orderBy'] }
        : { orderBy?: AttendanceRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AttendanceRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttendanceRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AttendanceRecord model
   */
  readonly fields: AttendanceRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AttendanceRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AttendanceRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    absenceResponse<T extends AttendanceRecord$absenceResponseArgs<ExtArgs> = {}>(args?: Subset<T, AttendanceRecord$absenceResponseArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AttendanceRecord model
   */
  interface AttendanceRecordFieldRefs {
    readonly id: FieldRef<"AttendanceRecord", 'String'>
    readonly schoolId: FieldRef<"AttendanceRecord", 'String'>
    readonly classId: FieldRef<"AttendanceRecord", 'String'>
    readonly studentId: FieldRef<"AttendanceRecord", 'String'>
    readonly studentName: FieldRef<"AttendanceRecord", 'String'>
    readonly rollNumber: FieldRef<"AttendanceRecord", 'String'>
    readonly date: FieldRef<"AttendanceRecord", 'DateTime'>
    readonly status: FieldRef<"AttendanceRecord", 'AttendanceStatus'>
    readonly markedById: FieldRef<"AttendanceRecord", 'String'>
    readonly markedAt: FieldRef<"AttendanceRecord", 'DateTime'>
    readonly createdAt: FieldRef<"AttendanceRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"AttendanceRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AttendanceRecord findUnique
   */
  export type AttendanceRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * Filter, which AttendanceRecord to fetch.
     */
    where: AttendanceRecordWhereUniqueInput
  }

  /**
   * AttendanceRecord findUniqueOrThrow
   */
  export type AttendanceRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * Filter, which AttendanceRecord to fetch.
     */
    where: AttendanceRecordWhereUniqueInput
  }

  /**
   * AttendanceRecord findFirst
   */
  export type AttendanceRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * Filter, which AttendanceRecord to fetch.
     */
    where?: AttendanceRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AttendanceRecords to fetch.
     */
    orderBy?: AttendanceRecordOrderByWithRelationInput | AttendanceRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AttendanceRecords.
     */
    cursor?: AttendanceRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AttendanceRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AttendanceRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AttendanceRecords.
     */
    distinct?: AttendanceRecordScalarFieldEnum | AttendanceRecordScalarFieldEnum[]
  }

  /**
   * AttendanceRecord findFirstOrThrow
   */
  export type AttendanceRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * Filter, which AttendanceRecord to fetch.
     */
    where?: AttendanceRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AttendanceRecords to fetch.
     */
    orderBy?: AttendanceRecordOrderByWithRelationInput | AttendanceRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AttendanceRecords.
     */
    cursor?: AttendanceRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AttendanceRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AttendanceRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AttendanceRecords.
     */
    distinct?: AttendanceRecordScalarFieldEnum | AttendanceRecordScalarFieldEnum[]
  }

  /**
   * AttendanceRecord findMany
   */
  export type AttendanceRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * Filter, which AttendanceRecords to fetch.
     */
    where?: AttendanceRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AttendanceRecords to fetch.
     */
    orderBy?: AttendanceRecordOrderByWithRelationInput | AttendanceRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AttendanceRecords.
     */
    cursor?: AttendanceRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AttendanceRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AttendanceRecords.
     */
    skip?: number
    distinct?: AttendanceRecordScalarFieldEnum | AttendanceRecordScalarFieldEnum[]
  }

  /**
   * AttendanceRecord create
   */
  export type AttendanceRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a AttendanceRecord.
     */
    data: XOR<AttendanceRecordCreateInput, AttendanceRecordUncheckedCreateInput>
  }

  /**
   * AttendanceRecord createMany
   */
  export type AttendanceRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AttendanceRecords.
     */
    data: AttendanceRecordCreateManyInput | AttendanceRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AttendanceRecord createManyAndReturn
   */
  export type AttendanceRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * The data used to create many AttendanceRecords.
     */
    data: AttendanceRecordCreateManyInput | AttendanceRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AttendanceRecord update
   */
  export type AttendanceRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a AttendanceRecord.
     */
    data: XOR<AttendanceRecordUpdateInput, AttendanceRecordUncheckedUpdateInput>
    /**
     * Choose, which AttendanceRecord to update.
     */
    where: AttendanceRecordWhereUniqueInput
  }

  /**
   * AttendanceRecord updateMany
   */
  export type AttendanceRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AttendanceRecords.
     */
    data: XOR<AttendanceRecordUpdateManyMutationInput, AttendanceRecordUncheckedUpdateManyInput>
    /**
     * Filter which AttendanceRecords to update
     */
    where?: AttendanceRecordWhereInput
    /**
     * Limit how many AttendanceRecords to update.
     */
    limit?: number
  }

  /**
   * AttendanceRecord updateManyAndReturn
   */
  export type AttendanceRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * The data used to update AttendanceRecords.
     */
    data: XOR<AttendanceRecordUpdateManyMutationInput, AttendanceRecordUncheckedUpdateManyInput>
    /**
     * Filter which AttendanceRecords to update
     */
    where?: AttendanceRecordWhereInput
    /**
     * Limit how many AttendanceRecords to update.
     */
    limit?: number
  }

  /**
   * AttendanceRecord upsert
   */
  export type AttendanceRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the AttendanceRecord to update in case it exists.
     */
    where: AttendanceRecordWhereUniqueInput
    /**
     * In case the AttendanceRecord found by the `where` argument doesn't exist, create a new AttendanceRecord with this data.
     */
    create: XOR<AttendanceRecordCreateInput, AttendanceRecordUncheckedCreateInput>
    /**
     * In case the AttendanceRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AttendanceRecordUpdateInput, AttendanceRecordUncheckedUpdateInput>
  }

  /**
   * AttendanceRecord delete
   */
  export type AttendanceRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
    /**
     * Filter which AttendanceRecord to delete.
     */
    where: AttendanceRecordWhereUniqueInput
  }

  /**
   * AttendanceRecord deleteMany
   */
  export type AttendanceRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AttendanceRecords to delete
     */
    where?: AttendanceRecordWhereInput
    /**
     * Limit how many AttendanceRecords to delete.
     */
    limit?: number
  }

  /**
   * AttendanceRecord.absenceResponse
   */
  export type AttendanceRecord$absenceResponseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    where?: AbsenceResponseWhereInput
  }

  /**
   * AttendanceRecord without action
   */
  export type AttendanceRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AttendanceRecord
     */
    select?: AttendanceRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AttendanceRecord
     */
    omit?: AttendanceRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceRecordInclude<ExtArgs> | null
  }


  /**
   * Model AbsenceResponse
   */

  export type AggregateAbsenceResponse = {
    _count: AbsenceResponseCountAggregateOutputType | null
    _min: AbsenceResponseMinAggregateOutputType | null
    _max: AbsenceResponseMaxAggregateOutputType | null
  }

  export type AbsenceResponseMinAggregateOutputType = {
    id: string | null
    attendanceRecordId: string | null
    schoolId: string | null
    studentId: string | null
    parentId: string | null
    reason: string | null
    fileId: string | null
    fileName: string | null
    submittedAt: Date | null
    updatedAt: Date | null
  }

  export type AbsenceResponseMaxAggregateOutputType = {
    id: string | null
    attendanceRecordId: string | null
    schoolId: string | null
    studentId: string | null
    parentId: string | null
    reason: string | null
    fileId: string | null
    fileName: string | null
    submittedAt: Date | null
    updatedAt: Date | null
  }

  export type AbsenceResponseCountAggregateOutputType = {
    id: number
    attendanceRecordId: number
    schoolId: number
    studentId: number
    parentId: number
    reason: number
    fileId: number
    fileName: number
    submittedAt: number
    updatedAt: number
    _all: number
  }


  export type AbsenceResponseMinAggregateInputType = {
    id?: true
    attendanceRecordId?: true
    schoolId?: true
    studentId?: true
    parentId?: true
    reason?: true
    fileId?: true
    fileName?: true
    submittedAt?: true
    updatedAt?: true
  }

  export type AbsenceResponseMaxAggregateInputType = {
    id?: true
    attendanceRecordId?: true
    schoolId?: true
    studentId?: true
    parentId?: true
    reason?: true
    fileId?: true
    fileName?: true
    submittedAt?: true
    updatedAt?: true
  }

  export type AbsenceResponseCountAggregateInputType = {
    id?: true
    attendanceRecordId?: true
    schoolId?: true
    studentId?: true
    parentId?: true
    reason?: true
    fileId?: true
    fileName?: true
    submittedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AbsenceResponseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AbsenceResponse to aggregate.
     */
    where?: AbsenceResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AbsenceResponses to fetch.
     */
    orderBy?: AbsenceResponseOrderByWithRelationInput | AbsenceResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AbsenceResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AbsenceResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AbsenceResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AbsenceResponses
    **/
    _count?: true | AbsenceResponseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AbsenceResponseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AbsenceResponseMaxAggregateInputType
  }

  export type GetAbsenceResponseAggregateType<T extends AbsenceResponseAggregateArgs> = {
        [P in keyof T & keyof AggregateAbsenceResponse]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAbsenceResponse[P]>
      : GetScalarType<T[P], AggregateAbsenceResponse[P]>
  }




  export type AbsenceResponseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AbsenceResponseWhereInput
    orderBy?: AbsenceResponseOrderByWithAggregationInput | AbsenceResponseOrderByWithAggregationInput[]
    by: AbsenceResponseScalarFieldEnum[] | AbsenceResponseScalarFieldEnum
    having?: AbsenceResponseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AbsenceResponseCountAggregateInputType | true
    _min?: AbsenceResponseMinAggregateInputType
    _max?: AbsenceResponseMaxAggregateInputType
  }

  export type AbsenceResponseGroupByOutputType = {
    id: string
    attendanceRecordId: string
    schoolId: string
    studentId: string
    parentId: string
    reason: string
    fileId: string | null
    fileName: string | null
    submittedAt: Date
    updatedAt: Date
    _count: AbsenceResponseCountAggregateOutputType | null
    _min: AbsenceResponseMinAggregateOutputType | null
    _max: AbsenceResponseMaxAggregateOutputType | null
  }

  type GetAbsenceResponseGroupByPayload<T extends AbsenceResponseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AbsenceResponseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AbsenceResponseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AbsenceResponseGroupByOutputType[P]>
            : GetScalarType<T[P], AbsenceResponseGroupByOutputType[P]>
        }
      >
    >


  export type AbsenceResponseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attendanceRecordId?: boolean
    schoolId?: boolean
    studentId?: boolean
    parentId?: boolean
    reason?: boolean
    fileId?: boolean
    fileName?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
    attendanceRecord?: boolean | AttendanceRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["absenceResponse"]>

  export type AbsenceResponseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attendanceRecordId?: boolean
    schoolId?: boolean
    studentId?: boolean
    parentId?: boolean
    reason?: boolean
    fileId?: boolean
    fileName?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
    attendanceRecord?: boolean | AttendanceRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["absenceResponse"]>

  export type AbsenceResponseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    attendanceRecordId?: boolean
    schoolId?: boolean
    studentId?: boolean
    parentId?: boolean
    reason?: boolean
    fileId?: boolean
    fileName?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
    attendanceRecord?: boolean | AttendanceRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["absenceResponse"]>

  export type AbsenceResponseSelectScalar = {
    id?: boolean
    attendanceRecordId?: boolean
    schoolId?: boolean
    studentId?: boolean
    parentId?: boolean
    reason?: boolean
    fileId?: boolean
    fileName?: boolean
    submittedAt?: boolean
    updatedAt?: boolean
  }

  export type AbsenceResponseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "attendanceRecordId" | "schoolId" | "studentId" | "parentId" | "reason" | "fileId" | "fileName" | "submittedAt" | "updatedAt", ExtArgs["result"]["absenceResponse"]>
  export type AbsenceResponseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendanceRecord?: boolean | AttendanceRecordDefaultArgs<ExtArgs>
  }
  export type AbsenceResponseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendanceRecord?: boolean | AttendanceRecordDefaultArgs<ExtArgs>
  }
  export type AbsenceResponseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attendanceRecord?: boolean | AttendanceRecordDefaultArgs<ExtArgs>
  }

  export type $AbsenceResponsePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AbsenceResponse"
    objects: {
      attendanceRecord: Prisma.$AttendanceRecordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      attendanceRecordId: string
      schoolId: string
      studentId: string
      parentId: string
      reason: string
      fileId: string | null
      fileName: string | null
      submittedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["absenceResponse"]>
    composites: {}
  }

  type AbsenceResponseGetPayload<S extends boolean | null | undefined | AbsenceResponseDefaultArgs> = $Result.GetResult<Prisma.$AbsenceResponsePayload, S>

  type AbsenceResponseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AbsenceResponseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AbsenceResponseCountAggregateInputType | true
    }

  export interface AbsenceResponseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AbsenceResponse'], meta: { name: 'AbsenceResponse' } }
    /**
     * Find zero or one AbsenceResponse that matches the filter.
     * @param {AbsenceResponseFindUniqueArgs} args - Arguments to find a AbsenceResponse
     * @example
     * // Get one AbsenceResponse
     * const absenceResponse = await prisma.absenceResponse.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AbsenceResponseFindUniqueArgs>(args: SelectSubset<T, AbsenceResponseFindUniqueArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AbsenceResponse that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AbsenceResponseFindUniqueOrThrowArgs} args - Arguments to find a AbsenceResponse
     * @example
     * // Get one AbsenceResponse
     * const absenceResponse = await prisma.absenceResponse.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AbsenceResponseFindUniqueOrThrowArgs>(args: SelectSubset<T, AbsenceResponseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AbsenceResponse that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsenceResponseFindFirstArgs} args - Arguments to find a AbsenceResponse
     * @example
     * // Get one AbsenceResponse
     * const absenceResponse = await prisma.absenceResponse.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AbsenceResponseFindFirstArgs>(args?: SelectSubset<T, AbsenceResponseFindFirstArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AbsenceResponse that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsenceResponseFindFirstOrThrowArgs} args - Arguments to find a AbsenceResponse
     * @example
     * // Get one AbsenceResponse
     * const absenceResponse = await prisma.absenceResponse.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AbsenceResponseFindFirstOrThrowArgs>(args?: SelectSubset<T, AbsenceResponseFindFirstOrThrowArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AbsenceResponses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsenceResponseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AbsenceResponses
     * const absenceResponses = await prisma.absenceResponse.findMany()
     * 
     * // Get first 10 AbsenceResponses
     * const absenceResponses = await prisma.absenceResponse.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const absenceResponseWithIdOnly = await prisma.absenceResponse.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AbsenceResponseFindManyArgs>(args?: SelectSubset<T, AbsenceResponseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AbsenceResponse.
     * @param {AbsenceResponseCreateArgs} args - Arguments to create a AbsenceResponse.
     * @example
     * // Create one AbsenceResponse
     * const AbsenceResponse = await prisma.absenceResponse.create({
     *   data: {
     *     // ... data to create a AbsenceResponse
     *   }
     * })
     * 
     */
    create<T extends AbsenceResponseCreateArgs>(args: SelectSubset<T, AbsenceResponseCreateArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AbsenceResponses.
     * @param {AbsenceResponseCreateManyArgs} args - Arguments to create many AbsenceResponses.
     * @example
     * // Create many AbsenceResponses
     * const absenceResponse = await prisma.absenceResponse.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AbsenceResponseCreateManyArgs>(args?: SelectSubset<T, AbsenceResponseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AbsenceResponses and returns the data saved in the database.
     * @param {AbsenceResponseCreateManyAndReturnArgs} args - Arguments to create many AbsenceResponses.
     * @example
     * // Create many AbsenceResponses
     * const absenceResponse = await prisma.absenceResponse.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AbsenceResponses and only return the `id`
     * const absenceResponseWithIdOnly = await prisma.absenceResponse.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AbsenceResponseCreateManyAndReturnArgs>(args?: SelectSubset<T, AbsenceResponseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AbsenceResponse.
     * @param {AbsenceResponseDeleteArgs} args - Arguments to delete one AbsenceResponse.
     * @example
     * // Delete one AbsenceResponse
     * const AbsenceResponse = await prisma.absenceResponse.delete({
     *   where: {
     *     // ... filter to delete one AbsenceResponse
     *   }
     * })
     * 
     */
    delete<T extends AbsenceResponseDeleteArgs>(args: SelectSubset<T, AbsenceResponseDeleteArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AbsenceResponse.
     * @param {AbsenceResponseUpdateArgs} args - Arguments to update one AbsenceResponse.
     * @example
     * // Update one AbsenceResponse
     * const absenceResponse = await prisma.absenceResponse.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AbsenceResponseUpdateArgs>(args: SelectSubset<T, AbsenceResponseUpdateArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AbsenceResponses.
     * @param {AbsenceResponseDeleteManyArgs} args - Arguments to filter AbsenceResponses to delete.
     * @example
     * // Delete a few AbsenceResponses
     * const { count } = await prisma.absenceResponse.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AbsenceResponseDeleteManyArgs>(args?: SelectSubset<T, AbsenceResponseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AbsenceResponses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsenceResponseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AbsenceResponses
     * const absenceResponse = await prisma.absenceResponse.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AbsenceResponseUpdateManyArgs>(args: SelectSubset<T, AbsenceResponseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AbsenceResponses and returns the data updated in the database.
     * @param {AbsenceResponseUpdateManyAndReturnArgs} args - Arguments to update many AbsenceResponses.
     * @example
     * // Update many AbsenceResponses
     * const absenceResponse = await prisma.absenceResponse.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AbsenceResponses and only return the `id`
     * const absenceResponseWithIdOnly = await prisma.absenceResponse.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AbsenceResponseUpdateManyAndReturnArgs>(args: SelectSubset<T, AbsenceResponseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AbsenceResponse.
     * @param {AbsenceResponseUpsertArgs} args - Arguments to update or create a AbsenceResponse.
     * @example
     * // Update or create a AbsenceResponse
     * const absenceResponse = await prisma.absenceResponse.upsert({
     *   create: {
     *     // ... data to create a AbsenceResponse
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AbsenceResponse we want to update
     *   }
     * })
     */
    upsert<T extends AbsenceResponseUpsertArgs>(args: SelectSubset<T, AbsenceResponseUpsertArgs<ExtArgs>>): Prisma__AbsenceResponseClient<$Result.GetResult<Prisma.$AbsenceResponsePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AbsenceResponses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsenceResponseCountArgs} args - Arguments to filter AbsenceResponses to count.
     * @example
     * // Count the number of AbsenceResponses
     * const count = await prisma.absenceResponse.count({
     *   where: {
     *     // ... the filter for the AbsenceResponses we want to count
     *   }
     * })
    **/
    count<T extends AbsenceResponseCountArgs>(
      args?: Subset<T, AbsenceResponseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AbsenceResponseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AbsenceResponse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsenceResponseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AbsenceResponseAggregateArgs>(args: Subset<T, AbsenceResponseAggregateArgs>): Prisma.PrismaPromise<GetAbsenceResponseAggregateType<T>>

    /**
     * Group by AbsenceResponse.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsenceResponseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AbsenceResponseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AbsenceResponseGroupByArgs['orderBy'] }
        : { orderBy?: AbsenceResponseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AbsenceResponseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAbsenceResponseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AbsenceResponse model
   */
  readonly fields: AbsenceResponseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AbsenceResponse.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AbsenceResponseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attendanceRecord<T extends AttendanceRecordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AttendanceRecordDefaultArgs<ExtArgs>>): Prisma__AttendanceRecordClient<$Result.GetResult<Prisma.$AttendanceRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AbsenceResponse model
   */
  interface AbsenceResponseFieldRefs {
    readonly id: FieldRef<"AbsenceResponse", 'String'>
    readonly attendanceRecordId: FieldRef<"AbsenceResponse", 'String'>
    readonly schoolId: FieldRef<"AbsenceResponse", 'String'>
    readonly studentId: FieldRef<"AbsenceResponse", 'String'>
    readonly parentId: FieldRef<"AbsenceResponse", 'String'>
    readonly reason: FieldRef<"AbsenceResponse", 'String'>
    readonly fileId: FieldRef<"AbsenceResponse", 'String'>
    readonly fileName: FieldRef<"AbsenceResponse", 'String'>
    readonly submittedAt: FieldRef<"AbsenceResponse", 'DateTime'>
    readonly updatedAt: FieldRef<"AbsenceResponse", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AbsenceResponse findUnique
   */
  export type AbsenceResponseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * Filter, which AbsenceResponse to fetch.
     */
    where: AbsenceResponseWhereUniqueInput
  }

  /**
   * AbsenceResponse findUniqueOrThrow
   */
  export type AbsenceResponseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * Filter, which AbsenceResponse to fetch.
     */
    where: AbsenceResponseWhereUniqueInput
  }

  /**
   * AbsenceResponse findFirst
   */
  export type AbsenceResponseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * Filter, which AbsenceResponse to fetch.
     */
    where?: AbsenceResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AbsenceResponses to fetch.
     */
    orderBy?: AbsenceResponseOrderByWithRelationInput | AbsenceResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AbsenceResponses.
     */
    cursor?: AbsenceResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AbsenceResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AbsenceResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AbsenceResponses.
     */
    distinct?: AbsenceResponseScalarFieldEnum | AbsenceResponseScalarFieldEnum[]
  }

  /**
   * AbsenceResponse findFirstOrThrow
   */
  export type AbsenceResponseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * Filter, which AbsenceResponse to fetch.
     */
    where?: AbsenceResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AbsenceResponses to fetch.
     */
    orderBy?: AbsenceResponseOrderByWithRelationInput | AbsenceResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AbsenceResponses.
     */
    cursor?: AbsenceResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AbsenceResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AbsenceResponses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AbsenceResponses.
     */
    distinct?: AbsenceResponseScalarFieldEnum | AbsenceResponseScalarFieldEnum[]
  }

  /**
   * AbsenceResponse findMany
   */
  export type AbsenceResponseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * Filter, which AbsenceResponses to fetch.
     */
    where?: AbsenceResponseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AbsenceResponses to fetch.
     */
    orderBy?: AbsenceResponseOrderByWithRelationInput | AbsenceResponseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AbsenceResponses.
     */
    cursor?: AbsenceResponseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AbsenceResponses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AbsenceResponses.
     */
    skip?: number
    distinct?: AbsenceResponseScalarFieldEnum | AbsenceResponseScalarFieldEnum[]
  }

  /**
   * AbsenceResponse create
   */
  export type AbsenceResponseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * The data needed to create a AbsenceResponse.
     */
    data: XOR<AbsenceResponseCreateInput, AbsenceResponseUncheckedCreateInput>
  }

  /**
   * AbsenceResponse createMany
   */
  export type AbsenceResponseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AbsenceResponses.
     */
    data: AbsenceResponseCreateManyInput | AbsenceResponseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AbsenceResponse createManyAndReturn
   */
  export type AbsenceResponseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * The data used to create many AbsenceResponses.
     */
    data: AbsenceResponseCreateManyInput | AbsenceResponseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AbsenceResponse update
   */
  export type AbsenceResponseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * The data needed to update a AbsenceResponse.
     */
    data: XOR<AbsenceResponseUpdateInput, AbsenceResponseUncheckedUpdateInput>
    /**
     * Choose, which AbsenceResponse to update.
     */
    where: AbsenceResponseWhereUniqueInput
  }

  /**
   * AbsenceResponse updateMany
   */
  export type AbsenceResponseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AbsenceResponses.
     */
    data: XOR<AbsenceResponseUpdateManyMutationInput, AbsenceResponseUncheckedUpdateManyInput>
    /**
     * Filter which AbsenceResponses to update
     */
    where?: AbsenceResponseWhereInput
    /**
     * Limit how many AbsenceResponses to update.
     */
    limit?: number
  }

  /**
   * AbsenceResponse updateManyAndReturn
   */
  export type AbsenceResponseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * The data used to update AbsenceResponses.
     */
    data: XOR<AbsenceResponseUpdateManyMutationInput, AbsenceResponseUncheckedUpdateManyInput>
    /**
     * Filter which AbsenceResponses to update
     */
    where?: AbsenceResponseWhereInput
    /**
     * Limit how many AbsenceResponses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AbsenceResponse upsert
   */
  export type AbsenceResponseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * The filter to search for the AbsenceResponse to update in case it exists.
     */
    where: AbsenceResponseWhereUniqueInput
    /**
     * In case the AbsenceResponse found by the `where` argument doesn't exist, create a new AbsenceResponse with this data.
     */
    create: XOR<AbsenceResponseCreateInput, AbsenceResponseUncheckedCreateInput>
    /**
     * In case the AbsenceResponse was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AbsenceResponseUpdateInput, AbsenceResponseUncheckedUpdateInput>
  }

  /**
   * AbsenceResponse delete
   */
  export type AbsenceResponseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
    /**
     * Filter which AbsenceResponse to delete.
     */
    where: AbsenceResponseWhereUniqueInput
  }

  /**
   * AbsenceResponse deleteMany
   */
  export type AbsenceResponseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AbsenceResponses to delete
     */
    where?: AbsenceResponseWhereInput
    /**
     * Limit how many AbsenceResponses to delete.
     */
    limit?: number
  }

  /**
   * AbsenceResponse without action
   */
  export type AbsenceResponseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AbsenceResponse
     */
    select?: AbsenceResponseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AbsenceResponse
     */
    omit?: AbsenceResponseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsenceResponseInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ClassRosterEntryScalarFieldEnum: {
    id: 'id',
    schoolId: 'schoolId',
    classId: 'classId',
    className: 'className',
    studentId: 'studentId',
    studentName: 'studentName',
    rollNumber: 'rollNumber',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClassRosterEntryScalarFieldEnum = (typeof ClassRosterEntryScalarFieldEnum)[keyof typeof ClassRosterEntryScalarFieldEnum]


  export const AttendanceRecordScalarFieldEnum: {
    id: 'id',
    schoolId: 'schoolId',
    classId: 'classId',
    studentId: 'studentId',
    studentName: 'studentName',
    rollNumber: 'rollNumber',
    date: 'date',
    status: 'status',
    markedById: 'markedById',
    markedAt: 'markedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AttendanceRecordScalarFieldEnum = (typeof AttendanceRecordScalarFieldEnum)[keyof typeof AttendanceRecordScalarFieldEnum]


  export const AbsenceResponseScalarFieldEnum: {
    id: 'id',
    attendanceRecordId: 'attendanceRecordId',
    schoolId: 'schoolId',
    studentId: 'studentId',
    parentId: 'parentId',
    reason: 'reason',
    fileId: 'fileId',
    fileName: 'fileName',
    submittedAt: 'submittedAt',
    updatedAt: 'updatedAt'
  };

  export type AbsenceResponseScalarFieldEnum = (typeof AbsenceResponseScalarFieldEnum)[keyof typeof AbsenceResponseScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'AttendanceStatus'
   */
  export type EnumAttendanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttendanceStatus'>
    


  /**
   * Reference to a field of type 'AttendanceStatus[]'
   */
  export type ListEnumAttendanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttendanceStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type ClassRosterEntryWhereInput = {
    AND?: ClassRosterEntryWhereInput | ClassRosterEntryWhereInput[]
    OR?: ClassRosterEntryWhereInput[]
    NOT?: ClassRosterEntryWhereInput | ClassRosterEntryWhereInput[]
    id?: StringFilter<"ClassRosterEntry"> | string
    schoolId?: StringFilter<"ClassRosterEntry"> | string
    classId?: StringFilter<"ClassRosterEntry"> | string
    className?: StringFilter<"ClassRosterEntry"> | string
    studentId?: StringFilter<"ClassRosterEntry"> | string
    studentName?: StringFilter<"ClassRosterEntry"> | string
    rollNumber?: StringFilter<"ClassRosterEntry"> | string
    isActive?: BoolFilter<"ClassRosterEntry"> | boolean
    createdAt?: DateTimeFilter<"ClassRosterEntry"> | Date | string
    updatedAt?: DateTimeFilter<"ClassRosterEntry"> | Date | string
  }

  export type ClassRosterEntryOrderByWithRelationInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    className?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassRosterEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    schoolId_studentId?: ClassRosterEntrySchoolIdStudentIdCompoundUniqueInput
    AND?: ClassRosterEntryWhereInput | ClassRosterEntryWhereInput[]
    OR?: ClassRosterEntryWhereInput[]
    NOT?: ClassRosterEntryWhereInput | ClassRosterEntryWhereInput[]
    schoolId?: StringFilter<"ClassRosterEntry"> | string
    classId?: StringFilter<"ClassRosterEntry"> | string
    className?: StringFilter<"ClassRosterEntry"> | string
    studentId?: StringFilter<"ClassRosterEntry"> | string
    studentName?: StringFilter<"ClassRosterEntry"> | string
    rollNumber?: StringFilter<"ClassRosterEntry"> | string
    isActive?: BoolFilter<"ClassRosterEntry"> | boolean
    createdAt?: DateTimeFilter<"ClassRosterEntry"> | Date | string
    updatedAt?: DateTimeFilter<"ClassRosterEntry"> | Date | string
  }, "id" | "schoolId_studentId">

  export type ClassRosterEntryOrderByWithAggregationInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    className?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClassRosterEntryCountOrderByAggregateInput
    _max?: ClassRosterEntryMaxOrderByAggregateInput
    _min?: ClassRosterEntryMinOrderByAggregateInput
  }

  export type ClassRosterEntryScalarWhereWithAggregatesInput = {
    AND?: ClassRosterEntryScalarWhereWithAggregatesInput | ClassRosterEntryScalarWhereWithAggregatesInput[]
    OR?: ClassRosterEntryScalarWhereWithAggregatesInput[]
    NOT?: ClassRosterEntryScalarWhereWithAggregatesInput | ClassRosterEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClassRosterEntry"> | string
    schoolId?: StringWithAggregatesFilter<"ClassRosterEntry"> | string
    classId?: StringWithAggregatesFilter<"ClassRosterEntry"> | string
    className?: StringWithAggregatesFilter<"ClassRosterEntry"> | string
    studentId?: StringWithAggregatesFilter<"ClassRosterEntry"> | string
    studentName?: StringWithAggregatesFilter<"ClassRosterEntry"> | string
    rollNumber?: StringWithAggregatesFilter<"ClassRosterEntry"> | string
    isActive?: BoolWithAggregatesFilter<"ClassRosterEntry"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ClassRosterEntry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClassRosterEntry"> | Date | string
  }

  export type AttendanceRecordWhereInput = {
    AND?: AttendanceRecordWhereInput | AttendanceRecordWhereInput[]
    OR?: AttendanceRecordWhereInput[]
    NOT?: AttendanceRecordWhereInput | AttendanceRecordWhereInput[]
    id?: StringFilter<"AttendanceRecord"> | string
    schoolId?: StringFilter<"AttendanceRecord"> | string
    classId?: StringFilter<"AttendanceRecord"> | string
    studentId?: StringFilter<"AttendanceRecord"> | string
    studentName?: StringFilter<"AttendanceRecord"> | string
    rollNumber?: StringFilter<"AttendanceRecord"> | string
    date?: DateTimeFilter<"AttendanceRecord"> | Date | string
    status?: EnumAttendanceStatusFilter<"AttendanceRecord"> | $Enums.AttendanceStatus
    markedById?: StringNullableFilter<"AttendanceRecord"> | string | null
    markedAt?: DateTimeNullableFilter<"AttendanceRecord"> | Date | string | null
    createdAt?: DateTimeFilter<"AttendanceRecord"> | Date | string
    updatedAt?: DateTimeFilter<"AttendanceRecord"> | Date | string
    absenceResponse?: XOR<AbsenceResponseNullableScalarRelationFilter, AbsenceResponseWhereInput> | null
  }

  export type AttendanceRecordOrderByWithRelationInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    markedById?: SortOrderInput | SortOrder
    markedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    absenceResponse?: AbsenceResponseOrderByWithRelationInput
  }

  export type AttendanceRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    schoolId_studentId_date?: AttendanceRecordSchoolIdStudentIdDateCompoundUniqueInput
    AND?: AttendanceRecordWhereInput | AttendanceRecordWhereInput[]
    OR?: AttendanceRecordWhereInput[]
    NOT?: AttendanceRecordWhereInput | AttendanceRecordWhereInput[]
    schoolId?: StringFilter<"AttendanceRecord"> | string
    classId?: StringFilter<"AttendanceRecord"> | string
    studentId?: StringFilter<"AttendanceRecord"> | string
    studentName?: StringFilter<"AttendanceRecord"> | string
    rollNumber?: StringFilter<"AttendanceRecord"> | string
    date?: DateTimeFilter<"AttendanceRecord"> | Date | string
    status?: EnumAttendanceStatusFilter<"AttendanceRecord"> | $Enums.AttendanceStatus
    markedById?: StringNullableFilter<"AttendanceRecord"> | string | null
    markedAt?: DateTimeNullableFilter<"AttendanceRecord"> | Date | string | null
    createdAt?: DateTimeFilter<"AttendanceRecord"> | Date | string
    updatedAt?: DateTimeFilter<"AttendanceRecord"> | Date | string
    absenceResponse?: XOR<AbsenceResponseNullableScalarRelationFilter, AbsenceResponseWhereInput> | null
  }, "id" | "schoolId_studentId_date">

  export type AttendanceRecordOrderByWithAggregationInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    markedById?: SortOrderInput | SortOrder
    markedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AttendanceRecordCountOrderByAggregateInput
    _max?: AttendanceRecordMaxOrderByAggregateInput
    _min?: AttendanceRecordMinOrderByAggregateInput
  }

  export type AttendanceRecordScalarWhereWithAggregatesInput = {
    AND?: AttendanceRecordScalarWhereWithAggregatesInput | AttendanceRecordScalarWhereWithAggregatesInput[]
    OR?: AttendanceRecordScalarWhereWithAggregatesInput[]
    NOT?: AttendanceRecordScalarWhereWithAggregatesInput | AttendanceRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AttendanceRecord"> | string
    schoolId?: StringWithAggregatesFilter<"AttendanceRecord"> | string
    classId?: StringWithAggregatesFilter<"AttendanceRecord"> | string
    studentId?: StringWithAggregatesFilter<"AttendanceRecord"> | string
    studentName?: StringWithAggregatesFilter<"AttendanceRecord"> | string
    rollNumber?: StringWithAggregatesFilter<"AttendanceRecord"> | string
    date?: DateTimeWithAggregatesFilter<"AttendanceRecord"> | Date | string
    status?: EnumAttendanceStatusWithAggregatesFilter<"AttendanceRecord"> | $Enums.AttendanceStatus
    markedById?: StringNullableWithAggregatesFilter<"AttendanceRecord"> | string | null
    markedAt?: DateTimeNullableWithAggregatesFilter<"AttendanceRecord"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AttendanceRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AttendanceRecord"> | Date | string
  }

  export type AbsenceResponseWhereInput = {
    AND?: AbsenceResponseWhereInput | AbsenceResponseWhereInput[]
    OR?: AbsenceResponseWhereInput[]
    NOT?: AbsenceResponseWhereInput | AbsenceResponseWhereInput[]
    id?: StringFilter<"AbsenceResponse"> | string
    attendanceRecordId?: StringFilter<"AbsenceResponse"> | string
    schoolId?: StringFilter<"AbsenceResponse"> | string
    studentId?: StringFilter<"AbsenceResponse"> | string
    parentId?: StringFilter<"AbsenceResponse"> | string
    reason?: StringFilter<"AbsenceResponse"> | string
    fileId?: StringNullableFilter<"AbsenceResponse"> | string | null
    fileName?: StringNullableFilter<"AbsenceResponse"> | string | null
    submittedAt?: DateTimeFilter<"AbsenceResponse"> | Date | string
    updatedAt?: DateTimeFilter<"AbsenceResponse"> | Date | string
    attendanceRecord?: XOR<AttendanceRecordScalarRelationFilter, AttendanceRecordWhereInput>
  }

  export type AbsenceResponseOrderByWithRelationInput = {
    id?: SortOrder
    attendanceRecordId?: SortOrder
    schoolId?: SortOrder
    studentId?: SortOrder
    parentId?: SortOrder
    reason?: SortOrder
    fileId?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    attendanceRecord?: AttendanceRecordOrderByWithRelationInput
  }

  export type AbsenceResponseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    attendanceRecordId?: string
    AND?: AbsenceResponseWhereInput | AbsenceResponseWhereInput[]
    OR?: AbsenceResponseWhereInput[]
    NOT?: AbsenceResponseWhereInput | AbsenceResponseWhereInput[]
    schoolId?: StringFilter<"AbsenceResponse"> | string
    studentId?: StringFilter<"AbsenceResponse"> | string
    parentId?: StringFilter<"AbsenceResponse"> | string
    reason?: StringFilter<"AbsenceResponse"> | string
    fileId?: StringNullableFilter<"AbsenceResponse"> | string | null
    fileName?: StringNullableFilter<"AbsenceResponse"> | string | null
    submittedAt?: DateTimeFilter<"AbsenceResponse"> | Date | string
    updatedAt?: DateTimeFilter<"AbsenceResponse"> | Date | string
    attendanceRecord?: XOR<AttendanceRecordScalarRelationFilter, AttendanceRecordWhereInput>
  }, "id" | "attendanceRecordId">

  export type AbsenceResponseOrderByWithAggregationInput = {
    id?: SortOrder
    attendanceRecordId?: SortOrder
    schoolId?: SortOrder
    studentId?: SortOrder
    parentId?: SortOrder
    reason?: SortOrder
    fileId?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AbsenceResponseCountOrderByAggregateInput
    _max?: AbsenceResponseMaxOrderByAggregateInput
    _min?: AbsenceResponseMinOrderByAggregateInput
  }

  export type AbsenceResponseScalarWhereWithAggregatesInput = {
    AND?: AbsenceResponseScalarWhereWithAggregatesInput | AbsenceResponseScalarWhereWithAggregatesInput[]
    OR?: AbsenceResponseScalarWhereWithAggregatesInput[]
    NOT?: AbsenceResponseScalarWhereWithAggregatesInput | AbsenceResponseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AbsenceResponse"> | string
    attendanceRecordId?: StringWithAggregatesFilter<"AbsenceResponse"> | string
    schoolId?: StringWithAggregatesFilter<"AbsenceResponse"> | string
    studentId?: StringWithAggregatesFilter<"AbsenceResponse"> | string
    parentId?: StringWithAggregatesFilter<"AbsenceResponse"> | string
    reason?: StringWithAggregatesFilter<"AbsenceResponse"> | string
    fileId?: StringNullableWithAggregatesFilter<"AbsenceResponse"> | string | null
    fileName?: StringNullableWithAggregatesFilter<"AbsenceResponse"> | string | null
    submittedAt?: DateTimeWithAggregatesFilter<"AbsenceResponse"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AbsenceResponse"> | Date | string
  }

  export type ClassRosterEntryCreateInput = {
    id?: string
    schoolId: string
    classId: string
    className: string
    studentId: string
    studentName: string
    rollNumber: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassRosterEntryUncheckedCreateInput = {
    id?: string
    schoolId: string
    classId: string
    className: string
    studentId: string
    studentName: string
    rollNumber: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassRosterEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    className?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassRosterEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    className?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassRosterEntryCreateManyInput = {
    id?: string
    schoolId: string
    classId: string
    className: string
    studentId: string
    studentName: string
    rollNumber: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClassRosterEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    className?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClassRosterEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    className?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceRecordCreateInput = {
    id?: string
    schoolId: string
    classId: string
    studentId: string
    studentName: string
    rollNumber: string
    date: Date | string
    status?: $Enums.AttendanceStatus
    markedById?: string | null
    markedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    absenceResponse?: AbsenceResponseCreateNestedOneWithoutAttendanceRecordInput
  }

  export type AttendanceRecordUncheckedCreateInput = {
    id?: string
    schoolId: string
    classId: string
    studentId: string
    studentName: string
    rollNumber: string
    date: Date | string
    status?: $Enums.AttendanceStatus
    markedById?: string | null
    markedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    absenceResponse?: AbsenceResponseUncheckedCreateNestedOneWithoutAttendanceRecordInput
  }

  export type AttendanceRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    markedById?: NullableStringFieldUpdateOperationsInput | string | null
    markedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    absenceResponse?: AbsenceResponseUpdateOneWithoutAttendanceRecordNestedInput
  }

  export type AttendanceRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    markedById?: NullableStringFieldUpdateOperationsInput | string | null
    markedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    absenceResponse?: AbsenceResponseUncheckedUpdateOneWithoutAttendanceRecordNestedInput
  }

  export type AttendanceRecordCreateManyInput = {
    id?: string
    schoolId: string
    classId: string
    studentId: string
    studentName: string
    rollNumber: string
    date: Date | string
    status?: $Enums.AttendanceStatus
    markedById?: string | null
    markedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttendanceRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    markedById?: NullableStringFieldUpdateOperationsInput | string | null
    markedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    markedById?: NullableStringFieldUpdateOperationsInput | string | null
    markedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsenceResponseCreateInput = {
    id?: string
    schoolId: string
    studentId: string
    parentId: string
    reason: string
    fileId?: string | null
    fileName?: string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
    attendanceRecord: AttendanceRecordCreateNestedOneWithoutAbsenceResponseInput
  }

  export type AbsenceResponseUncheckedCreateInput = {
    id?: string
    attendanceRecordId: string
    schoolId: string
    studentId: string
    parentId: string
    reason: string
    fileId?: string | null
    fileName?: string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsenceResponseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendanceRecord?: AttendanceRecordUpdateOneRequiredWithoutAbsenceResponseNestedInput
  }

  export type AbsenceResponseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    attendanceRecordId?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsenceResponseCreateManyInput = {
    id?: string
    attendanceRecordId: string
    schoolId: string
    studentId: string
    parentId: string
    reason: string
    fileId?: string | null
    fileName?: string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsenceResponseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsenceResponseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    attendanceRecordId?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ClassRosterEntrySchoolIdStudentIdCompoundUniqueInput = {
    schoolId: string
    studentId: string
  }

  export type ClassRosterEntryCountOrderByAggregateInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    className?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassRosterEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    className?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClassRosterEntryMinOrderByAggregateInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    className?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumAttendanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAttendanceStatusFilter<$PrismaModel> | $Enums.AttendanceStatus
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AbsenceResponseNullableScalarRelationFilter = {
    is?: AbsenceResponseWhereInput | null
    isNot?: AbsenceResponseWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AttendanceRecordSchoolIdStudentIdDateCompoundUniqueInput = {
    schoolId: string
    studentId: string
    date: Date | string
  }

  export type AttendanceRecordCountOrderByAggregateInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    markedById?: SortOrder
    markedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AttendanceRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    markedById?: SortOrder
    markedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AttendanceRecordMinOrderByAggregateInput = {
    id?: SortOrder
    schoolId?: SortOrder
    classId?: SortOrder
    studentId?: SortOrder
    studentName?: SortOrder
    rollNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    markedById?: SortOrder
    markedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAttendanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.AttendanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAttendanceStatusFilter<$PrismaModel>
    _max?: NestedEnumAttendanceStatusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AttendanceRecordScalarRelationFilter = {
    is?: AttendanceRecordWhereInput
    isNot?: AttendanceRecordWhereInput
  }

  export type AbsenceResponseCountOrderByAggregateInput = {
    id?: SortOrder
    attendanceRecordId?: SortOrder
    schoolId?: SortOrder
    studentId?: SortOrder
    parentId?: SortOrder
    reason?: SortOrder
    fileId?: SortOrder
    fileName?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AbsenceResponseMaxOrderByAggregateInput = {
    id?: SortOrder
    attendanceRecordId?: SortOrder
    schoolId?: SortOrder
    studentId?: SortOrder
    parentId?: SortOrder
    reason?: SortOrder
    fileId?: SortOrder
    fileName?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AbsenceResponseMinOrderByAggregateInput = {
    id?: SortOrder
    attendanceRecordId?: SortOrder
    schoolId?: SortOrder
    studentId?: SortOrder
    parentId?: SortOrder
    reason?: SortOrder
    fileId?: SortOrder
    fileName?: SortOrder
    submittedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AbsenceResponseCreateNestedOneWithoutAttendanceRecordInput = {
    create?: XOR<AbsenceResponseCreateWithoutAttendanceRecordInput, AbsenceResponseUncheckedCreateWithoutAttendanceRecordInput>
    connectOrCreate?: AbsenceResponseCreateOrConnectWithoutAttendanceRecordInput
    connect?: AbsenceResponseWhereUniqueInput
  }

  export type AbsenceResponseUncheckedCreateNestedOneWithoutAttendanceRecordInput = {
    create?: XOR<AbsenceResponseCreateWithoutAttendanceRecordInput, AbsenceResponseUncheckedCreateWithoutAttendanceRecordInput>
    connectOrCreate?: AbsenceResponseCreateOrConnectWithoutAttendanceRecordInput
    connect?: AbsenceResponseWhereUniqueInput
  }

  export type EnumAttendanceStatusFieldUpdateOperationsInput = {
    set?: $Enums.AttendanceStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AbsenceResponseUpdateOneWithoutAttendanceRecordNestedInput = {
    create?: XOR<AbsenceResponseCreateWithoutAttendanceRecordInput, AbsenceResponseUncheckedCreateWithoutAttendanceRecordInput>
    connectOrCreate?: AbsenceResponseCreateOrConnectWithoutAttendanceRecordInput
    upsert?: AbsenceResponseUpsertWithoutAttendanceRecordInput
    disconnect?: AbsenceResponseWhereInput | boolean
    delete?: AbsenceResponseWhereInput | boolean
    connect?: AbsenceResponseWhereUniqueInput
    update?: XOR<XOR<AbsenceResponseUpdateToOneWithWhereWithoutAttendanceRecordInput, AbsenceResponseUpdateWithoutAttendanceRecordInput>, AbsenceResponseUncheckedUpdateWithoutAttendanceRecordInput>
  }

  export type AbsenceResponseUncheckedUpdateOneWithoutAttendanceRecordNestedInput = {
    create?: XOR<AbsenceResponseCreateWithoutAttendanceRecordInput, AbsenceResponseUncheckedCreateWithoutAttendanceRecordInput>
    connectOrCreate?: AbsenceResponseCreateOrConnectWithoutAttendanceRecordInput
    upsert?: AbsenceResponseUpsertWithoutAttendanceRecordInput
    disconnect?: AbsenceResponseWhereInput | boolean
    delete?: AbsenceResponseWhereInput | boolean
    connect?: AbsenceResponseWhereUniqueInput
    update?: XOR<XOR<AbsenceResponseUpdateToOneWithWhereWithoutAttendanceRecordInput, AbsenceResponseUpdateWithoutAttendanceRecordInput>, AbsenceResponseUncheckedUpdateWithoutAttendanceRecordInput>
  }

  export type AttendanceRecordCreateNestedOneWithoutAbsenceResponseInput = {
    create?: XOR<AttendanceRecordCreateWithoutAbsenceResponseInput, AttendanceRecordUncheckedCreateWithoutAbsenceResponseInput>
    connectOrCreate?: AttendanceRecordCreateOrConnectWithoutAbsenceResponseInput
    connect?: AttendanceRecordWhereUniqueInput
  }

  export type AttendanceRecordUpdateOneRequiredWithoutAbsenceResponseNestedInput = {
    create?: XOR<AttendanceRecordCreateWithoutAbsenceResponseInput, AttendanceRecordUncheckedCreateWithoutAbsenceResponseInput>
    connectOrCreate?: AttendanceRecordCreateOrConnectWithoutAbsenceResponseInput
    upsert?: AttendanceRecordUpsertWithoutAbsenceResponseInput
    connect?: AttendanceRecordWhereUniqueInput
    update?: XOR<XOR<AttendanceRecordUpdateToOneWithWhereWithoutAbsenceResponseInput, AttendanceRecordUpdateWithoutAbsenceResponseInput>, AttendanceRecordUncheckedUpdateWithoutAbsenceResponseInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumAttendanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAttendanceStatusFilter<$PrismaModel> | $Enums.AttendanceStatus
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.AttendanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAttendanceStatusFilter<$PrismaModel>
    _max?: NestedEnumAttendanceStatusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AbsenceResponseCreateWithoutAttendanceRecordInput = {
    id?: string
    schoolId: string
    studentId: string
    parentId: string
    reason: string
    fileId?: string | null
    fileName?: string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsenceResponseUncheckedCreateWithoutAttendanceRecordInput = {
    id?: string
    schoolId: string
    studentId: string
    parentId: string
    reason: string
    fileId?: string | null
    fileName?: string | null
    submittedAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsenceResponseCreateOrConnectWithoutAttendanceRecordInput = {
    where: AbsenceResponseWhereUniqueInput
    create: XOR<AbsenceResponseCreateWithoutAttendanceRecordInput, AbsenceResponseUncheckedCreateWithoutAttendanceRecordInput>
  }

  export type AbsenceResponseUpsertWithoutAttendanceRecordInput = {
    update: XOR<AbsenceResponseUpdateWithoutAttendanceRecordInput, AbsenceResponseUncheckedUpdateWithoutAttendanceRecordInput>
    create: XOR<AbsenceResponseCreateWithoutAttendanceRecordInput, AbsenceResponseUncheckedCreateWithoutAttendanceRecordInput>
    where?: AbsenceResponseWhereInput
  }

  export type AbsenceResponseUpdateToOneWithWhereWithoutAttendanceRecordInput = {
    where?: AbsenceResponseWhereInput
    data: XOR<AbsenceResponseUpdateWithoutAttendanceRecordInput, AbsenceResponseUncheckedUpdateWithoutAttendanceRecordInput>
  }

  export type AbsenceResponseUpdateWithoutAttendanceRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsenceResponseUncheckedUpdateWithoutAttendanceRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    parentId?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    fileId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceRecordCreateWithoutAbsenceResponseInput = {
    id?: string
    schoolId: string
    classId: string
    studentId: string
    studentName: string
    rollNumber: string
    date: Date | string
    status?: $Enums.AttendanceStatus
    markedById?: string | null
    markedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttendanceRecordUncheckedCreateWithoutAbsenceResponseInput = {
    id?: string
    schoolId: string
    classId: string
    studentId: string
    studentName: string
    rollNumber: string
    date: Date | string
    status?: $Enums.AttendanceStatus
    markedById?: string | null
    markedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttendanceRecordCreateOrConnectWithoutAbsenceResponseInput = {
    where: AttendanceRecordWhereUniqueInput
    create: XOR<AttendanceRecordCreateWithoutAbsenceResponseInput, AttendanceRecordUncheckedCreateWithoutAbsenceResponseInput>
  }

  export type AttendanceRecordUpsertWithoutAbsenceResponseInput = {
    update: XOR<AttendanceRecordUpdateWithoutAbsenceResponseInput, AttendanceRecordUncheckedUpdateWithoutAbsenceResponseInput>
    create: XOR<AttendanceRecordCreateWithoutAbsenceResponseInput, AttendanceRecordUncheckedCreateWithoutAbsenceResponseInput>
    where?: AttendanceRecordWhereInput
  }

  export type AttendanceRecordUpdateToOneWithWhereWithoutAbsenceResponseInput = {
    where?: AttendanceRecordWhereInput
    data: XOR<AttendanceRecordUpdateWithoutAbsenceResponseInput, AttendanceRecordUncheckedUpdateWithoutAbsenceResponseInput>
  }

  export type AttendanceRecordUpdateWithoutAbsenceResponseInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    markedById?: NullableStringFieldUpdateOperationsInput | string | null
    markedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceRecordUncheckedUpdateWithoutAbsenceResponseInput = {
    id?: StringFieldUpdateOperationsInput | string
    schoolId?: StringFieldUpdateOperationsInput | string
    classId?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    studentName?: StringFieldUpdateOperationsInput | string
    rollNumber?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    markedById?: NullableStringFieldUpdateOperationsInput | string | null
    markedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}