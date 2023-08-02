// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2022
// SPDX-License-Identifier: Apache-2.0

import { SceneFactoryImpl } from '../../factory/scene_factory_impl';
import { EmptyNode } from '../../node/empty_node';
import { parseArgs, parseCsv } from './sample_utils';
import { get3DLocationFrom2D } from '../../2D_conversion/2D_conversion';
import { TagNode } from '../../node/tag/tag';

const { 
  workspaceId, 
  sceneId, 
} = parseArgs();

const factory = new SceneFactoryImpl();

// Create a scene or load an existing scene for updates
factory.loadOrCreateSceneIfNotExists(workspaceId, sceneId).then(async (twinMakerScene) => {

  // Uncomment this line to reset the scene on every run of this sample
  twinMakerScene.clear();
  
  // Edit the scene
  console.log('Creating/Editing scene...');

  // Set the Environmental Preset in the Scene settings
  twinMakerScene.setEnviromentPreset('neutral');

  // Add a Root Node to the Scene
  console.log('Building scene...');
  const rootNode = new EmptyNode('AWSIoTTwinMakerScene');

  console.log('Parsing CSV input');
  const mixerTransformCsvPath = `${__dirname}/2D_tags.csv`;
  const csvResult = parseCsv(mixerTransformCsvPath);

  console.log('Adding Tags');

  csvResult.forEach((parameter) => {
    const position = get3DLocationFrom2D(
      parameter.x,
      parameter.y,
      parameter.image_width_x,
      parameter.image_width_y,
      parameter.spatial_width_x,
      parameter.spatial_width_z,
      parameter.offset_x,
      parameter.offset_y);

    // Create an instance of Tag Node
    const tagNode: TagNode = new TagNode(parameter.name);
    tagNode.withPosition(position);
    
    rootNode.addChildNode(tagNode);
  });

  twinMakerScene.addRootNodeIfNameNotExist(rootNode);

  // Save the changes to the Scene
  await factory.save(twinMakerScene);
}).catch(err => {
  console.error(err);
});
