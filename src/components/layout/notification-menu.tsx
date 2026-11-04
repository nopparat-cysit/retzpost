'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/modules/i18n/i18n-context';

interface NotificationItem {
  id: string;
  type: 'SUCCESS' | 'WARNING' | 'INFO';
  titleTh: string;
  titleEn: string;
  descTh: string;
  descEn: string;
  timeTh: string;
  timeEn: string;
  read: boolean;
  linkHref?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'SUCCESS',
    titleTh: 'เผยแพร่โพสต์สำเร็จ',
    titleEn: 'Dispatch Published Successfully',
    descTh: 'โพสต์รูปภาพและแคปชันถูกส่งไปยัง Facebook และ Instagram แล้ว',
    descEn: 'Media dispatch delivered to Facebook Page and Instagram.',
    timeTh: '5 นาทีที่แล้ว',
    timeEn: '5m ago',
    read: false,
    linkHref: '/publishing/queue',
  },
  {
    id: 'notif_2',
    type: 'INFO',
    titleTh: 'ช่วงเวลายอดนิยมพร้อมใช้งาน',
    titleEn: 'Peak Slot Window Active',
    descTh: 'ช่วงเวลา 19:00 - 21:00 น. มีอัตราการมีส่วนร่วมสูงที่สุดสำหรับคอนเทนต์วันนี้',
    descEn: '19:00 - 21:00 window has highest audience engagement today.',
    timeTh: '1 ชั่วโมงที่แล้ว',
    timeEn: '1h ago',
    read: false,
    linkHref: '/calendar',
  },
  {
    id: 'notif_3',
    type: 'WARNING',
    titleTh: 'สำรองโทเคนคงเหลือ',
    titleEn: 'Token Balance Status',
    descTh: 'กระเป๋า Master Wallet ของคุณเหลือเหรียญพร้อมใช้งาน',
    descEn: 'Master Wallet balance is active and ready for auto-framing.',
    timeTh: 'วันนี้',
    timeEn: 'Today',
    read: true,
    linkHref: '/pricing',
  },
];

export const NotificationMenu: React.FC = () => {
  const { locale } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 rounded-editorial border border-border-rule bg-paper-raised hover:bg-paper-subtle text-ink-secondary hover:text-ink-primary flex items-center justify-center shadow-2xs transition-all cursor-pointer"
        title={locale === 'th' ? 'การแจ้งเตือน' : 'Notifications'}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-terracotta text-white text-[9px] font-mono font-bold flex items-center justify-center ring-2 ring-paper-raised animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-paper-card border border-border-rule rounded-dialog shadow-xl p-3 z-50 text-xs font-sans animate-in fade-in duration-100">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-rule/60">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold text-ink-secondary uppercase tracking-wider">
                {locale === 'th' ? 'การแจ้งเตือน' : 'Notifications'}
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-accent-terracotta/10 text-accent-terracotta font-mono text-[10px] font-bold">
                  {unreadCount} {locale === 'th' ? 'ใหม่' : 'new'}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-mono text-brand-indigo hover:underline font-semibold cursor-pointer"
              >
                {locale === 'th' ? 'อ่านทั้งหมดแล้ว' : 'Mark all read'}
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center py-6 text-ink-secondary text-xs">
                {locale === 'th' ? 'ไม่มีการแจ้งเตือนในขณะนี้' : 'No notifications'}
              </p>
            ) : (
              notifications.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => markOneRead(item.id)}
                    className={`p-2 rounded-editorial transition-colors ${
                      item.read
                        ? 'bg-paper-raised/60 text-ink-secondary'
                        : 'bg-paper-raised border-l-2 border-brand-indigo text-ink-primary font-medium'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {item.type === 'SUCCESS' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success shrink-0" />
                        )}
                        {item.type === 'WARNING' && (
                          <AlertCircle className="w-3.5 h-3.5 text-accent-terracotta shrink-0" />
                        )}
                        {item.type === 'INFO' && (
                          <Clock className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                        )}
                        <span className="font-bold text-xs">
                          {locale === 'th' ? item.titleTh : item.titleEn}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-ink-secondary shrink-0">
                        {locale === 'th' ? item.timeTh : item.timeEn}
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-secondary mt-1 leading-snug pl-5">
                      {locale === 'th' ? item.descTh : item.descEn}
                    </p>

                    {item.linkHref && (
                      <div className="mt-1.5 pl-5">
                        <Link
                          href={item.linkHref}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-indigo hover:underline font-semibold"
                        >
                          <span>{locale === 'th' ? 'ดูรายละเอียด' : 'View Details'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
