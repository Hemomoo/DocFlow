import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import type { ReactFlowProps } from 'reactflow';

import ReactFlowComponent from './ReactFlowComponent';

type ReactFlowOptions = {
  HTMLAttributes: Record<string, unknown>;
  flowProps?: Partial<ReactFlowProps>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    reactFlow: {
      insertFlow: (options?: ReactFlowProps) => ReturnType;
      setReactFlow: (options?: ReactFlowProps) => ReturnType;
    };
  }
}

export const ReactFlow = Node.create<ReactFlowOptions>({
  name: 'reactFlow',

  group: 'block',

  defining: true,

  isolating: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      flowProps: {
        minZoom: 0.1,
        maxZoom: 4,
        fitView: true,
      },
    };
  },

  addAttributes() {
    return {
      flowProps: {
        default: this.options.flowProps,
        parseHTML: (element) => {
          const props = element.getAttribute('data-flow-props');

          return props ? JSON.parse(props) : this.options.flowProps;
        },
        renderHTML: (attributes) => ({
          'data-flow-props': JSON.stringify(attributes.flowProps),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="react-flow"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'react-flow',
        class: 'react-flow-container',
      }),
    ];
  },

  addCommands() {
    return {
      setReactFlow:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              flowProps: {
                ...this.options.flowProps,
                ...options,
              },
            },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ReactFlowComponent);
  },
});
