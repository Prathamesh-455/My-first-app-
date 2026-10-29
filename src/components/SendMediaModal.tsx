import React, { useState } from 'react';
import {
  X,
  FileText,
  Image as ImageIcon,
  Send,
  Upload,
  CheckCircle,
  Eye,
  Download,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { WeddingDocument, ChatAttachment, WeddingSettings } from '../types/wedding';
import { downloadWeddingInvitationPdf } from '../utils/weddingPdfGenerator';

interface SendMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: WeddingDocument[];
  recipientName: string;
  settings: WeddingSettings;
  onSendAttachment: (attachment: ChatAttachment, caption: string) => void;
  onUploadCustomDocument: (doc: WeddingDocument) => void;
}

export const SendMediaModal: React.FC<SendMediaModalProps> = ({
  isOpen,
  onClose,
  documents,
  recipientName,
  settings,
  onSendAttachment,
  onUploadCustomDocument,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || 'invitation-pdf');
  const [caption, setCaption] = useState<string>(
    `Namaste ${recipientName ? recipientName + ' ji' : ''}! 🙏✨\n\nPlease find attached our official wedding invitation card and 3-day celebrations itinerary for Aarav & Diya's wedding in Udaipur. Looking forward to welcoming you with royal hospitality! 🪔🌸`
  );

  if (!isOpen) return null;

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleSend = () => {
    if (!selectedDoc) return;

    const attachment: ChatAttachment = {
      id: selectedDoc.id,
      title: selectedDoc.title,
      fileName: selectedDoc.fileName,
      fileType: selectedDoc.fileType,
      fileSize: selectedDoc.fileSize,
      dataUrl: selectedDoc.dataUrl,
      pageCount: selectedDoc.pageCount,
      caption: caption.trim(),
    };

    onSendAttachment(attachment, caption.trim());
    onClose();
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImg = file.type.startsWith('image/');

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newDoc: WeddingDocument = {
        id: `custom-doc-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileType: isPdf ? 'pdf' : 'image',
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        description: `Uploaded document (${file.name})`,
        dataUrl,
        pageCount: isPdf ? 1 : undefined,
        isCustomUpload: true,
      };

      onUploadCustomDocument(newDoc);
      setSelectedDocId(newDoc.id);
    };

    if (isPdf) {
      reader.readAsDataURL(file);
    } else if (isImg) {
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedDoc.id === 'invitation-pdf') {
      downloadWeddingInvitationPdf(settings, recipientName, selectedDoc.fileName);
    } else if (selectedDoc.dataUrl) {
      const link = document.createElement('a');
      link.href = selectedDoc.dataUrl;
      link.download = selectedDoc.fileName;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Paperclip className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-emerald-100">
                Send Wedding Media & Invitation Document
              </h3>
              <p className="text-[11px] text-emerald-300">
                To: <span className="font-semibold text-white">{recipientName || 'Selected Guest'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-stone-700">
          <div>
            <label className="block font-bold text-stone-900 mb-1.5 flex items-center justify-between">
              <span>Choose Document / Invitation from Software Database:</span>
              <label className="cursor-pointer text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New File</span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>
            </label>

            {/* Document Cards Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {documents.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                const isPdf = doc.fileType === 'pdf';

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`p-1.5 rounded-lg flex items-center gap-1 font-bold text-[10px] ${
                            isPdf
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}
                        >
                          {isPdf ? (
                            <>
                              <FileText className="w-3 h-3 text-rose-700" />
                              <span>PDF DOC</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-3 h-3 text-indigo-700" />
                              <span>IMAGE</span>
                            </>
                          )}
                        </span>
                        <span className="text-[10px] text-stone-600 font-mono font-medium">{doc.fileSize}</span>
                      </div>

                      <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{doc.title}</h4>
                      <p className="text-stone-600 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-stone-600 truncate max-w-[140px] font-mono">
                        {doc.fileName}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected File Preview Box */}
          {selectedDoc && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    selectedDoc.fileType === 'pdf'
                      ? 'bg-rose-700 text-white'
                      : 'bg-indigo-700 text-white'
                  }`}
                >
                  {selectedDoc.fileType === 'pdf' ? (
                    <FileText className="w-6 h-6" />
                  ) : (
                    <ImageIcon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <span>{selectedDoc.fileName}</span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 rounded font-mono font-bold">
                      {selectedDoc.fileSize}
                    </span>
                  </div>
                  <p className="text-stone-600 text-[11px] mt-0.5">
                    {selectedDoc.fileType === 'pdf'
                      ? `Official 2-Page PDF Document with Wedding Program & Shloka`
                      : `Royal High-Res Digital Graphic Card`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadSelected}
                className="shrink-0 bg-white hover:bg-stone-50 border border-amber-300 text-stone-800 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-800" />
                <span>Download File</span>
              </button>
            </div>
          )}

          {/* Accompanying WhatsApp Message Caption */}
          <div>
            <label className="block font-bold text-stone-900 mb-1">
              WhatsApp Message Caption / Text:
            </label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add personal wedding message..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200/80 font-medium text-xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send File via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
