import { Vector3 } from '../utils/types';

// return x, z based on x & Y of 2D image

/** 
 * Assume top down 2D image where
 * 
 *  (0,0) ___> + x (1,0)
 *  |
 *  |
 *  \/ +y
 *  (0,1)
 * 
 *  is aligned in 3D set up to
 * 
 * (0,0,0) ___> + x (1,0,0)
 *  |
 *  |
 *  \/ +Z
 *  (0,0,1)
 * 
 * the image may require rotation to reach this state
 * 
 * x, y - pixel location in the image
 * 
 * image_width x/y - image size in that dimesions
 * 
 * how much 3D space the image represents in each direction
 * 
 * offset x/y - how far the 3D scene origin is offset from the image origin
 */

export const get3DLocationFrom2D = (
  x: number,
  y: number, 
  image_width_x: number,
  image_width_y: number,
  spatial_width_x: number,
  spatial_width_z: number,
  offset_x: number,
  offset_y: number
) : Vector3 => {
  const final_x = offset_x + (x/image_width_x) * spatial_width_x;
  const final_z = offset_y + (y/image_width_y) * spatial_width_z;

  return {x: final_x, y: 0, z: final_z};
}