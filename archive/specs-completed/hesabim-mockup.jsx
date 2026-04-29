import { useState } from 'react';
import {
  Sparkles, ArrowRight, AlertCircle, Check, Trophy, FileText,
  Image as ImageIcon, Video, Share2, Gift, Copy, ChevronRight,
  Zap, ShoppingBag, Receipt, Settings, Tag, BarChart3
} from 'lucide-react';

/**
 * /hesap (Hesabım) sayfası UX redesign mockup
 *
 * Çözülen ana sorunlar:
 *  1. Eski palet → anasayfa paleti
 *  2. 4 KPI eşit ağırlıkta → kalan kredi vurgulu, "Trendyol favori platform" gibi anlamsız bilgi kaldırıldı
 *  3. "Henüz denemediğin özellikler" — keşif fırsatı CTA'sı eklendi
 *  4. "0 davet ettiğin arkadaş" depresif boş kutu → ilk davete kadar yumuşak gösterim
 *  5. 6 menü kartı eşit görünüyordu → uyarılı kartlar ön planda (Marka eksik / Krediler az vs)
 *  6. "Bu ay 17 içerik = ₺5,100 tasarruf" — bu cümle KORUNDU, hatta vurgulu
 */

export default function HesabimMockup() {
  const productionThisMonth = 17;
  const savingsAmount = 5100;
  const remainingCredits = 99;
  const totalProductions = 18;

  const contentTypes = [
    { icon: FileText, label: 'Listing metni', count: 18, color: '#1E40AF' },
    { icon: ImageIcon, label: 'Stüdyo görseli', count: 0, color: '#7C3AED' },
    { icon: Video, label: 'Ürün videosu', count: 0, color: '#DC2626' },
    { icon: Share2, label: 'Sosyal medya', count: 0, color: '#059669' },
  ];

  const untriedTypes = contentTypes.filter((c) => c.count === 0);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: '"Manrope", "Inter", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      {/* Nav */}
      <nav style={{
        background: 'rgba(255,255,255,0.9)',
        borderBottom: '1px solid #F1F5F9',
        backdropFilter: 'blur(12px)',
        padding: '12px 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
          }}>
            yzliste
          </div>
          <nav style={{ display: 'flex', gap: '4px', flex: 1, marginLeft: '12px' }}>
            {['Ana Sayfa', 'Fiyatlar', 'Blog', 'Araçlar'].map((l) => (
              <a key={l} style={{ padding: '6px 12px', fontSize: '13px', color: '#475569', cursor: 'pointer', fontWeight: 500 }}>{l}</a>
            ))}
          </nav>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', background: '#EFF6FF', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600, color: '#1E40AF',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1E40AF' }} />
            99 kredi
          </div>
          <button style={{
            padding: '8px 14px', border: '1px solid #E2E8F0', borderRadius: '8px',
            background: '#FFFFFF', color: '#334155', fontSize: '13px', fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer',
          }}>
            Hesabım
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header + tasarruf rozeti */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{
              fontFamily: 'Manrope, sans-serif', fontSize: '32px', fontWeight: 800,
              color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.02em',
            }}>
              Hesabım
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
              azizkose@gmail.com
            </p>
          </div>
          <a style={{
            padding: '10px 18px',
            background: '#1E40AF',
            color: '#FFFFFF',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)',
            textDecoration: 'none',
          }}>
            <Zap size={14} strokeWidth={2.5} />
            Yeni içerik üret
          </a>
        </div>

        {/* TASARRUF ROZETİ — bu cümle korunuyor, vurgulu */}
        <div style={{
          background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 8px 24px rgba(30, 64, 175, 0.2)',
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Trophy size={24} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.9,
              marginBottom: '4px',
            }}>
              Bu ay yzliste sayesinde
            </div>
            <div style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '20px',
              fontWeight: 700,
              lineHeight: 1.3,
            }}>
              <strong>{productionThisMonth} içerik ürettin</strong> — freelancer'a verseydin tahminen <strong>₺{savingsAmount.toLocaleString('tr-TR')}</strong> öderdin
            </div>
          </div>
        </div>

        {/* 3 KPI — kalan kredi vurgulu, gereksiz olan ("Trendyol favori") kaldırıldı */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {/* Kalan kredi — vurgulu */}
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #1E40AF',
            borderRadius: '12px',
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#1E40AF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}>
              Kalan kredi
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '36px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
              }}>
                {remainingCredits}
              </span>
              <span style={{ fontSize: '14px', color: '#64748B' }}>
                kredi
              </span>
            </div>
            <a style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#1E40AF',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}>
              Kredi al <ArrowRight size={12} strokeWidth={2.5} />
            </a>
          </div>

          {/* Bu ay üretim */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '18px 20px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}>
              Bu ay üretim
            </div>
            <div style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '36px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
            }}>
              {productionThisMonth}
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>
              ↑ Geçen aydan +5
            </div>
          </div>

          {/* Toplam üretim */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '18px 20px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}>
              Toplam üretim
            </div>
            <div style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '36px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
            }}>
              {totalProductions}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
              hesap açıldığından beri
            </div>
          </div>
        </div>

        {/* Henüz denemediğin özellikler — keşif fırsatı (YENİ) */}
        {untriedTypes.length > 0 && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}>
              <div>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: '0 0 2px',
                }}>
                  Henüz denemediğin özellikler
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  Mevcut planınla {untriedTypes.length} farklı içerik türünü daha üretebilirsin
                </p>
              </div>
              <span style={{
                padding: '4px 10px',
                background: '#FEF3C7',
                color: '#92400E',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Keşfet
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${untriedTypes.length}, 1fr)`,
              gap: '8px',
            }}>
              {untriedTypes.map((t, i) => (
                <a
                  key={i}
                  style={{
                    padding: '14px 12px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    background: '#FAFBFC',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${t.color}15`,
                    color: t.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <t.icon size={16} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '1px' }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Hemen dene →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 6 menü kartı — uyarılar ön planda */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 12px',
          }}>
            Hesap ayarları
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {/* Marka — uyarılı (eksik durum) */}
            <a style={{
              background: '#FFFFFF',
              border: '1px solid #FED7AA',
              borderLeft: '4px solid #F97316',
              borderRadius: '10px',
              padding: '16px 18px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <ShoppingBag size={18} strokeWidth={2.2} style={{ color: '#F97316' }} />
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#9A3412',
                  background: '#FEF3C7',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Eksik
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '8px' }}>
                Marka profili
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                Doldur, AI çıktıları markanın sesiyle yazsın
              </div>
            </a>

            {/* Profil */}
            <a style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 18px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tag size={18} strokeWidth={2.2} style={{ color: '#475569' }} />
                <ChevronRight size={16} strokeWidth={2.2} style={{ color: '#CBD5E1' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '8px' }}>
                Profil
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                Kişisel ve fatura bilgileri
              </div>
            </a>

            {/* Üretimler */}
            <a style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 18px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BarChart3 size={18} strokeWidth={2.2} style={{ color: '#475569' }} />
                <ChevronRight size={16} strokeWidth={2.2} style={{ color: '#CBD5E1' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '8px' }}>
                Üretimler
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                Tüm üretim geçmişi
              </div>
            </a>

            {/* Krediler */}
            <a style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 18px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Sparkles size={18} strokeWidth={2.2} style={{ color: '#475569' }} />
                <ChevronRight size={16} strokeWidth={2.2} style={{ color: '#CBD5E1' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '8px' }}>
                Krediler
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                Kredi geçmişi ve satın alma
              </div>
            </a>

            {/* Faturalar */}
            <a style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 18px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Receipt size={18} strokeWidth={2.2} style={{ color: '#475569' }} />
                <ChevronRight size={16} strokeWidth={2.2} style={{ color: '#CBD5E1' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '8px' }}>
                Faturalar
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                e-Arşiv fatura indir
              </div>
            </a>

            {/* Ayarlar */}
            <a style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '16px 18px',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Settings size={18} strokeWidth={2.2} style={{ color: '#475569' }} />
                <ChevronRight size={16} strokeWidth={2.2} style={{ color: '#CBD5E1' }} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '8px' }}>
                Ayarlar
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                E-posta ve şifre
              </div>
            </a>
          </div>
        </div>

        {/* Davet — depresif boş kutular YOK, sade davet */}
        <div style={{
          background: 'linear-gradient(135deg, #FEF3C7, #FED7AA)',
          border: '1px solid #FDE68A',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Gift size={22} strokeWidth={2.2} style={{ color: '#92400E' }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#78350F', marginBottom: '2px' }}>
              Arkadaşını davet et, ikiniz de +10 kredi kazanın
            </div>
            <div style={{ fontSize: '13px', color: '#92400E' }}>
              Arkadaşın ilk satın almasını yapınca otomatik olarak hesabına eklenir
            </div>
          </div>
          <button style={{
            padding: '10px 16px',
            background: '#FFFFFF',
            color: '#92400E',
            border: '1px solid #FDE68A',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}>
            <Copy size={14} strokeWidth={2.5} />
            Davet linkini kopyala
          </button>
        </div>

        {/* Designer note */}
        <div style={{
          marginTop: '40px',
          padding: '20px 24px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          fontSize: '13px',
          color: '#475569',
          lineHeight: 1.6,
        }}>
          <strong style={{ color: '#0F172A' }}>🎨 Tasarımcı notları (Hesabım):</strong>
          <ol style={{ margin: '8px 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li><strong>Tasarruf rozeti vurgulu:</strong> "₺5,100 freelancer tasarrufu" cümlesi mavi gradient banner'da, sayfanın en güçlü mesajı</li>
            <li><strong>3 KPI (4 değil):</strong> "Trendyol favori platform" kaldırıldı (anlamsız bilgi). Kalan kredi 2px mavi border ile vurgulu, "Kredi al" CTA'sı altında</li>
            <li><strong>Henüz denemediğin özellikler:</strong> Yeni keşif bloku — kullanıcının kullanmadığı 3 özelliği "hemen dene" CTA'sıyla gösteriyor</li>
            <li><strong>Marka profili eksik uyarısı:</strong> 6 menü kartından Marka kartı turuncu border-left + "EKSİK" rozetiyle ön planda. Diğerleri sade</li>
            <li><strong>Davet kutusu:</strong> Eskiden "0 kayıt olan, 0 satın alan, 0 kazanılan kredi" depresif duruyordu. Şimdi sadece "davet linkini kopyala" CTA'lı motive edici banner</li>
            <li><strong>Renk paleti:</strong> Anasayfa standardına uyumlu (slate + #1E40AF)</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
