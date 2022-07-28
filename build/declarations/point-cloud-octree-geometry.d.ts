import { Box3, Vector3 } from 'three';
import { XhrRequest, YBFLoader } from './loading';
import { PointAttributes } from './point-attributes';
import { PointCloudOctreeGeometryNode } from './point-cloud-octree-geometry-node';
export declare class PointCloudOctreeGeometry {
    loader: YBFLoader;
    boundingBox: Box3;
    tightBoundingBox: Box3;
    offset: Vector3;
    xhrRequest: XhrRequest;
    disposed: boolean;
    needsUpdate: boolean;
    root: PointCloudOctreeGeometryNode;
    octreeDir: string;
    hierarchyStepSize: number;
    nodes: Record<string, PointCloudOctreeGeometryNode>;
    numNodesLoading: number;
    maxNumNodesLoading: number;
    spacing: number;
    pointAttributes: PointAttributes;
    projection: any;
    url: string | null;
    height: number;
    constructor(loader: YBFLoader, boundingBox: Box3, tightBoundingBox: Box3, offset: Vector3, xhrRequest: XhrRequest);
    dispose(): void;
    addNodeLoadedCallback(callback: (node: PointCloudOctreeGeometryNode) => void): void;
    clearNodeLoadedCallbacks(): void;
}
