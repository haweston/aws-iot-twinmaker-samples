// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0

import minimist from 'minimist';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

export interface I2DMappingSampleArguments {
  workspaceId: string;
  sceneId: string;
}

export interface I2DParamters {
  name: string,
  x: number,
  y: number, 
  image_width_x: number,
  image_width_y: number,
  spatial_width_x: number,
  spatial_width_z: number,
  offset_x: number,
  offset_y: number
}

export const help = () => {
  console.log(`Configure the AWS credentials and AWS region in your environment by setting env variables:
    * AWS_ACCESS_KEY_ID
    * AWS_SECRET_ACCESS_KEY
    * AWS_SESSION_TOKEN
    * AWS_REGION (e.g. us-east-1)
  
  Usage: 
 
    arguments:
      --workspaceId         REQUIRED
      --sceneId             REQUIRED

    You must provide an IoT TwinMaker workspaceId and sceneId. Then use an argument to decide what step to start at for your use case.
   
    Sample scene creation:
      npx ts-node 2D_sample/sample.ts --workspaceId Factory --sceneId FactoryScene
    `);
};

// Parses command-line arguments for the sample files to extract the supported settings.
export const parseArgs = (): I2DMappingSampleArguments => {
  const args: I2DMappingSampleArguments = {
    workspaceId: '',
    sceneId: '',
  };
  const parsedArgs = minimist(process.argv.slice(2));
  for (const arg of Object.keys(parsedArgs)) {
    switch (arg) {
      case 'h':
      case 'help':
        help();
        process.exit(0);
      case 'workspaceId':
        args.workspaceId = parsedArgs[arg];
        break;
      case 'sceneId':
        args.sceneId = parsedArgs[arg];
        break;
      case '_':
        break;
      default:
        console.error(`unknown arg "--${arg}"`);
        help();
        process.exit(1);
    }
  }

  if (args.workspaceId === '' || args.sceneId === '') {
    help();
    process.exit(1);
  }
  return args;
};


export const parseCsv = (filePath: string): I2DParamters[] => {
  const headers = [
    'name',
    'image_x',
    'image_y',
    'image_width_x',
    'image_width_y',
    'spatial_width_x',
    'spatial_width_z',
    'offset_x',
    'offset_y'];
  const fileContent = readFileSync(filePath, { encoding: 'utf-8' });

  const content = parse(fileContent, {
    delimiter: ',',
    columns: headers,
    fromLine: 2, //skip header row
  });

  // Ensure values are numbers
  const parameters: I2DParamters[] = [];
  for (const row of content) {
    const parameter: I2DParamters = {
      name: row.name,
      x: +row.image_x,
      y: +row.image_y,
      image_width_x: +row.image_width_x,
      image_width_y: +row.image_width_y,
      spatial_width_x: +row.spatial_width_x,
      spatial_width_z: +row.spatial_width_z,
      offset_x: +row.offset_x,
      offset_y: +row.offset_y,
    };
    parameters.push(parameter);
  }
  return parameters;
};