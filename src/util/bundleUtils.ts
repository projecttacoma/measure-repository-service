import { loggers } from '@projecttacoma/node-fhir-server-core';
import { FhirResource, Library } from 'fhir/r4';
import { Filter } from 'mongodb';
import { v4 } from 'uuid';
import { findResourcesWithQuery } from '../db/dbOperations';
import { ResourceNotFoundError } from '../util/errorUtils';

const logger = loggers.get('default');

/**
 * Takes in an array of FHIR resources and creates a FHIR searchset Bundle with the
 * inputted resources as entries
 */
export function createSearchsetBundle<T extends fhir4.FhirResource>(entries: T[]): fhir4.Bundle<T> {
  return {
    resourceType: 'Bundle',
    meta: { lastUpdated: new Date().toISOString() },
    id: v4(),
    type: 'searchset',
    total: entries.length,
    entry: entries.map(e => ({ resource: e }))
  };
}

/**
 * Takes in a measure resource, finds all dependent library resources and bundles them
 * together with the measure in a collection bundle
 */
export async function createMeasurePackageBundle(measure: fhir4.Measure): Promise<fhir4.Bundle<FhirResource>> {
  logger.info(`Assembling collection bundle from Measure ${measure.id}`);
  if (measure.library && measure.library.length > 0) {
    const [mainLibraryRef] = measure.library;
    const mainLibQuery = getQueryFromReference(mainLibraryRef);
    const libs = await findResourcesWithQuery(mainLibQuery, 'Library');

    if (!libs || libs.length < 1) {
      throw new ResourceNotFoundError(`Could not find Library ${mainLibraryRef} referenced by Measure ${measure.id}`);
    }
    const mainLib = libs[0];

    const allLibsDups = await getAllDependentLibraries(mainLib as Library);
    // de-dup by id using map
    const idMap = new Map(allLibsDups.map(lib => [lib.id, lib]));
    const allLibs = Array.from(idMap.values());
    const result: fhir4.Bundle = { resourceType: 'Bundle', type: 'collection' };
    result.entry = allLibs.map(r => ({
      resource: r
    }));
    return result;
  } else {
    throw new ResourceNotFoundError(`No libraries found for measure ${measure.id}`);
  }
}

/**
 * Assemble a mongo query based on a reference to another resource
 * @param {string} reference assumed to be canonical
 * @returns {Filter} mongo query to pass in to mongo controller to search for the referenced resource
 */
function getQueryFromReference(reference: string): Filter<any> {
  if (reference.includes('|')) {
    const [urlPart, versionPart] = reference.split('|');
    return { url: urlPart, version: versionPart };
  } else {
    return { url: reference };
  }
}

/**
 * Iterate through relatedArtifact of library and return list of all dependent libraries used
 */
async function getAllDependentLibraries(lib: Library): Promise<Library[]> {
  logger.info(`Retrieving all dependent libraries for library: ${lib.id}`);
  const results = [lib];

  // If the library has no dependencies, we are done
  if (!lib.relatedArtifact || (Array.isArray(lib.relatedArtifact) && lib.relatedArtifact.length === 0)) {
    return results;
  }

  // This filter checks for the 'Library' keyword on all related artifacts
  const depLibUrls = lib.relatedArtifact
    .filter(
      ra =>
        ra.type === 'depends-on' &&
        ra.resource?.includes('Library') &&
        ra.resource !== 'http://fhir.org/guides/cqf/common/Library/FHIR-ModelInfo|4.0.1'
    ) // exclude modelinfo dependency
    .map(ra => ra.resource as string); //TODO: may be able to improve this typing
  // Obtain all libraries referenced in the related artifact, and recurse on their dependencies
  const libraryGets = depLibUrls.map(async url => {
    // TODO: remove if not needed -> Quick fix for invalid connectathon url references
    // if (url in INCORRECT_CONNECTATHON_URLS_MAP) {
    //   logger.warn(
    //     `Using potentially outdated reference url: ${url}. Replacing with ${INCORRECT_CONNECTATHON_URLS_MAP[url]}`
    //   );
    //   url = INCORRECT_CONNECTATHON_URLS_MAP[url];
    // }
    const libQuery = getQueryFromReference(url);
    const libs = await findResourcesWithQuery(libQuery, 'Library');
    if (!libs || libs.length < 1) {
      throw new ResourceNotFoundError(
        `Failed to find dependent library with ${
          libQuery.id ? `id: ${libQuery.id}` : `canonical url: ${libQuery.url}`
        }${libQuery.version ? ` and version: ${libQuery.version}` : ''}`
      );
    }
    return getAllDependentLibraries(libs[0] as Library);
  });

  const allDeps = await Promise.all(libraryGets);

  results.push(...allDeps.flat());

  return results;
}
