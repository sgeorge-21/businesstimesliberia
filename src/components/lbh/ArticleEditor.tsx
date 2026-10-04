import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import { Button } from "@/components/ui/button";

export default function ArticleEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Highlight, TextStyle, FontSize],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: "article-editor-content" } },
  });

  if (!editor) return null;
  return (
    <div className="article-editor">
      <div className="article-editor-toolbar" role="toolbar" aria-label="Article formatting">
        <Button type="button" variant={editor.isActive("bold") ? "secondary" : "ghost"} size="sm" title="Bold" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></Button>
        <Button type="button" variant={editor.isActive("italic") ? "secondary" : "ghost"} size="sm" title="Italic" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></Button>
        <Button type="button" variant={editor.isActive("highlight") ? "secondary" : "ghost"} size="sm" title="Highlight selection" aria-label="Highlight selection" onClick={() => editor.chain().focus().toggleHighlight().run()}>▣</Button>
        <select aria-label="Selected text size" title="Selected text size" value={editor.getAttributes("textStyle").fontSize || ""} onChange={(e) => e.target.value ? editor.chain().focus().setFontSize(e.target.value).run() : editor.chain().focus().unsetFontSize().run()}>
          <option value="">Normal size</option>
          <option value="14px">Small</option>
          <option value="18px">Large</option>
          <option value="22px">Extra large</option>
        </select>
        <Button type="button" variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"} size="sm" title="Heading" aria-label="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H</Button>
        <Button type="button" variant={editor.isActive("bulletList") ? "secondary" : "ghost"} size="sm" title="Bullet list" aria-label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()}>≡</Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}