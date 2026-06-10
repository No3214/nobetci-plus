"use client";

import { X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface KvkkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KvkkModal({ isOpen, onClose }: KvkkModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-neutral-800 text-white shadow-2xl p-6 scrollbar-thin scrollbar-thumb-neutral-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-neutral-100">KVKK Aydınlatma Metni</h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full bg-neutral-800 p-1.5 text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Legal Text Content */}
              <div className="text-xs text-neutral-300 space-y-4 leading-relaxed pr-1 text-justify">
                <p className="font-bold text-neutral-200">
                  NÖBETÇİ+ KİŞİSEL VERİLERİN İŞLENMESİ AYDINLATMA METNİ
                </p>
                <p>
                  6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, Nöbetçi+ (“Uygulama”) olarak, kullanıcılarımızın kişisel verilerinin korunmasına ve gizliliğine büyük önem veriyoruz. Bu aydınlatma metni ile kişisel verilerinizin nasıl işlendiği, paylaşıldığı ve haklarınız hakkında sizleri bilgilendirmek istiyoruz.
                </p>

                <p className="font-bold text-neutral-200">1. İşlenen Kişisel Verileriniz ve İşleme Amacı</p>
                <p>
                  Uygulamayı açtığınızda size en yakın nöbetçi eczaneleri mesafelerine göre listelemek amacıyla **anlık coğrafi konum verileriniz (GPS)** işlenmektedir. Bu konum verileri:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>Yalnızca en yakın eczaneleri hesaplamak amacıyla anlık olarak işlenir.</li>
                  <li>Sunucularımızda, veritabanımızda veya herhangi bir kalıcı depolama biriminde **asla kayıt altında tutulmaz ve arşivlenmez**.</li>
                  <li>Tamamen cihazınızda ve geçici API talebi sırasında işlenir.</li>
                </ul>

                <p className="font-bold text-neutral-200">2. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</p>
                <p>
                  Konum verileriniz, tarayıcınız veya mobil cihazınız aracılığıyla verdiğiniz anlık izin (açık rıza) doğrultusunda elektronik olarak toplanmaktadır. İşleme faaliyeti, KVKK Madde 5/1 uyarınca **“Açık Rıza”** hukuki sebebine dayanmaktadır. Konum iznini dilediğiniz zaman kapatabilir ve manuel il/ilçe seçimi ile uygulamayı kullanmaya devam edebilirsiniz.
                </p>

                <p className="font-bold text-neutral-200">3. İşlenen Verilerin Aktarılması</p>
                <p>
                  Anlık konum verileriniz üçüncü taraf şahıslara, reklam ağlarına, pazarlama ajanslarına veya herhangi bir kuruma **asla satılmaz, aktarılmaz ve paylaşılmaz**.
                </p>

                <p className="font-bold text-neutral-200">4. Çerezler (Cookies) ve Yerel Depolama</p>
                <p>
                  Uygulama, yalnızca kullanıcı tercihlerini (örneğin seçtiğiniz il/ilçe ve &quot;Büyük Yazı/Elder Mode&quot; tercihiniz) saklamak için yerel tarayıcı hafızasını (localStorage) kullanmaktadır. Bu çerezler reklam veya profil çıkarma amacı taşımamaktadır.
                </p>

                <p className="font-bold text-neutral-200">5. Sorumluluk Muafiyeti ve Yasal Uyarı</p>
                <p>
                  Uygulamamız nöbetçi eczaneleri en yakın mesafeye göre listelemektedir. Ancak, eczanelerin çalışma saatleri, nöbet durumları veya konumlarında meydana gelebilecek anlık değişiklikler ya da resmi veri sağlayıcılardan (belediyeler, eczacı odaları, üçüncü taraf servis sağlayıcılar) kaynaklanan gecikmeler/hatalar nedeniyle bilgilerin doğruluğu %100 garanti edilmemektedir. 
                </p>
                <p>
                  Kullanıcılarımızın yola çıkmadan önce listedeki telefonu kullanarak eczanenin nöbet durumunu teyit etmeleri kendi sorumluluklarındadır. Yanlış bilgilendirme veya sistemsel gecikmelerden ötürü ortaya çıkabilecek her türlü doğrudan veya dolaylı maddi/manevi zarardan Uygulama ve geliştiricileri sorumlu tutulamaz.
                </p>

                <p className="font-bold text-neutral-200">6. KVKK Kapsamındaki Haklarınız</p>
                <p>
                  KVKK’nın 11. maddesi uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme ve verilerinizin silinmesini isteme hakkına sahipsiniz. Konum verileriniz sistemimizde depolanmadığı için silinecek bir kayıt bulunmamaktadır. Diğer tüm sorularınız için bizimle <a href="mailto:kvkk@nobetciplus.com" className="text-emerald-400 hover:underline">kvkk@nobetciplus.com</a> adresi üzerinden iletişime geçebilirsiniz.
                </p>
              </div>

              {/* Confirm button */}
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-500 transition"
              >
                Okudum, Anladım
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
