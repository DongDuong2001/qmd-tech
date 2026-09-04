"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  Code2,
  RotateCcw,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung bài viết công nghệ...",
}: RichTextEditorProps) {
  const [activeMode, setActiveMode] = useState<"visual" | "html" | "preview">("visual");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert markdown/HTML tags around selection in textarea
  const insertTag = (openTag: string, closeTag: string, defaultText: string = "Nội dung") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;

    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newValue =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selectedText.length
      );
    }, 50);
  };

  const handleInsertLink = () => {
    const url = prompt("Nhập đường dẫn liên kết (URL):", "https://");
    if (!url) return;
    const text = prompt("Nhập văn bản hiển thị cho liên kết:", "Xem chi tiết");
    insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#0063FD] font-bold underline">`, `</a>`, text || "liên kết");
  };

  const handleInsertImage = () => {
    const url = prompt("Nhập đường dẫn hình ảnh (Image URL):", "https://images.unsplash.com/");
    if (!url) return;
    const caption = prompt("Nhập chú thích ảnh (Caption / Alt text):", "Hình ảnh minh họa");
    const imgHtml = `\n<figure class="my-4 text-center">\n  <img src="${url}" alt="${caption || "Ảnh bài viết"}" class="rounded-xl mx-auto max-h-96 object-cover border border-[#E2E8F0] shadow-sm" />\n  <figcaption class="text-xs text-[#64748B] mt-1.5">${caption || ""}</figcaption>\n</figure>\n`;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newValue =
      textarea.value.substring(0, start) + imgHtml + textarea.value.substring(start);
    onChange(newValue);
  };

  return (
    <div className="rounded-xl border border-[#CBD5E1] bg-white overflow-hidden shadow-xs">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#CBD5E1] bg-[#F8FAFC] p-2">
        {/* Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertTag("<h2>", "</h2>", "Tiêu đề mục lớn")}
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-xs flex items-center gap-0.5"
            title="Tiêu đề H2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<h3>", "</h3>", "Tiêu đề mục nhỏ")}
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-xs flex items-center gap-0.5"
            title="Tiêu đề H3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <span className="h-4 w-px bg-[#CBD5E1] mx-1" />

          <button
            type="button"
            onClick={() => insertTag("<strong>", "</strong>", "văn bản in đậm")}
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A]"
            title="In đậm (Bold)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<em>", "</em>", "văn bản in nghiêng")}
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A]"
            title="In nghiêng (Italic)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<u>", "</u>", "văn bản gạch chân")}
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A]"
            title="Gạch chân (Underline)"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<s>", "</s>", "văn bản gạch ngang")}
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A]"
            title="Gạch ngang (Strikethrough)"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <span className="h-4 w-px bg-[#CBD5E1] mx-1" />

          <button
            type="button"
            onClick={() =>
              insertTag(
                '<ul class="list-disc pl-5 space-y-1 my-2">\n  <li>',
                "</li>\n  <li>Ý thứ hai</li>\n</ul>",
                "Ý thứ nhất"
              )
            }
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A]"
            title="Danh sách gạch đầu dòng"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertTag(
                '<ol class="list-decimal pl-5 space-y-1 my-2">\n  <li>',
                "</li>\n  <li>Bước hai</li>\n</ol>",
                "Bước một"
              )
            }
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A]"
            title="Danh sách đánh số"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertTag(
                '<blockquote class="border-l-4 border-[#0063FD] pl-4 py-1.5 my-3 italic text-[#475569] bg-[#EFF6FF]/60 rounded-r-lg">',
                "</blockquote>",
                "Trích dẫn kiến thức hoặc nhận xét chuyên gia..."
              )
            }
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A]"
            title="Khối trích dẫn (Blockquote)"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertTag(
                '<pre class="rounded-xl bg-[#0F172A] p-4 text-[#38BDF8] font-mono text-xs overflow-x-auto my-3"><code>',
                "</code></pre>",
                "// Cấu hình mã code hoặc thông số Benchmark..."
              )
            }
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0F172A]"
            title="Khối mã Code"
          >
            <Code className="h-4 w-4" />
          </button>

          <span className="h-4 w-px bg-[#CBD5E1] mx-1" />

          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#0063FD]"
            title="Chèn liên kết"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertImage}
            className="p-1.5 rounded hover:bg-[#E2E8F0] text-[#16A34A]"
            title="Chèn hình ảnh minh họa"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center rounded-lg border border-[#CBD5E1] bg-white p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMode("visual")}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              activeMode === "visual"
                ? "bg-[#0063FD] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Soạn Thảo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("html")}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              activeMode === "html"
                ? "bg-[#0063FD] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>HTML</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("preview")}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              activeMode === "preview"
                ? "bg-[#0063FD] text-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Xem Trước</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-3">
        {activeMode === "visual" || activeMode === "html" ? (
          <textarea
            ref={textareaRef}
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-lg border border-transparent p-2.5 text-xs focus:border-[#0063FD] focus:outline-none leading-relaxed ${
              activeMode === "html" ? "font-mono bg-[#0F172A] text-slate-100" : "bg-white text-[#0F172A]"
            }`}
          />
        ) : (
          <div className="min-h-[280px] max-h-[420px] overflow-y-auto rounded-lg border border-[#E2E8F0] bg-white p-5">
            {value ? (
              <div
                className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              <div className="text-center py-12 text-xs text-[#94A3B8]">
                Chưa có nội dung xem trước. Vui lòng chuyển sang tab Soạn Thảo để viết bài.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper Footer */}
      <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[10px] text-[#64748B]">
        <span>Hỗ trợ HTML5 tags, Tailwind CSS classes và responsive typography.</span>
        <button
          type="button"
          onClick={() => {
            if (confirm("Bạn có chắc muốn xóa toàn bộ nội dung trong trình soạn thảo?")) {
              onChange("");
            }
          }}
          className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Xóa trắng
        </button>
      </div>
    </div>
  );
}
