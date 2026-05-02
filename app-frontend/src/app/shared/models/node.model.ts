export interface Node {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  node_type: 'main' | 'sub';
  parent_node_id?: number;
}