# Measure Repository Service

A prototype implementation of a [FHIR Measure Repository Service](https://build.fhir.org/ig/HL7/cqf-measures/measure-repository-service.html)

## Prerequisites

- [Node.js >=16.0.0](https://nodejs.org/en/)
- [MongoDB >= 6.0](https://www.mongodb.com)

### MongoDB

This test server makes use of [MongoDB](https://www.mongodb.com), a cross-platform document-oriented database program.

Follow the [MongoDB Community Edition installation guide](https://docs.mongodb.com/manual/installation/) for your platform, and follow the commands for running MongoDB on your machine.

### First time Database Setup

This server comes with a script to create collections for FHIR Measure, Library, and MeasureReport resources which will be used by the measure repository service.
To create these collections:

```
npm run db:setup
```

to clear the database and regenerate empty FHIR Measure, Library, and MeasureReport collections, run:

```
npm run db:reset
```

## Usage

Once MongoDB is running on your machine, run the `npm start` command to start up the Measure Repository Service server at `localhost:3000`.

You can also run `npm run start:clean`, which will reset the database before starting up the Measure Repository Service server.

For ease of testing, it is recommended to download [Insomnia API Client and Design Tool](https://insomnia.rest) for sending HTTP requests to the server and [Robo 3T](https://robomongo.org) as a GUI for viewing the Mongo database.

When sending requests, ensure that the `"Content-type": "application/json+fhir"` header is set.

### CRUD Operations

This server currently supports the following CRUD operations:

- Read by ID to endpoint: `4_0_1/<resourceType>/<resourceId>`
  _More functionality coming soon!_

### Search

The Measure Repository Service server supports `Library` and `Measure` resource search by the parameters specified in the shareable measure repository section of the [HL7 Measure Repository Docs](https://build.fhir.org/ig/HL7/cqf-measures/measure-repository-service.html#shareable-measure-repository). These parameters are:

- description
- identifier
- name
- status
- title
- url
- version

### Package

The Measure Repository Service server supports the `Library` and `Measure` `$package` operation with the `id` and `identifier` parameters and SHALL parameters specified in the shareable measure repository section of the [HL7 Measure Repository Docs](https://build.fhir.org/ig/HL7/cqf-measures/measure-repository-service.html#publishable-measure-repository). These parameters are:

- url
- version

## License

Copyright 2022 The MITRE Corporation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

```bash
http://www.apache.org/licenses/LICENSE-2.0
```

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
