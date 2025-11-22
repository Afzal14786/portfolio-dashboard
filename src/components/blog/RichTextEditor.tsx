import React, { useState } from 'react';
import { Upload, Image, Code, Link, Bold, Italic, List, Quote } from 'lucide-react';
import { blogService } from '../../services/blogService';
import LoadingSpinner from '../ui/LoadingSpinner';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your blog content here...',
  height = 400
}) => {
  const [uploading, setUploading] = useState(false);

  // Custom image upload handler
  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          return;
        }

        setUploading(true);
        try {
          const formData = new FormData();
          formData.append('image', file);

          const response = await blogService.uploadImage(formData);
          const imageUrl = response.data.url;

          // Insert image markdown into editor
          const markdownImage = `![${file.name}](${imageUrl})`;
          const newValue = value ? `${value}\n${markdownImage}` : markdownImage;
          onChange(newValue);
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    };
  };

  const formatText = (format: string) => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        } else {
          return;
        }
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'list':
        formattedText = `- ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-300">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => formatText('bold')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded cursor-pointer transition-colors"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => formatText('italic')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded cursor-pointer transition-colors"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => formatText('code')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded cursor-pointer transition-colors"
            title="Code"
          >
            <Code size={16} />
          </button>
          <button
            type="button"
            onClick={() => formatText('link')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded cursor-pointer transition-colors"
            title="Link"
          >
            <Link size={16} />
          </button>
          <button
            type="button"
            onClick={() => formatText('quote')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded cursor-pointer transition-colors"
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <button
            type="button"
            onClick={() => formatText('list')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded cursor-pointer transition-colors"
            title="List"
          >
            <List size={16} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={uploading}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Insert Image"
          >
            {uploading ? <LoadingSpinner size="sm" /> : <Image size={14} />}
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Textarea Editor */}
      <div className="p-4">
        <textarea
          id="blog-content"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full resize-none border-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
          style={{ height: `${height}px`, minHeight: '200px' }}
        />
      </div>

      {/* Markdown Help */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-300 text-xs text-gray-600">
        <div className="flex flex-wrap gap-4">
          <span><strong>**Bold**</strong></span>
          <span><em>*Italic*</em></span>
          <span><code>`Code`</code></span>
          <span>[Link](url)</span>
          <span>&gt; Quote</span>
          <span>- List item</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;