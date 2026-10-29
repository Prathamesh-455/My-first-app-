import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Image as ImageIcon, Calendar, MapPin, Heart, Sparkles } from 'lucide-react';
import { ChatAttachment, WeddingSettings } from '../types/wedding';
import { downloadWeddingInvitationPdf, getWeddingInvitationPdfBlob } from '../utils/weddingPdfGenerator';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: ChatAttachment | null;
  settings: WeddingSettings;
  guestName?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  attachment,
  settings,
  guestName,
}) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && attachment && attachment.fileType === 'pdf') {
      try {
        const blob = getWeddingInvitationPdfBlob(settings, guestName);
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.warn('PDF blob generation error:', err);
      }
    }
  }, [isOpen, attachment, settings, guestName]);

  if (!isOpen || !attachment) return null;

  const handleDownload = () => {
    if (attachment.fileType === 'pdf') {
      downloadWeddingInvitationPdf(settings, guestName, attachment.fileName);
    } else if (attachment.dataUrl) {
      const link = document.createElement('a');
      link.href = attachment.dataUrl;
      link.download = attachment.fileName;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow ${
                attachment.fileType === 'pdf' ? 'bg-rose-700 text-white' : 'bg-indigo-700 text-white'
              }`}
            >
              {attachment.fileType === 'pdf' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-200 line-clamp-1">
                {attachment.title}
              </h3>
              <p className="text-[11px] text-rose-200/80 font-mono">
                {attachment.fileName} • {attachment.fileSize}
                {attachment.pageCount ? ` • ${attachment.pageCount} Pages` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="bg-amber-500 hover:bg-amber-400 text-rose-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-rose-200 hover:text-white hover:bg-rose-800/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 bg-stone-100 p-4 overflow-y-auto flex items-center justify-center min-h-[400px]">
          {attachment.fileType === 'pdf' ? (
            pdfBlobUrl ? (
              <iframe
                src={`${pdfBlobUrl}#toolbar=0&navpanes=0`}
                title="Wedding Invitation PDF Preview"
                className="w-full h-[580px] rounded-xl border border-stone-300 shadow-inner bg-white"
              />
            ) : (
              <div className="text-center p-8 bg-white rounded-2xl shadow max-w-md">
                <FileText className="w-12 h-12 text-rose-800 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-stone-900 text-base">{attachment.title}</h4>
                <p className="text-xs text-stone-600 mt-1 mb-4">
                  Official 2-Page Royal Wedding Invitation & Celebrations Itinerary PDF
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-rose-900 text-amber-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Document</span>
                </button>
              </div>
            )
          ) : (
            <div className="max-h-[580px] flex items-center justify-center overflow-auto p-2">
              <img
                src={attachment.dataUrl}
                alt={attachment.title}
                className="max-h-[540px] w-auto object-contain rounded-xl shadow-lg border border-stone-300"
              />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              Authentic Indian Wedding Digital Patrika for <strong>{settings.coupleNames}</strong>
            </span>
          </div>
          <span className="font-mono text-[11px] text-stone-600">
            Venue: {settings.venueName}, {settings.venueCity}
          </span>
        </div>
      </div>
    </div>
  );
};
