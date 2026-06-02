/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Check, ShieldCheck, Mail, ArrowLeft, Phone, BadgeHelp, CheckCheck } from 'lucide-react';
import { ChatSession, ChatMessage } from '../types';

interface MessagesViewProps {
  sessions: ChatSession[];
  onSendMessage: (sessionId: string, text: string) => void;
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
}

export default function MessagesView({ sessions, onSendMessage, activeSessionId, onSelectSession }: MessagesViewProps) {
  const [inputText, setInputText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    // Scroll to bottom of message logs
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession) return;

    onSendMessage(activeSession.id, inputText.trim());
    setInputText('');
  };

  const roleLabels: Record<string, string> = {
    donor: 'Donateur',
    beneficiary: 'Bénéficiaire',
    association: 'Association Humanitaire',
    volunteer: 'Bénévole',
  };

  return (
    <div className="flex h-[calc(100vh-130px)] bg-slate-50 relative select-none">
      
      {/* Sidebar - list of list sessions */}
      <div className={`w-full md:w-80 bg-white border-r border-slate-200 flex flex-col ${activeSessionId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Messagerie</h2>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-full uppercase">
            {sessions.filter(s => s.unread).length} non lus
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-hide">
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2 mt-12">
              <Mail className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">Aucune conversation</p>
              <p className="text-xs text-slate-400">Demandez des objets ou recevez des offres pour lancer des discussions.</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = activeSessionId === session.id;
              const hasUnread = session.unread;
              
              return (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left hover:bg-slate-50 transition-all cursor-pointer ${
                    isActive ? 'bg-slate-55 border-l-4 border-primary' : ''
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold font-display text-sm shadow-xs">
                      {session.contactName[0].toUpperCase()}
                    </div>
                    {hasUnread && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>

                  {/* Body elements */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase block">
                        {roleLabels[session.contactRole] || session.contactRole}
                      </span>
                    </div>

                    <h4 className={`text-sm font-semibold text-slate-950 truncate ${hasUnread ? 'font-bold text-slate-950' : 'text-slate-800'}`}>
                      {session.contactName}
                    </h4>

                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 truncate px-1.5 py-0.5 rounded-sm block max-w-max mt-1">
                      Objet : {session.itemTitle}
                    </span>

                    <p className={`text-xs text-slate-500 truncate mt-1.5 font-light ${hasUnread ? 'font-medium text-slate-900' : ''}`}>
                      {session.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat log viewport */}
      <div className={`flex-1 flex flex-col bg-white ${activeSessionId ? 'flex' : 'hidden md:flex'}`}>
        
        {activeSession ? (
          <>
            {/* Header segment of active panel */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-xs sticky top-0 shrink-0">
              
              {/* Back button on mobile */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onSelectSession('')}
                  className="p-1 hover:bg-slate-100 rounded-full md:hidden text-slate-700 cursor-pointer focus:outline-hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-semibold text-slate-900 text-sm sm:text-base leading-none">{activeSession.contactName}</h3>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-400 inline-flex items-center gap-1 mt-0.5">
                    <span>{roleLabels[activeSession.contactRole] || activeSession.contactRole}</span>
                    <span>•</span>
                    <span className="font-semibold text-primary">{activeSession.itemTitle}</span>
                  </p>
                </div>
              </div>

              {/* Verified badge or secondary headers */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-secondary bg-emerald-50 px-2 py-1 rounded-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> Charte Respectée
                </span>
              </div>
            </div>

            {/* Conversation log list */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {activeSession.messages.map((msg) => {
                const isMyMessage = msg.isMine;
                return (
                  <div 
                    key={msg.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-150`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm line-height-relaxed font-light ${
                      isMyMessage 
                        ? 'bg-primary text-white rounded-br-none shadow-xs' 
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
                    }`}>
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                      
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isMyMessage ? 'text-white/70' : 'text-slate-400'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {isMyMessage && <CheckCheck className="w-3 h-3 shrink-0 text-white/90" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Form bar trigger sending messages */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Écrire votre message d'entraide solidaire..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-sm outline-hidden text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-12 h-12 bg-primary hover:bg-primary-container text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed group shrink-0 focus:outline-hidden"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Empty placeholder if no active conversations */
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
            <Mail className="w-16 h-16 text-slate-300" />
            <p className="font-semibold text-slate-700">Sélectionnez une discussion</p>
            <p className="text-xs text-slate-400 max-w-sm">Choisissez une conversation dans le menu de gauche pour afficher l'historique et fixer un rendez-vous solidaire.</p>
          </div>
        )}

      </div>
    </div>
  );
}
