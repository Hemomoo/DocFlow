'use client';

import ReactFlow, { Controls, Background, Node, Edge } from 'reactflow';
import { NodeViewWrapper } from '@tiptap/react';
import 'reactflow/dist/style.css';

interface ReactFlowComponentProps {
  node: {
    attrs: {
      flowProps?: {
        nodes?: Node[];
        edges?: Edge[];
        minZoom?: number;
        maxZoom?: number;
        fitView?: boolean;
      };
    };
  };
}

const defaultNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: '开始节点' },
    type: 'default',
  },
  {
    id: '2',
    position: { x: 200, y: 100 },
    data: { label: '处理节点' },
    type: 'default',
  },
];

const defaultEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
  },
];

export const ReactFlowComponent = ({ node }: ReactFlowComponentProps) => {
  const flowProps = node.attrs.flowProps || {};
  const nodes = flowProps.nodes || defaultNodes;
  const edges = flowProps.edges || defaultEdges;

  return (
    <NodeViewWrapper className="react-flow-node">
      <div className="h-[400px] border rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          minZoom={flowProps.minZoom || 0.1}
          maxZoom={flowProps.maxZoom || 4}
          fitView={flowProps.fitView !== false}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </NodeViewWrapper>
  );
};

export default ReactFlowComponent;
