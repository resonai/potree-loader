// -------------------------------------------------------------------------------------------------
// Converted to Typescript and adapted from https://github.com/potree/potree
// -------------------------------------------------------------------------------------------------

import { Box3, Vector3 } from 'three';
import { PointCloudOctreeGeometry } from '../point-cloud-octree-geometry';
import { PointCloudOctreeGeometryNode } from '../point-cloud-octree-geometry-node';
import { gsToPath } from '../utils/utils';
import { GetUrlFn, XhrRequest } from './types';
import { YBFLoader } from './ybf-loader';

export function loadResonaiPOC(
  url: string,
  getUrl: GetUrlFn,
  xhrRequest: XhrRequest,
  callbacks: ((node: PointCloudOctreeGeometryNode) => void)[]
): Promise<PointCloudOctreeGeometry> {
  const fullUrl = gsToPath(url)
  // const cachedFile = localStorage.getItem(fullUrl)
  // if (cachedFile)
  return xhrRequest(fullUrl, { mode: 'cors' })
  .then(res => res.json())
  .then(parseResonai(fullUrl, getUrl, xhrRequest, callbacks));
}

function parseResonai(
  url: string,
  getUrl: GetUrlFn,
  xhrRequest: XhrRequest,
  callbacks: ((node: PointCloudOctreeGeometryNode) => void)[]
): (data: any) => Promise<any> {
  return (data: any): Promise<PointCloudOctreeGeometry> => {
    const boundingBox = getResonaiBoundingBoxes(data);
    const loader = new YBFLoader({
      url, getUrl, callbacks
    });

    const pco = new PointCloudOctreeGeometry(
      loader,
      boundingBox,
      boundingBox,
      new Vector3(),
      xhrRequest
    );

    pco.url = url;
    pco.needsUpdate = true;

    const nodes: Record<string, PointCloudOctreeGeometryNode> = {};
    return loadResonaiRoot(pco, data, nodes).then(height => {
      pco.nodes = nodes;
      pco.height = height
      return pco;
    });
  };
}

function getResonaiBoundingBoxes(
  data: any, // TODO(Shai) implement interface?
) {
  const min = new Vector3(...data.min_bounding_box);
  const max = min.clone().addScalar(data.scale);
  const boundingBox = new Box3(min, max);
  return boundingBox;
}

// tslint:disable:no-bitwise
function loadResonaiRoot(
  pco: PointCloudOctreeGeometry,
  data: any,
  nodes: Record<string, PointCloudOctreeGeometryNode>,
): Promise<number> {
  const name = 'r';

  const root = new PointCloudOctreeGeometryNode(name, pco, pco.boundingBox, 0);
  root.hasChildren = true;
  const mask = (1 << 24) - 1;
  root.numPoints = data.nodes[0] & mask;
  root.numPoints = 0;
  root.hierarchyData = data;
  pco.root = root;
  nodes[name] = root;
  return pco.root.loadResonai().then(height => height || 0);
}
