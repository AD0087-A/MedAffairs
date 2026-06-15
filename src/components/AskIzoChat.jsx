import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Paperclip, Image, Mic, Send, Eye, FileText, Calendar, ArrowRight } from 'lucide-react';

export default function AskIzoChat({ isOpen, onClose, onViewSlide, onViewTimeline }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg1',
      sender: 'izo',
      text: 'Dr. Sarah Chen, who is on your meeting schedule for tomorrow, last week co-authored a clinical paper on HER2-low biomarker treatment selection in JCO. Would you like to review the publication data?',
      actions: [
        { label: 'View Publication', type: 'navigate_library' }
      ]
    },
    {
      id: 'msg2',
      sender: 'izo',
      text: 'She is currently showing increased scientific activity around safety profiles, specifically focusing on Interstitial Lung Disease (ILD) management. Would you like to review the MLR-approved slide deck for Enhertu safety updates?',
      actions: [
        { label: 'Preview Safety Slide', type: 'preview_slide' }
      ]
    },
    {
      id: 'msg3',
      sender: 'izo',
      text: 'A pending MIR (Medical Information Request) for HER2-low safety data was submitted by John Anderson (Oncology) for Dr. Sarah Chen. Would you like to see the MIR?',
      actions: [
        { label: 'View Pending MIR', type: 'navigate_timeline' }
      ]
    },
    {
      id: 'msg4',
      sender: 'izo',
      text: 'A follow-up clinical discussion on ILD Standard Grading Protocol v4.2 has yet to be scheduled. There is calendar availability tomorrow at 4:00 PM. Would you like to suggest a slot?',
      actions: [
        { label: 'Suggest 4:00 PM Slot', type: 'schedule_slot' }
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    const typedText = inputValue.toLowerCase();
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let replyText = "I'm analyzing Dr. Sarah Chen's profile. You can check the 'Meeting Prep' tab for clinical comparison sheets, or look at the 'Library' tab to find her latest papers.";
      let replyActions = [];

      if (typedText.includes('slide') || typedText.includes('safety') || typedText.includes('enhertu')) {
        replyText = "Here is the MLR-approved Enhertu ILD safety update slide deck. You can preview the primary slide or add it to Dr. Chen's briefcase.";
        replyActions = [{ label: 'Preview Safety Slide', type: 'preview_slide' }];
      } else if (typedText.includes('paper') || typedText.includes('publication') || typedText.includes('library')) {
        replyText = "Dr. Sarah Chen has published 3 papers recently. The top one is 'Efficacy of Combined Immunotherapy in Advanced Melanoma' (Nature Medicine).";
        replyActions = [{ label: 'Go to Library', type: 'navigate_library' }];
      } else if (typedText.includes('mir') || typedText.includes('inquiry') || typedText.includes('timeline')) {
        replyText = "The pending MIR is regarding safety guidelines. You can view the timeline details to see the request history.";
        replyActions = [{ label: 'Go to Timeline', type: 'navigate_timeline' }];
      } else if (typedText.includes('schedule') || typedText.includes('meeting') || typedText.includes('calendar')) {
        replyText = "I have drafted a calendar request for tomorrow at 4:00 PM for the ILD roundtable proposal. Would you like me to send it?";
        replyActions = [{ label: 'Send Calendar Invite', type: 'schedule_slot' }];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'izo',
          text: replyText,
          actions: replyActions
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleActionClick = (action) => {
    if (action.type === 'preview_slide') {
      onViewSlide();
    } else if (action.type === 'navigate_library') {
      onViewTimeline('Library');
    } else if (action.type === 'navigate_timeline') {
      onViewTimeline('Timeline');
    } else if (action.type === 'schedule_slot') {
      alert("Mock Meeting Scheduled: A calendar slot for tomorrow at 4:00 PM has been drafted and sent to Dr. Chen's office.");
    }
  };

  return (
    <div className="izo-chat-overlay" onClick={onClose}>
      <div className="izo-chat-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="izo-chat-header">
          <div className="izo-chat-header-title">
            <div className="izo-logo">
              <Sparkles size={16} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h3>iZO Smart Assist</h3>
              <div className="active-listening-container">
                <span className="listening-label">Active Listening</span>
                <div className="audio-wave">
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="izo-close-btn" onClick={onClose} aria-label="Close Smart Assist">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="izo-chat-body">
          <div className="izo-welcome-context">
            <p><strong>KOL Context Synthesis:</strong> Actively monitoring schedule, local medical inquiries, and publication indexes for Dr. Sarah Chen.</p>
          </div>

          <div className="izo-messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`izo-msg-wrapper ${msg.sender === 'user' ? 'user' : 'izo'}`}>
                <div className="izo-msg-bubble">
                  <p>{msg.text}</p>
                  
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="izo-msg-actions">
                      {msg.actions.map((act, i) => (
                        <button 
                          key={i} 
                          className="izo-action-btn" 
                          onClick={() => handleActionClick(act)}
                        >
                          <span>{act.label}</span>
                          <ArrowRight size={12} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="izo-msg-wrapper izo">
                <div className="izo-msg-bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Footer / Input */}
        <form className="izo-chat-footer" onSubmit={handleSend}>
          <div className="izo-input-wrapper">
            <input 
              type="text" 
              placeholder="Ask a Question..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="izo-input-field"
            />
            <div className="izo-input-actions">
              <button type="button" className="izo-input-icon-btn" title="Add Image">
                <Image size={16} />
              </button>
              <button type="button" className="izo-input-icon-btn" title="Attach File">
                <Paperclip size={16} />
              </button>
              <button type="button" className="izo-input-icon-btn" title="Voice Input">
                <Mic size={16} />
              </button>
              <button type="submit" className="izo-send-btn" disabled={!inputValue.trim()} title="Send Message">
                <Send size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
