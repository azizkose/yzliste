import { useState } from 'react';
import { Sparkles, Check, ArrowLeft, Save, Tag, Target, Star, Palette, MessageSquare } from 'lucide-react';

/**
 * /hesap/marka sayfası UX redesign mockup
 *
 * Çözülen 5 ana eksik (mevcut /hesap/marka sayfasına göre):
 *  1. ÖNİZLEME YOK — şimdi her form alanı dolduruldukça AI çıktısı canlı değişiyor
 *  2. SOMUT ÖRNEK YOK — "Senin ürünün için ne fark eder" şeklinde kıyas paneli
 *  3. İLERLEME GÖSTERGESİ YOK — kullanıcı ne kadarını doldurduğunu görüyor
 *  4. KAYIT BUTONU SAYFADA KAYBOLUYOR — sticky alt bar
 *  5. ESKİ PALET — anasayfa paleti (#1E40AF + slate)
 *
 * Renk paleti: anasayfa redesign ile uyumlu (slate scale + #1E40AF)
 */

export default function MarkaProfiliMockup() {
  const [storeName, setStoreName] = useState('');
  const [tone, setTone] = useState('samimi');
  const [audience, setAudience] = useState('');
  const [features, setFeatures] = useState('');
  const [extraInfo, setExtraInfo] = useState('');

  // İlerleme hesabı
  const filledCount = [storeName, tone, audience, features].filter(Boolean).length;
  const totalFields = 4;
  const progress = (filledCount / totalFields) * 100;

  // Canlı AI önizleme — form değiştikçe değişen örnek metin
  const generatePreview = () => {
    const isProf = tone === 'profesyonel';
    const isPrem = tone === 'premium';
    const isSamimi = tone === 'samimi';

    if (!storeName && !audience && !features) {
      return {
        type: 'empty',
        text: 'Form alanlarını doldurdukça örnek metin burada güncellenecek.',
      };
    }

    const brand = storeName || 'Markan';
    const audienceText = audience ? ` ${audience.toLowerCase()}` : '';
    const featuresText = features ? features.toLowerCase() : '';

    if (isSamimi) {
      return {
        type: 'samimi',
        text: `${brand}'dan harika bir set 💛${audienceText ? ` Özellikle${audienceText} için tasarlandı.` : ''} ${featuresText ? `${featuresText.charAt(0).toUpperCase() + featuresText.slice(1)} ile fark yaratıyor.` : 'Hayatına şıklık katacak.'} Hemen sahip ol!`,
      };
    }

    if (isProf) {
      return {
        type: 'profesyonel',
        text: `${brand} kalitesi ile üretilmiş premium bir ürün.${audienceText ? ` ${audience.charAt(0).toUpperCase() + audience.slice(1)} için ideal seçim.` : ''} ${featuresText ? `Öne çıkan özellikleri: ${featuresText}.` : 'Detaylı bilgi için ürün açıklamasını inceleyin.'}`,
      };
    }

    if (isPrem) {
      return {
        type: 'premium',
        text: `${brand} koleksiyonunun zarafetini sofranıza taşıyın.${audienceText ? ` ${audience.charAt(0).toUpperCase() + audience.slice(1)} için özenle hazırlanmıştır.` : ''} ${featuresText ? `${featuresText.charAt(0).toUpperCase() + featuresText.slice(1)} — her detayda mükemmellik.` : 'İncelikli bir ayrıntı, kalıcı bir izlenim.'}`,
      };
    }

    return { type: 'empty', text: '' };
  };

  const preview = generatePreview();

  // Genel (markasız) AI çıktısı — kıyas için
  const genericPreview = 'Kaliteli ürünümüz ile tanışın. Modern tasarımı ve dayanıklı yapısıyla beğeninize sunulmuştur. Detaylı bilgi için ürün açıklamasını inceleyebilirsiniz.';

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: '"Manrope", "Inter", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
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

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        {/* Breadcrumb */}
        <a style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#64748B',
          fontWeight: 500,
          marginBottom: '20px',
          cursor: 'pointer',
          textDecoration: 'none',
        }}>
          <ArrowLeft size={14} strokeWidth={2.5} />
          Hesabım
        </a>

        {/* Header — title + progress */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '12px',
          }}>
            <div>
              <h1 style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '28px',
                fontWeight: 800,
                color: '#0F172A',
                margin: '0 0 4px',
                letterSpacing: '-0.02em',
              }}>
                Marka profili
              </h1>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                AI metinleri bu bilgilere göre kişiselleştirir. Doldurdukça çıktılar markanın sesine yaklaşır.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px',
              }}>
                Profil tamamlandı
              </div>
              <div style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '20px',
                fontWeight: 800,
                color: progress === 100 ? '#10B981' : progress >= 50 ? '#1E40AF' : '#94A3B8',
              }}>
                {filledCount} / {totalFields}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '6px',
            background: '#E2E8F0',
            borderRadius: '100px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: progress === 100 ? '#10B981' : '#1E40AF',
              borderRadius: '100px',
              transition: 'width 0.4s ease-out',
            }} />
          </div>
        </div>

        {/* 2-column layout: form (sol) + canlı önizleme (sağ, sticky) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}>
          {/* SOL: Form */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Mağaza adı */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}>
                  <Tag size={14} strokeWidth={2.2} style={{ color: '#1E40AF' }} />
                  Mağaza / marka adı
                  {storeName && <Check size={14} strokeWidth={3} style={{ color: '#10B981', marginLeft: 'auto' }} />}
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="örn: Selin Porselen, TechStore TR"
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
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                  Her ürün açıklamasının başında geçer.
                </div>
              </div>

              {/* Metin tonu */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}>
                  <Palette size={14} strokeWidth={2.2} style={{ color: '#1E40AF' }} />
                  Metin tonu
                  <Check size={14} strokeWidth={3} style={{ color: '#10B981', marginLeft: 'auto' }} />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'samimi', label: 'Samimi', sub: 'Sıcak, yakın dil', emoji: '💛' },
                    { id: 'profesyonel', label: 'Profesyonel', sub: 'Resmi, kurumsal', emoji: '💼' },
                    { id: 'premium', label: 'Premium', sub: 'Lüks, seçkin', emoji: '✨' },
                  ].map((t) => {
                    const isActive = tone === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        style={{
                          padding: '12px 8px',
                          border: isActive ? '1.5px solid #1E40AF' : '1px solid #E2E8F0',
                          background: isActive ? '#EFF6FF' : '#FFFFFF',
                          color: isActive ? '#1E40AF' : '#475569',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '16px', marginBottom: '4px' }}>{t.emoji}</div>
                        <div style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500, marginBottom: '2px' }}>
                          {t.label}
                        </div>
                        <div style={{ fontSize: '11px', color: isActive ? '#1E40AF' : '#94A3B8', fontWeight: 400 }}>
                          {t.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hedef kitle */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}>
                  <Target size={14} strokeWidth={2.2} style={{ color: '#1E40AF' }} />
                  Hedef kitle
                  {audience && <Check size={14} strokeWidth={3} style={{ color: '#10B981', marginLeft: 'auto' }} />}
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="örn: 25-40 yaş kadın, çeyiz alıcıları"
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
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                  AI bu kitlenin diliyle yazar. Boş bırakırsan genel müşteri için yazar.
                </div>
              </div>

              {/* Öne çıkan özellikler */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}>
                  <Star size={14} strokeWidth={2.2} style={{ color: '#1E40AF' }} />
                  Öne çıkarmak istediğin değerler
                  {features && <Check size={14} strokeWidth={3} style={{ color: '#10B981', marginLeft: 'auto' }} />}
                </label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="örn: hızlı kargo, iade garantisi, yerli üretim, organik malzeme"
                  rows={2}
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
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                  Her ürün açıklamasında otomatik vurgulanır.
                </div>
              </div>

              {/* Ek bilgiler */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '6px',
                }}>
                  <MessageSquare size={14} strokeWidth={2.2} style={{ color: '#94A3B8' }} />
                  Ek bilgiler <span style={{ color: '#94A3B8', fontWeight: 400 }}>(isteğe bağlı)</span>
                </label>
                <textarea
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  placeholder="örn: garanti süresi, üretim yeri, sertifikalar, mağaza özel kampanyaları"
                  rows={2}
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

          {/* SAĞ: Canlı önizleme (sticky) */}
          <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Önizleme — markalı */}
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #1E40AF',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 16px rgba(30, 64, 175, 0.08)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '12px',
              }}>
                <Sparkles size={14} strokeWidth={2.5} style={{ color: '#1E40AF' }} />
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#1E40AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Sen yazınca AI böyle yazıyor
                </span>
              </div>
              <div
                key={preview.text}
                className="fade-in"
                style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: preview.type === 'empty' ? '#94A3B8' : '#0F172A',
                  fontStyle: preview.type === 'empty' ? 'italic' : 'normal',
                  minHeight: '70px',
                }}
              >
                {preview.text}
              </div>
            </div>

            {/* Önizleme — generic kıyas */}
            <div style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '12px',
              }}>
                <span style={{ fontSize: '14px', opacity: 0.6 }}>📝</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Profil olmadan AI böyle yazardı
                </span>
              </div>
              <div style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#64748B',
              }}>
                {genericPreview}
              </div>
            </div>

            {/* Why fill it — somut fayda */}
            <div style={{
              background: '#FFFBEB',
              border: '1px solid #FED7AA',
              borderRadius: '12px',
              padding: '14px 16px',
              fontSize: '13px',
              color: '#92400E',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: '#9A3412', display: 'block', marginBottom: '4px' }}>
                💡 Neden bu önemli?
              </strong>
              Marka profili olmadan AI, herkes için aynı genel metni üretir. Profilin tamamlandığında her ürün açıklaması mağazanın sesini taşır.
            </div>
          </div>
        </div>

        {/* Sticky save bar */}
        <div style={{
          position: 'sticky',
          bottom: '20px',
          marginTop: '24px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '14px 20px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
              {progress === 100 ? '✓ Profilin tamamlandı' : `${totalFields - filledCount} alan daha doldur`}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              {progress === 100
                ? 'AI artık markanın sesiyle yazıyor.'
                : 'Daha kişisel çıktılar için profili tamamla.'}
            </div>
          </div>
          <button style={{
            padding: '10px 16px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#475569',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            İptal
          </button>
          <button style={{
            padding: '10px 20px',
            background: '#1E40AF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)',
          }}>
            <Save size={14} strokeWidth={2.5} />
            Profili kaydet
          </button>
        </div>
      </main>

      {/* Designer note */}
      <div style={{
        background: '#F8FAFC',
        borderTop: '1px solid #E2E8F0',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#64748B',
      }}>
        <strong style={{ color: '#0F172A' }}>Tasarımcı notu:</strong> Sol form, sağ canlı önizleme (sticky). Form alanlarını doldurdukça sağdaki "AI çıktısı" canlı değişiyor. Altta "AI bunu profilsiz yazardı" kıyas paneli — kullanıcı farkı görüyor. İlerleme bar üstte, sticky kayıt bar altta. Mevcut sayfada bunlar yoktu — kullanıcı dolduruyordu ama "ne kazandığını" göremediği için yarım bırakıyordu.
      </div>
    </div>
  );
}
