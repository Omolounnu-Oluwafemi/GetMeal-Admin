'use client';

import { useState, useEffect } from 'react';
import { X, Send, Megaphone, Users } from '@/lib/icons';

interface BroadcastModalProps {
  onClose: () => void;
}

type MessageType = 'promotional' | 'announcement' | 'alert';
type Audience = 'all' | 'active' | 'zone' | 'cooks';

const messageTypes: { type: MessageType; label: string; emoji: string; color: string; bgColor: string }[] = [
  { type: 'promotional', label: 'Promotional', emoji: '🎉', color: '#209d01', bgColor: '#F0FDF4' },
  { type: 'announcement', label: 'Announcement', emoji: '📢', color: '#3B82F6', bgColor: '#EFF6FF' },
  { type: 'alert', label: 'Alert', emoji: '⚠️', color: '#F59E0B', bgColor: '#FFFBEB' },
];

const zones = [
  { id: 'lekki', name: 'Lekki / Ajah', customers: 3500 },
  { id: 'ikoyi', name: 'Ikoyi / Victoria Island', customers: 2800 },
  { id: 'ikeja', name: 'Ikeja / Maryland', customers: 2200 },
  { id: 'yaba', name: 'Yaba / Surulere', customers: 1900 },
  { id: 'festac', name: 'Festac / Amuwo', customers: 1500 },
  { id: 'gbagada', name: 'Gbagada / Bariga', customers: 1200 },
];

const audienceOptions = [
  { value: 'all', label: 'All Customers', count: 15000 },
  { value: 'active', label: 'Active Customers', count: 8500 },
  { value: 'zone', label: 'Specific Zone', count: 0 },
  { value: 'cooks', label: 'Cooks', count: 500 },
];

const exampleMessages: Record<MessageType, { title: string; message: string }> = {
  promotional: {
    title: '🎉 50% Off Your Next Order!',
    message: 'Enjoy half price on all meals this weekend. Order now and save big! Limited time offer.',
  },
  announcement: {
    title: '📢 New Menu Items Available',
    message: 'We\'ve added exciting new dishes to our menu. Check out our latest offerings and try something new today!',
  },
  alert: {
    title: '⚠️ Service Update',
    message: 'We\'re experiencing high demand in your area. Delivery times may be slightly longer than usual. Thank you for your patience!',
  },
};

export default function BroadcastModal({ onClose }: BroadcastModalProps) {
  const [selectedType, setSelectedType] = useState<MessageType>('promotional');
  const [selectedAudience, setSelectedAudience] = useState<Audience>('all');
  const [selectedZone, setSelectedZone] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Auto-fill example message when type changes
  useEffect(() => {
    const example = exampleMessages[selectedType];
    setTitle(example.title);
    setMessage(example.message);
  }, [selectedType]);

  const getEstimatedReach = () => {
    if (selectedAudience === 'zone' && selectedZone) {
      const zone = zones.find(z => z.id === selectedZone);
      return zone ? zone.customers : 0;
    }
    const option = audienceOptions.find(o => o.value === selectedAudience);
    return option?.count || 0;
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    
    setSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSending(false);
    onClose();
  };

  const selectedTypeData = messageTypes.find(t => t.type === selectedType)!;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="shrink-0 p-6 border-b border-[#F3F4F6]">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-[#209d01]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#111827]">Send Broadcast Message</h2>
                <p className="text-sm text-[#6B7280] mt-0.5">Send push notifications to customers</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Message Type Selection */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Message Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {messageTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className={`
                    p-4 rounded-[12px] border-2 transition-all text-left
                    ${selectedType === type.type
                      ? `border-[${type.color}] bg-[${type.bgColor}]`
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
                    }
                  `}
                  style={{
                    borderColor: selectedType === type.type ? type.color : undefined,
                    backgroundColor: selectedType === type.type ? type.bgColor : undefined,
                  }}
                >
                  <div className="text-2xl mb-1">{type.emoji}</div>
                  <div className="text-sm font-medium text-[#111827]">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Target Audience
            </label>
            <select
              value={selectedAudience}
              onChange={(e) => {
                setSelectedAudience(e.target.value as Audience);
                if (e.target.value !== 'zone') setSelectedZone('');
              }}
              className="w-full px-4 pr-10 py-3 border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
            >
              {audienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Zone Selection (Conditional) */}
          {selectedAudience === 'zone' && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-3">
                Select Zone
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-4 pr-10 py-3 border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
              >
                <option value="">Choose a zone...</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Estimated Reach */}
          <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] rounded-[12px] border border-[#209d01]/20">
            <Users className="w-5 h-5 text-[#209d01]" />
            <div>
              <div className="text-xs text-[#6B7280]">Estimated Reach</div>
              <div className="text-lg font-semibold text-[#209d01]">
                ~{getEstimatedReach().toLocaleString()} {selectedAudience === 'cooks' ? 'cooks' : 'customers'}
              </div>
            </div>
          </div>

          {/* Notification Title */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title..."
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={5}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-[12px] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#209d01]/20 focus:border-[#209d01] transition-all resize-none"
            />
            <p className="text-xs text-[#6B7280] mt-2">Keep your message clear and concise</p>
          </div>

          {/* Live Preview */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-3">
              Preview
            </label>
            <div className="p-4 bg-[#F9FAFB] rounded-[12px] border border-[#E5E7EB]">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{selectedTypeData.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#111827] text-sm mb-1 line-clamp-1">
                      {title || 'Notification Title'}
                    </div>
                    <div className="text-xs text-[#6B7280] line-clamp-2">
                      {message || 'Your message will appear here...'}
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-2">now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F3F4F6] bg-white rounded-b-[20px]">
          <button
            onClick={onClose}
            disabled={sending}
            className="px-6 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!title.trim() || !message.trim() || sending || (selectedAudience === 'zone' && !selectedZone)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#209d01] text-white rounded-lg text-sm font-medium hover:bg-[#1a7d01] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Broadcast
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
