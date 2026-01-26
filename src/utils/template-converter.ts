import { Editor } from '@tiptap/core';
import { JSONContent } from '@tiptap/core';

import { ExtensionKit } from '@/extensions/extension-kit';
import { MarkdownPaste, parseMarkdownToProseMirror } from '@/extensions/MarkdownPaste';

export interface TemplateToTiptapOptions {
  content: string;
}

export function templateToTiptapJSON(options: TemplateToTiptapOptions): JSONContent {
  const { content } = options;

  if (!content || content.trim() === '') {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    };
  }

  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      },
    ],
  };
}

export async function templateToTiptapJSONWithEditor(
  options: TemplateToTiptapOptions,
): Promise<JSONContent> {
  const { content } = options;

  if (!content || content.trim() === '') {
    return {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    };
  }

  return new Promise((resolve) => {
    new Editor({
      content: '',
      extensions: [
        ...ExtensionKit({ provider: null }),
        MarkdownPaste.configure({
          transformPastedText: true,
        }),
      ],
      editorProps: {
        attributes: {
          class: 'hidden',
        },
      },
      onCreate: ({ editor }) => {
        try {
          const nodes = parseMarkdownToProseMirror(content, editor);

          if (nodes.length > 0) {
            editor.commands.setContent({
              type: 'doc',
              content: nodes.map((node) => node.toJSON()),
            });
          } else {
            editor.commands.setContent(content);
          }

          const json = editor.getJSON();
          editor.destroy();
          resolve(json);
        } catch (error) {
          console.error('Error parsing markdown:', error);
          editor.commands.setContent(content);

          const json = editor.getJSON();
          editor.destroy();
          resolve(json);
        }
      },
    });
  });
}
