import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react/menus';
import { useEditorState } from '@tiptap/react';
import React, { useCallback, useRef, JSX, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { icons } from 'lucide-react';

import { ImageBlockWidth } from './ImageBlockWidth';

import { Toolbar } from '@/components/ui/Toolbar';
import { Icon } from '@/components/ui/Icon';
import { MenuProps } from '@/components/menus/types';

interface AlignButtonConfig {
  key: string;
  tooltip: string;
  icon: keyof typeof icons;
  align: 'left' | 'center' | 'right';
  activeKey: 'isImageLeft' | 'isImageCenter' | 'isImageRight';
}

export const ImageBlockMenu = ({ editor }: MenuProps): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('imageBlock');

    return isActive;
  }, [editor]);

  // 数据驱动的对齐按钮配置
  const alignButtons: AlignButtonConfig[] = useMemo(
    () => [
      {
        key: 'left',
        tooltip: 'Align image left',
        icon: 'AlignHorizontalDistributeStart',
        align: 'left',
        activeKey: 'isImageLeft',
      },
      {
        key: 'center',
        tooltip: 'Align image center',
        icon: 'AlignHorizontalDistributeCenter',
        align: 'center',
        activeKey: 'isImageCenter',
      },
      {
        key: 'right',
        tooltip: 'Align image right',
        icon: 'AlignHorizontalDistributeEnd',
        align: 'right',
        activeKey: 'isImageRight',
      },
    ],
    [],
  );

  const onAlignImage = useCallback(
    (align: 'left' | 'center' | 'right') => {
      editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign(align).run();
    },
    [editor],
  );

  const onWidthChange = useCallback(
    (value: number) => {
      editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockWidth(value).run();
    },
    [editor],
  );

  const onDownloadImage = useCallback(() => {
    const imageAttrs = editor.getAttributes('imageBlock');

    if (imageAttrs?.src) {
      const img = new Image();

      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');

              link.href = url;
              link.download = (imageAttrs.alt || 'image') + '.png';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        }
      };

      img.src = imageAttrs.src;
    }
  }, [editor]);
  const editorState = useEditorState({
    editor,
    selector: (ctx: { editor: typeof editor }) => {
      return {
        isImageLeft: ctx.editor.isActive('imageBlock', { align: 'left' }),
        isImageCenter: ctx.editor.isActive('imageBlock', { align: 'center' }),
        isImageRight: ctx.editor.isActive('imageBlock', { align: 'right' }),
        width: parseInt(ctx.editor.getAttributes('imageBlock')?.width || 0),
      };
    },
  });

  const { width } = editorState;

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      options={{
        placement: 'top',
        offset: 8,
        flip: false,
      }}
    >
      <Toolbar.Wrapper shouldShowContent={shouldShow()} ref={menuRef}>
        {alignButtons.map((button) => (
          <Toolbar.Button
            key={button.key}
            tooltip={button.tooltip}
            active={editorState[button.activeKey]}
            onClick={() => onAlignImage(button.align)}
          >
            <Icon name={button.icon} />
          </Toolbar.Button>
        ))}
        <Toolbar.Divider />
        <Toolbar.Button tooltip="Download image" onClick={onDownloadImage}>
          <Icon name="Download" />
        </Toolbar.Button>
        <Toolbar.Divider />
        <ImageBlockWidth onChange={onWidthChange} value={width} />
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default ImageBlockMenu;
