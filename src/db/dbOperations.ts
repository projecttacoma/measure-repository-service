import { FhirResourceType } from '@projecttacoma/node-fhir-server-core';
import { Filter } from 'mongodb';
import { Connection } from './Connection';

/**
 * searches the database for the desired resource and returns the data
 */
export async function findResourceById<T extends fhir4.FhirResource>(id: string, resourceType: FhirResourceType) {
  const collection = Connection.db.collection(resourceType);
  return collection.findOne<T>({ id: id }, { projection: { _id: 0 } });
}

/**
 * searches the database and returns an array of all resources of the given type that match the given query
 */
export async function findResourcesWithQuery<T extends fhir4.FhirResource>(
  query: Filter<any>,
  resourceType: FhirResourceType
) {
  const collection = Connection.db.collection(resourceType);
  return collection.find<T>(query, { projection: { _id: 0 } }).toArray();
}
