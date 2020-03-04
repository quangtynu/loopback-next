// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Constructor} from '@loopback/context';
import assert from 'assert';
import {Entity, Model} from './model';
import {
  CrudRepository,
  DefaultCrudRepository,
  DefaultKeyValueRepository,
  EntityCrudRepository,
  juggler,
  KeyValueRepository,
  Repository,
} from './repositories';

/**
 * Signature for CrudRepository classes
 *
 * @typeParam M - Model class
 * @typeParam R - Repository class/interface
 */
export interface CrudRepositoryClass<
  M extends Model,
  R extends CrudRepository<M>
> {
  /**
   * The constructor for the generated repository class
   * @param dataSource - DataSource object
   */
  new (dataSource: juggler.DataSource): R;
  prototype: R;
}

/**
 * Signature for EntityCrudRepository classes
 *
 * @typeParam E - An entity class
 * @typeParam IdType - ID type for the entity
 * @typeParam Relations - Relations for the entity
 */
export interface EntityCrudRepositoryClass<
  E extends Entity,
  IdType,
  Relations extends object
> extends CrudRepositoryClass<E, EntityCrudRepository<E, IdType, Relations>> {}

/**
 * Signature for repository classes that can be used as the base class for
 * `define*` functions
 *
 * @typeParam M - Model class
 * @typeParam R - Repository class/interface
 */
export interface BaseRepositoryClass<M extends Model, R extends Repository<M>> {
  /**
   * The constructor for the generated repository class
   * @param dataSource - DataSource object
   */
  new (modeCtor: Constructor<M>, dataSource: juggler.DataSource): R;
  prototype: R;
}
/**
 * Create (define) a CRUD repository class for the given model.
 *
 * @example
 *
 * ```ts
 * const AddressRepository = defineCrudRepositoryClass(Address);
 * ```
 *
 * @param modelClass - A model class such as `Address`.
 *
 * @typeParam M - Model class
 * @typeParam R - CRUD Repository class/interface
 */
export function defineCrudRepositoryClass<
  M extends Model,
  R extends CrudRepository<M>
>(
  modelClass: typeof Model & {prototype: M},
  baseRepositoryClass: BaseRepositoryClass<M, R>,
): CrudRepositoryClass<M, R> {
  const repoName = modelClass.name + 'Repository';
  const defineNamedRepo = new Function(
    'ModelCtor',
    'BaseRepository',
    `return class ${repoName} extends BaseRepository {
      constructor(dataSource) {
        super(ModelCtor, dataSource);
      }
    };`,
  );

  const repo = defineNamedRepo(modelClass, baseRepositoryClass);
  assert.equal(repo.name, repoName);
  return repo;
}

/**
 * Create (define) an entity CRUD repository class for the given model.
 *
 * @example
 *
 * ```ts
 * const ProductRepository = defineEntityCrudRepositoryClass(Product);
 * ```
 *
 * @param entityClass - An entity class such as `Product`.
 * @param baseRepositoryClass - Base repository class. Defaults to `DefaultCrudRepository`
 *
 * @typeParam E - An entity class
 * @typeParam IdType - ID type for the entity
 * @typeParam Relations - Relations for the entity
 */
export function defineEntityCrudRepositoryClass<
  E extends Entity,
  IdType,
  Relations extends object = {}
>(
  entityClass: typeof Entity & {prototype: E},
  baseRepositoryClass: BaseRepositoryClass<
    E,
    EntityCrudRepository<E, IdType, Relations>
  > = (DefaultCrudRepository as unknown) as BaseRepositoryClass<
    E,
    EntityCrudRepository<E, IdType, Relations>
  >,
): EntityCrudRepositoryClass<E, IdType, Relations> {
  return defineCrudRepositoryClass(entityClass, baseRepositoryClass);
}

/**
 * Create (define) a KeyValue repository class for the given entity.
 *
 * @example
 *
 * ```ts
 * const ProductKeyValueRepository = defineKeyValueRepositoryClass(Product);
 * ```
 *
 * @param entityClass - An entity class such as `Product`.
 * @param baseRepositoryClass - Base KeyValue repository class.
 * Defaults to `DefaultKeyValueRepository`
 *
 * @typeParam E - Entity class
 * @typeParam R - KeyValueRepository class/interface
 */
export function defineKeyValueRepositoryClass<
  E extends Entity,
  R extends KeyValueRepository<E> = KeyValueRepository<E>
>(
  entityClass: typeof Entity & {prototype: E},
  baseRepositoryClass: BaseRepositoryClass<
    E,
    R
  > = (DefaultKeyValueRepository as unknown) as BaseRepositoryClass<E, R>,
): KeyValueRepositoryClass<E, R> {
  const repoName = entityClass.name + 'Repository';
  const defineNamedRepo = new Function(
    'EntityCtor',
    'BaseRepository',
    `return class ${repoName} extends BaseRepository {
      constructor(dataSource) {
        super(EntityCtor, dataSource);
      }
    };`,
  );

  const repo = defineNamedRepo(entityClass, baseRepositoryClass);
  assert.equal(repo.name, repoName);
  return repo;
}

/**
 * Signature for KeyValueRepository classes
 *
 * @typeParam E - Entity class
 */
export interface KeyValueRepositoryClass<
  E extends Entity,
  R extends KeyValueRepository<E> = KeyValueRepository<E>
> {
  /**
   * The constructor for the generated key value repository class
   * @param dataSource - DataSource object
   */
  new (dataSource: juggler.DataSource): R;
  prototype: KeyValueRepository<E>;
}
