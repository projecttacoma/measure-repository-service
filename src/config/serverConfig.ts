import { constants, ServerConfig } from '@projecttacoma/node-fhir-server-core';
import { MeasureService, LibraryService } from '../services';

export const serverConfig: ServerConfig = {
  profiles: {
    Measure: {
      service: new MeasureService(),
      versions: [constants.VERSIONS['4_0_1']],
      operation: [
        {
          name: 'package',
          route: '/$package',
          method: 'GET',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Measure-package'
        },
        {
          name: 'package',
          route: '/$package',
          method: 'POST',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Measure-package'
        },
        {
          name: 'package',
          route: '/:id/$package',
          method: 'GET',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Measure-package'
        },
        {
          name: 'package',
          route: '/:id/$package',
          method: 'POST',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Measure-package'
        },
        {
          name: 'dataRequirements',
          route: '/$data-requirements',
          method: 'GET',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Measure-data-requirements'
        },
        {
          name: 'dataRequirements',
          route: '/$data-requirements',
          method: 'POST',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Measure-data-requirements'
        },
        {
          name: 'dataRequirements',
          route: '/:id/$data-requirements',
          method: 'GET',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Measure-data-requirements'
        },
        {
          name: 'dataRequirements',
          route: '/:id/$data-requirements',
          method: 'POST',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Measure-data-requirements'
        }
      ]
    },
    Library: {
      service: new LibraryService(),
      versions: [constants.VERSIONS['4_0_1']],
      operation: [
        {
          name: 'package',
          route: '/$package',
          method: 'GET',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Library-package'
        },
        {
          name: 'package',
          route: '/$package',
          method: 'POST',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Library-package'
        },
        {
          name: 'package',
          route: '/:id/$package',
          method: 'GET',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Library-package'
        },
        {
          name: 'package',
          route: '/:id/$package',
          method: 'POST',
          reference: 'http://hl7.org/fhir/us/cqfmeasures/OperationDefinition/Library-package'
        }
      ]
    }
  }
};
