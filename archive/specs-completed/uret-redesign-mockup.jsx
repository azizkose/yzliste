import { useState } from 'react';
import {
  FileText, Image, Video, Share2, Camera, Pencil, Barcode, FileSpreadsheet,
  Zap, Info, Check, X, ChevronDown, ChevronRight, Sparkles, AlertCircle,
  Plug, Tag, Target, Palette
} from 'lucide-react';

/**
 * /uret sayfası UX redesign mockup
 *
 * 5 ana iyileştirme:
 *  1. Niyet hatırlatıcı (intent banner) — sayfa başında "ne üretmek istiyorsun?" çıpası
 *  2. Toplam kredi maliyeti canlı — seçimler yapıldıkça toplam güncelleniyor
 *  3. Marka profili interaktif demo — sarı banner yerine tıklanabilir önizleme
 *  4. Disabled buton tooltip — niye disabled olduğu görünür
 *  5. Şeffaf kredi etiketleri — "∞ kredi" yerine "Ürün adı yaz" gibi gerçek mesajlar
 *
 * Renk paleti: anasayfa redesign'ı ile uyumlu (slate scale + #1E40AF mavi)
 */

export default function UretRedesignMockup() {
  const [activeTab, setActiveTab] = useState('metin');
  const [activeSubTab, setActiveSubTab] = useState('manuel');
  const [productName, setProductName] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showBrandDemo, setShowBrandDemo] = useState(false);
  const [activeTone, setActiveTone] = useState(null); // null | 'samimi' | 'profesyonel' | 'premium'
  const [selectedStyles, setSelectedStyles] = useState([]); // görsel sekmesi
  const [videoLength, setVideoLength] = useState(5); // 5 | 10
  const [socialPlatforms, setSocialPlatforms] = useState(['instagram']);
  const [hoveredCTA, setHoveredCTA] = useState(false);

  // Toplam kredi hesabı (canlı)
  const calculateCredits = () => {
    if (activeTab === 'metin') return 1;
    if (activeTab === 'gorsel') return selectedStyles.length;
    if (activeTab === 'video') return videoLength === 5 ? 10 : 20;
    if (activeTab === 'sosyal') return socialPlatforms.length * 1;
    return 0;
  };

  // CTA disabled durumu ve sebebi
  const getCTAState = () => {
    if (activeTab === 'metin') {
      if (!productName.trim()) return { disabled: true, reason: 'Önce ürün adını yaz' };
      return { disabled: false, reason: null };
    }
    if (activeTab === 'gorsel') {
      if (!hasPhoto) return { disabled: true, reason: 'Önce ürün fotoğrafı ekle' };
      if (selectedStyles.length === 0) return { disabled: true, reason: 'En az bir stil seç' };
      return { disabled: false, reason: null };
    }
    if (activeTab === 'video') {
      if (!hasPhoto) return { disabled: true, reason: 'Önce ürün fotoğrafı ekle' };
      return { disabled: false, reason: null };
    }
    if (activeTab === 'sosyal') {
      if (!productName.trim()) return { disabled: true, reason: 'Önce ürün adını yaz' };
      if (socialPlatforms.length === 0) return { disabled: true, reason: 'En az bir platform seç' };
      return { disabled: false, reason: null };
    }
    return { disabled: true, reason: 'Form eksik' };
  };

  const ctaState = getCTAState();
  const credits = calculateCredits();

  const toneOutputs = {
    samimi: 'Mutfağına şıklık katacak fincan setimizle tanış 💛 Misafirlerin görür görmez "nereden aldın?" diyecek.',
    profesyonel: 'Birinci kalite porselenden üretilen fincan setimiz, günlük kullanım ve özel anlar için tasarlandı.',
    premium: 'El işçiliğinin zarafetini sofranıza taşıyan porselen fincan koleksiyonumuz.',
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: '"Manrope", "Inter", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: 'rgba(255,255,255,0.9)',
        borderBottom: '1px solid #F1F5F9',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '12px 24px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
          }}>
            yzliste
          </div>
          <nav style={{ display: 'flex', gap: '4px', flex: 1, marginLeft: '12px' }}>
            {['Ana Sayfa', 'Fiyatlar', 'Blog', 'Araçlar'].map((l) => (
              <a key={l} style={{ padding: '6px 12px', fontSize: '13px', color: '#475569', cursor: 'pointer', fontWeight: 500 }}>{l}</a>
            ))}
          </nav>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: '#EFF6FF',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1E40AF',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1E40AF' }} />
            99 kredi
          </div>
          <button style={{
            padding: '8px 14px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            background: '#FFFFFF',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Hesabım
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        {/* ✨ İYİLEŞTİRME #1: NIYET HATIRLATICI */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px',
          }}>
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1E40AF',
            }}>
              ADIM 1 / 3 — NE ÜRETMEK İSTİYORSUN?
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
          }}>
            İçerik türünü seç
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Her tür için ayrı bir form var. Aynı ürün için birkaçını üst üste de üretebilirsin.
          </p>
        </div>

        {/* CONTENT TYPE TABS */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '4px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2px',
          marginBottom: '16px',
        }}>
          {[
            { id: 'metin', icon: FileText, label: 'Metin', sub: 'Listing', color: '#1E40AF' },
            { id: 'gorsel', icon: Image, label: 'Görsel', sub: 'Stüdyo', color: '#7C3AED' },
            { id: 'sosyal', icon: Share2, label: 'Sosyal medya', sub: 'Caption', color: '#059669' },
            { id: 'video', icon: Video, label: 'Video', sub: 'Reels/TikTok', color: '#DC2626' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 8px',
                  border: 'none',
                  background: isActive ? `${tab.color}10` : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                <tab.icon size={18} strokeWidth={2.2} style={{ color: isActive ? tab.color : '#94A3B8' }} />
                <div style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? tab.color : '#475569',
                }}>
                  {tab.label}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
                  {tab.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* ✨ İYİLEŞTİRME #3: MARKA PROFİLİ — interaktif demo (banner değil!) */}
        <div style={{
          background: '#FFFFFF',
          border: `1px solid ${activeTone ? '#86EFAC' : '#FED7AA'}`,
          borderLeft: `4px solid ${activeTone ? '#10B981' : '#F97316'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: showBrandDemo ? '16px' : 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={18} strokeWidth={2.2} style={{ color: activeTone ? '#10B981' : '#F97316' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                  {activeTone
                    ? `Marka tonu: ${activeTone.charAt(0).toUpperCase() + activeTone.slice(1)} ✓`
                    : 'Marka profili eksik'}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  {activeTone
                    ? 'AI çıktıları markanın tonuyla üretiliyor.'
                    : 'Tonsuz çıktı genel olur. Markan için tonu seç → çıktı kişisel olsun.'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowBrandDemo(!showBrandDemo)}
              style={{
                padding: '8px 14px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1E40AF',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {showBrandDemo ? 'Gizle' : 'Önce dene'}
              <ChevronDown size={14} strokeWidth={2.5} style={{
                transform: showBrandDemo ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }} />
            </button>
          </div>

          {showBrandDemo && (
            <div className="fade-in" style={{
              borderTop: '1px solid #F1F5F9',
              paddingTop: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: '16px',
            }}>
              <div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                }}>
                  Tonu seç:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { id: 'samimi', label: 'Samimi', emoji: '💛' },
                    { id: 'profesyonel', label: 'Profesyonel', emoji: '💼' },
                    { id: 'premium', label: 'Premium', emoji: '✨' },
                  ].map((tone) => {
                    const isActive = activeTone === tone.id;
                    return (
                      <button
                        key={tone.id}
                        onClick={() => setActiveTone(tone.id)}
                        style={{
                          padding: '10px 14px',
                          border: isActive ? '1.5px solid #1E40AF' : '1px solid #E2E8F0',
                          background: isActive ? '#EFF6FF' : '#FFFFFF',
                          color: isActive ? '#1E40AF' : '#475569',
                          fontWeight: isActive ? 600 : 500,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          textAlign: 'left',
                        }}
                      >
                        <span>{tone.emoji}</span>
                        {tone.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '14px',
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#1E40AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <Sparkles size={12} strokeWidth={2.5} />
                  AI Önizleme
                </div>
                {activeTone ? (
                  <div key={activeTone} className="fade-in" style={{ fontSize: '13px', lineHeight: 1.6, color: '#0F172A' }}>
                    {toneOutputs[activeTone]}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>
                    Bir ton seç, fark anında görünsün.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ÜST GİRDİLER (platform + fotoğraf) */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', minWidth: '64px' }}>Platform</label>
            <select style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              color: '#0F172A',
            }}>
              <option>Trendyol</option>
              <option>Hepsiburada</option>
              <option>Amazon TR</option>
              <option>N11</option>
              <option>Etsy</option>
              <option>Amazon USA</option>
            </select>
          </div>
          <div style={{
            background: '#F8FAFC',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '12px',
            color: '#64748B',
            fontFamily: 'Inter, sans-serif',
          }}>
            <span>Başlık 100 karakter</span>
            <span style={{ color: '#CBD5E1' }}>·</span>
            <span>5 özellik maddesi</span>
            <span style={{ color: '#CBD5E1' }}>·</span>
            <span>10 arama etiketi</span>
            <span style={{ color: '#CBD5E1' }}>·</span>
            <span>Türkçe çıktı</span>
          </div>
        </div>

        {/* FOTOĞRAF YÜKLEME */}
        <div style={{
          background: '#FFFFFF',
          border: hasPhoto ? '1px solid #86EFAC' : '1.5px dashed #CBD5E1',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
          onClick={() => setHasPhoto(!hasPhoto)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: hasPhoto ? '#DCFCE7' : '#F1F5F9',
              color: hasPhoto ? '#10B981' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {hasPhoto ? <Check size={22} strokeWidth={2.5} /> : <Image size={22} strokeWidth={2.2} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>
                {hasPhoto ? 'fincan_01.jpg yüklendi' : 'Ürün fotoğrafı yükle'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                {hasPhoto ? 'Tıkla ve değiştir' : 'Tüm içerik türlerinde kullanılır · JPG, PNG · Maks 10 MB'}
              </div>
            </div>
            <div style={{
              padding: '6px 14px',
              background: hasPhoto ? '#FFFFFF' : '#1E40AF',
              border: hasPhoto ? '1px solid #E2E8F0' : 'none',
              color: hasPhoto ? '#475569' : '#FFFFFF',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              {hasPhoto ? 'Değiştir' : 'Seç'}
            </div>
          </div>
        </div>

        {/* CONTENT-TYPE FORMS */}
        {activeTab === 'metin' && (
          <MetinForm
            productName={productName}
            setProductName={setProductName}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
          />
        )}
        {activeTab === 'gorsel' && (
          <GorselForm
            hasPhoto={hasPhoto}
            selectedStyles={selectedStyles}
            setSelectedStyles={setSelectedStyles}
          />
        )}
        {activeTab === 'video' && (
          <VideoForm
            hasPhoto={hasPhoto}
            videoLength={videoLength}
            setVideoLength={setVideoLength}
          />
        )}
        {activeTab === 'sosyal' && (
          <SosyalForm
            productName={productName}
            setProductName={setProductName}
            socialPlatforms={socialPlatforms}
            setSocialPlatforms={setSocialPlatforms}
          />
        )}

        {/* ✨ İYİLEŞTİRME #2 + #4 + #5: SUBMIT BAR — canlı kredi + tooltip + şeffaf etiket */}
        <div style={{
          position: 'sticky',
          bottom: '20px',
          marginTop: '24px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Cost summary */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}>
              Bu üretimin maliyeti
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '28px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
              }}>
                {credits}
              </span>
              <span style={{ fontSize: '14px', color: '#64748B' }}>
                kredi
              </span>
              <span style={{ color: '#CBD5E1', margin: '0 4px' }}>·</span>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Hesabında <strong style={{ color: '#0F172A' }}>99</strong> kredi var, üretim sonrası{' '}
                <strong style={{ color: '#0F172A' }}>{99 - credits}</strong> kalır
              </span>
            </div>
          </div>

          {/* Submit button + reason tooltip */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setHoveredCTA(true)}
            onMouseLeave={() => setHoveredCTA(false)}
          >
            <button
              disabled={ctaState.disabled}
              style={{
                padding: '14px 28px',
                background: ctaState.disabled ? '#CBD5E1' : '#1E40AF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: ctaState.disabled ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: ctaState.disabled ? 'none' : '0 4px 12px rgba(30, 64, 175, 0.25)',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {ctaState.disabled ? (
                <><AlertCircle size={16} strokeWidth={2.5} /> İçerik üret</>
              ) : (
                <><Zap size={16} strokeWidth={2.5} /> İçerik üret</>
              )}
            </button>

            {/* Disabled reason tooltip */}
            {ctaState.disabled && hoveredCTA && (
              <div className="fade-in" style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                right: 0,
                background: '#0F172A',
                color: '#FFFFFF',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                pointerEvents: 'none',
              }}>
                {ctaState.reason}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: '32px',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #0F172A',
                }} />
              </div>
            )}
          </div>
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
          <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            🎨 Tasarımcı notları (5 UX iyileştirmesi)
          </div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><strong>Niyet hatırlatıcı:</strong> Sayfa başında "ADIM 1/3 — NE ÜRETMEK İSTİYORSUN?" çıpası. Kullanıcı anasayfadan geliş niyetini hatırlıyor.</li>
            <li><strong>Canlı kredi maliyeti:</strong> Sticky alt bar. Seçimler değiştikçe maliyet ve "kalan kredi" anlık güncelleniyor.</li>
            <li><strong>Marka profili interaktif:</strong> Sarı banner yerine tıklanabilir önizleme. "Önce dene" → tonu seç → AI çıktısı canlı değişir. Anasayfada vaat ettiğimiz özellik burada da çalışır.</li>
            <li><strong>Disabled buton tooltip:</strong> Buton disabled ise üzerine gelince "Önce ürün adını yaz" gibi nedeni gösterir.</li>
            <li><strong>Şeffaf kredi etiketleri:</strong> "∞ kredi" / "0 kredi" gibi anlaşılmaz ifadeler kalktı. Bunun yerine "Önce ürün adını yaz" gibi gerçek mesajlar ve kalan kredi.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

// ===========================================
// SUB-FORMS — her sekme için ayrı form bloğu
// ===========================================

function MetinForm({ productName, setProductName, activeSubTab, setActiveSubTab }) {
  const subTabs = [
    { id: 'manuel', icon: Pencil, label: 'Manuel' },
    { id: 'fotograf', icon: Camera, label: 'Fotoğraftan oku' },
    { id: 'barkod', icon: Barcode, label: 'Barkod' },
    { id: 'excel', icon: FileSpreadsheet, label: 'Toplu (Excel)' },
  ];

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Listing metni
        </h3>
        <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>
          1 kredi
        </span>
      </div>

      {/* Sub-tabs — ana sekmeyle karışmasın diye küçük segmented control */}
      <div style={{
        display: 'inline-flex',
        background: '#F1F5F9',
        borderRadius: '8px',
        padding: '3px',
        marginBottom: '16px',
        gap: '2px',
      }}>
        {subTabs.map((st) => {
          const isActive = activeSubTab === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveSubTab(st.id)}
              style={{
                padding: '6px 12px',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#0F172A' : '#64748B',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: isActive ? '0 1px 3px rgba(15,23,42,0.1)' : 'none',
              }}
            >
              <st.icon size={12} strokeWidth={2.2} />
              {st.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Ürün adı <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="örn: Selin Porselen 6'lı Kahve Fincanı Set"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Kategori
          </label>
          <select style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}>
            <option>— Seç (isteğe bağlı) —</option>
            <option>Ev & Yaşam</option>
            <option>Mutfak</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
            Ürün detayları <span style={{ color: '#94A3B8', fontWeight: 400 }}>(isteğe bağlı)</span>
          </label>
          <textarea
            placeholder="Renk, beden, malzeme, öne çıkan özellikler — ne kadar detay girersen içerik o kadar iyi olur"
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function GorselForm({ hasPhoto, selectedStyles, setSelectedStyles }) {
  const styles = [
    { id: 'zemin-beyaz', name: 'Beyaz Zemin', sub: 'Trendyol standart', color: '#F1F5F9' },
    { id: 'zemin-koyu', name: 'Koyu Zemin', sub: 'Premium / elektronik', color: '#1F2937' },
    { id: 'lifestyle', name: 'Lifestyle', sub: 'Gerçek ortam', color: '#FEF3E2' },
    { id: 'mermer', name: 'Mermer', sub: 'Lüks / kozmetik', color: '#F5F5F4' },
    { id: 'ahsap', name: 'Ahşap', sub: 'El yapımı / organik', color: '#D6BC9A' },
    { id: 'gradient', name: 'Gradient', sub: 'Modern / teknoloji', color: 'linear-gradient(135deg,#A78BFA,#F472B6)' },
    { id: 'dogal', name: 'Doğa', sub: 'Açık hava / taze', color: '#86EFAC' },
  ];

  const toggle = (id) => {
    if (selectedStyles.includes(id)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== id));
    } else {
      setSelectedStyles([...selectedStyles, id]);
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Stüdyo görseli
        </h3>
        <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>
          1 stil = 1 görsel = 1 kredi
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
        Tek fotoğraftan 7 farklı stüdyo stili. İstediğin kadar seç — sadece seçtiklerin için kredi düşer.
      </p>

      {!hasPhoto && (
        <div style={{
          background: '#FEF3E2',
          border: '1px solid #FED7AA',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#9A3412',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <AlertCircle size={14} strokeWidth={2.5} />
          Görsel üretmek için yukarıda ürün fotoğrafı yüklemen gerekiyor.
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
      }}>
        {styles.map((style) => {
          const isSelected = selectedStyles.includes(style.id);
          return (
            <button
              key={style.id}
              onClick={() => toggle(style.id)}
              disabled={!hasPhoto}
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: isSelected ? '2px solid #1E40AF' : '1px solid #E2E8F0',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: hasPhoto ? 'pointer' : 'not-allowed',
                opacity: hasPhoto ? 1 : 0.5,
                background: '#FFFFFF',
                position: 'relative',
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#1E40AF',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
              <div style={{
                aspectRatio: '1',
                background: style.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}>
                ☕
              </div>
              <div style={{ padding: '8px 10px', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>{style.name}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{style.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedStyles.length > 0 && (
        <div className="fade-in" style={{
          marginTop: '14px',
          padding: '10px 14px',
          background: '#EFF6FF',
          border: '1px solid #DBEAFE',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#1E3A8A',
        }}>
          ✓ <strong>{selectedStyles.length}</strong> stil seçtin — <strong>{selectedStyles.length}</strong> görsel üretilecek
        </div>
      )}
    </div>
  );
}

function VideoForm({ hasPhoto, videoLength, setVideoLength }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Ürün videosu
        </h3>
        <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>
          5sn: 10 kr · 10sn: 20 kr
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
        Ürün fotoğrafından kısa tanıtım videosu — pazaryerleri, Reels, TikTok ve YouTube için.
      </p>

      <div style={{
        background: '#FEF3E2',
        border: '1px solid #FED7AA',
        borderRadius: '8px',
        padding: '10px 14px',
        marginBottom: '16px',
        fontSize: '13px',
        color: '#9A3412',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
      }}>
        <Info size={14} strokeWidth={2.5} style={{ marginTop: 1, flexShrink: 0 }} />
        <div>
          <strong>Video üretiminde kredi anında düşer.</strong> AI işlem ~2 dakika sürer.
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Video formatı
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{
            padding: '10px 12px',
            border: '2px solid #1E40AF',
            background: '#EFF6FF',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E40AF' }}>Dikey (9:16)</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Reels · TikTok</div>
          </div>
          <div style={{
            padding: '10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Yatay (16:9)</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>YouTube · Pazaryeri</div>
          </div>
        </div>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Video süresi
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { sec: 5, credits: 10, sub: 'Hızlı tanıtım · Reels ideal' },
            { sec: 10, credits: 20, sub: 'Detaylı showcase · Pazaryeri' },
          ].map((opt) => {
            const isActive = videoLength === opt.sec;
            return (
              <button
                key={opt.sec}
                onClick={() => setVideoLength(opt.sec)}
                style={{
                  padding: '10px 12px',
                  border: isActive ? '2px solid #1E40AF' : '1px solid #E2E8F0',
                  background: isActive ? '#EFF6FF' : '#FFFFFF',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: isActive ? '#1E40AF' : '#0F172A' }}>
                    {opt.sec} saniye
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: isActive ? '#1E40AF' : '#64748B' }}>
                    {opt.credits} kredi
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{opt.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SosyalForm({ productName, setProductName, socialPlatforms, setSocialPlatforms }) {
  const platforms = ['Instagram', 'TikTok', 'Facebook', 'Twitter/X'];
  const togglePlatform = (p) => {
    const lower = p.toLowerCase();
    if (socialPlatforms.includes(lower)) {
      setSocialPlatforms(socialPlatforms.filter((sp) => sp !== lower));
    } else {
      setSocialPlatforms([...socialPlatforms, lower]);
    }
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Sosyal medya içeriği
        </h3>
        <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>
          1 platform = 1 kredi
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
        Caption + hashtag üretimi. Birden fazla platform seçebilirsin, her birine özel ton ve karakter sınırı uygulanır.
      </p>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Platform
        </label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {platforms.map((p) => {
            const isActive = socialPlatforms.includes(p.toLowerCase());
            return (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                style={{
                  padding: '8px 14px',
                  border: isActive ? '1.5px solid #1E40AF' : '1px solid #E2E8F0',
                  background: isActive ? '#EFF6FF' : '#FFFFFF',
                  color: isActive ? '#1E40AF' : '#475569',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isActive && <Check size={12} strokeWidth={3} />}
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
          Ürün adı <span style={{ color: '#DC2626' }}>*</span>
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="örn: Bakır Cezve Set, Kadın Deri Çanta"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}
