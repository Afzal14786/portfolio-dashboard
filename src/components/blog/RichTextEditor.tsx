import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlock from '@tiptap/extension-code-block';
import { 
  Image as ImageIcon, 
  Code, 
  Link as LinkIcon, 
  Bold, 
  Italic, 
  List, 
  Heading2, 
  Heading3,
} from 'lucide-react';
import { blogService } from '../../services/blogService';
import LoadingSpinner from '../ui/LoadingSpinner';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

// Strictly type the backend response
interface UploadResponse {
  data: {
    success?: boolean;
    data?: {
      url: string;
    };
    url?: string;
  };
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Start writing your amazing story...',
  height = 500
}: RichTextEditorProps) => {
  const [uploading, setUploading] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        codeBlock: false, // Handled by standalone extension for better control
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'rounded-lg bg-gray-900 text-gray-100 p-4 font-mono text-sm my-4',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl shadow-lg max-w-full h-auto my-8 mx-auto block border border-gray-100',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline font-medium cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none w-full min-h-[${height}px] px-4 sm:px-8 py-6`,
      },
    },
    onUpdate: ({ editor: currentEditor }: { editor: Editor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append('image', file);
          
          // Using the interface instead of any
          const response = await blogService.uploadImage(formData) as unknown as UploadResponse;
          const imageUrl = response.data?.data?.url || response.data?.url;

          if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
          }
        } catch (error: unknown) {
          console.error('Upload failed:', error);
        } finally {
          setUploading(false);
        }
      }
    };
  };

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col transition-all focus-within:ring-4 focus-within:ring-blue-500/10">
      {/* Responsive Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            isActive={editor.isActive('heading', { level: 2 })}
            icon={<Heading2 size={18} />} title="Heading 2" 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
            isActive={editor.isActive('heading', { level: 3 })}
            icon={<Heading3 size={18} />} title="Heading 3" 
          />
        </div>

        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            isActive={editor.isActive('bold')}
            icon={<Bold size={18} />} title="Bold" 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            isActive={editor.isActive('italic')}
            icon={<Italic size={18} />} title="Italic" 
          />
          <ToolbarButton 
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }} 
            isActive={editor.isActive('link')}
            icon={<LinkIcon size={18} />} title="Link" 
          />
        </div>

        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            isActive={editor.isActive('bulletList')}
            icon={<List size={18} />} title="Bullet List" 
          />
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
            isActive={editor.isActive('codeBlock')}
            icon={<Code size={18} />} title="Code Block" 
          />
        </div>

        <button 
          type="button" 
          onClick={handleImageUpload} 
          disabled={uploading} 
          className="ml-auto flex items-center space-x-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-50"
        >
          {uploading ? <LoadingSpinner size="sm" /> : <ImageIcon size={16} />}
          <span className="hidden sm:inline">Image</span>
        </button>
      </div>

      <div className="bg-white overflow-y-auto" style={{ minHeight: `${height}px` }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  title: string;
}

const ToolbarButton = ({ onClick, isActive, icon, title }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-all ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {icon}
  </button>
);

export default RichTextEditor;