export interface DrugInfo {
  id: string;
  name: string;
  activeIngredient: string;
  drugClass: string;
  purpose: string;
  scientificExplanation: string;
  howToUse: string;
  warnings: string;
}

export const DRUGS_DATABASE: DrugInfo[] = [
  {
    id: "parol",
    name: "Parol",
    activeIngredient: "Parasetamol (Acetaminophen)",
    drugClass: "Analjezik (Ağrı Kesici) & Antipiretik (Ateş Düşürücü)",
    purpose: "Baş ağrısı, migren, diş ağrısı, eklem/kas ağrıları, soğuk algınlığı semptomları ve yüksek ateş.",
    scientificExplanation: "Merkezi sinir sisteminde (beyin ve omurilik) prostaglandin adı verilen ağrı ve ateş kimyasallarının sentezini bloke eder. Çevre dokulardaki iltihap azaltıcı (antiinflamatuar) etkisi çok düşüktür; bu sayede mideyi diğer ağrı kesiciler kadar yormaz.",
    howToUse: "Yetişkinler için 4-6 saatte bir 1-2 tablet. Günlük maksimum doz 4000 mg (8 tablet). Tok veya aç karnına alınabilir.",
    warnings: "Alkollü içeceklerle birlikte alınmamalıdır (ciddi karaciğer hasarı riski). Karaciğer veya böbrek yetmezliği olanlarda hekim kontrolünde kullanılmalıdır."
  },
  {
    id: "arveles",
    name: "Arveles",
    activeIngredient: "Deksketoprofen Trometamol",
    drugClass: "Nonsteroid Antiinflamatuar İlaç (NSAİİ)",
    purpose: "Akut kas-iskelet sistemi ağrıları, ağrılı adet dönemleri (dismenore) ve şiddetli diş ağrıları.",
    scientificExplanation: "Vücuttaki ağrı, ateş ve inflamasyona yol açan siklooksijenaz-1 (COX-1) ve siklooksijenaz-2 (COX-2) enzimlerini inhibe ederek prostaglandin sentezini hızlı bir şekilde baskılar.",
    howToUse: "İhtiyaca göre günde 1-3 kez (8 saatte bir) 25 mg (1 tablet). Günlük maksimum doz 75 mg. Tok karnına alınması önerilir.",
    warnings: "Mide ülseri, gastrointestinal kanama riski taşıyanlar veya ağır kalp yetmezliği olanlar kullanmamalıdır. Kan sulandırıcılarla etkileşime girebilir."
  },
  {
    id: "majezik",
    name: "Majezik",
    activeIngredient: "Flurbiprofen",
    drugClass: "Nonsteroid Antiinflamatuar İlaç (NSAİİ)",
    purpose: "Şiddetli diş ağrısı, eklem ağrıları, romatoid artrit ve boğaz ağrıları (sprey/gargara formu).",
    scientificExplanation: "Prostaglandin üretimini sağlayan COX enzimlerini geri dönüşümsüz olarak bloke ederek lokal dokulardaki inflamasyonu (iltihaplanmayı) azaltır ve ağrı sinyallerinin beyne iletilmesini engeller.",
    howToUse: "Genellikle günde 2 kez (12 saatte bir) 100 mg tablet. Tok karnına alınmalıdır.",
    warnings: "Mide koruyucu olmadan uzun süreli kullanımı mide delinmesi ve gastrite yol açabilir. Astım hastalarında bronkospazmı tetikleyebilir."
  },
  {
    id: "apranax",
    name: "Apranax / Apranax Forte",
    activeIngredient: "Naproksen Sodyum",
    drugClass: "Nonsteroid Antiinflamatuar İlaç (NSAİİ)",
    purpose: "Migren atakları, diş ağrısı, adet sancıları, burkulmalar ve romatizmal ağrılar.",
    scientificExplanation: "Naproksen, COX enzim inhibisyonu yoluyla prostaglandin sentezini yavaşlatır ancak uzun yarı ömrü sayesinde vücutta daha uzun süre (12 saate kadar) aktif kalarak uzun süreli ağrı kontrolü sağlar.",
    howToUse: "Genellikle günde 1 veya 2 kez 275 mg veya 550 mg (Forte). Tok karnına bol su ile alınmalıdır.",
    warnings: "Kardiyovasküler (kalp-damar) riskleri artırabileceğinden bypass ameliyatı öncesi veya sonrası kullanılmamalıdır. Mide hassasiyeti olanlar dikkat etmelidir."
  },
  {
    id: "augmentin",
    name: "Augmentin",
    activeIngredient: "Amoksisilin + Klavulanik Asit",
    drugClass: "Geniş Spektrumlu Penisilin Grubu Antibiyotik",
    purpose: "Sinüzit, orta kulak iltihabı, tonsillit (bademcik iltihabı), idrar yolu enfeksiyonları ve akciğer enfeksiyonları (zatürre).",
    scientificExplanation: "Amoksisilin, bakterilerin hücre duvarı sentezini bozarak ölümüne yol açar. Klavulanik asit ise bakterilerin antibiyotiği parçalamak için ürettiği beta-laktamaz enzimini bloke ederek antibiyotiğin etkisini korur.",
    howToUse: "Hekim tavsiyesine göre 12 saatte bir (günde 2 kez) tok karnına. Antibiyotik tedavisi doktorun belirttiği süre boyunca yarım bırakılmadan tamamlanmalıdır.",
    warnings: "Viral enfeksiyonlarda (grip, soğuk algınlığı) kesinlikle etkisizdir. Penisilin alerjisi olan bireylerde ciddi alerjik reaksiyonlara (anafilaksi) sebep olabilir."
  },
  {
    id: "coraspin",
    name: "Coraspin",
    activeIngredient: "Asetilsalisilik Asit (Aspirin)",
    drugClass: "Antiagregan (Kan Sulandırıcı / Trombosit Agregasyon İnhibitörü)",
    purpose: "Kalp krizi, inme (felç) ve damar tıkanıklığı riskini azaltmak.",
    scientificExplanation: "Trombositlerde bulunan COX-1 enzimini kalıcı olarak asetilleyerek pıhtılaşmayı tetikleyen Tromboksan A2 (TXA2) molekülünün üretimini engeller. Bu sayede kan hücrelerinin birbirine yapışmasını önler.",
    howToUse: "Hekim önerisiyle genellikle günde 1 kez 100 mg (1 tablet), ezilmeden çiğnenmeden tok karnına bol su ile yutulur.",
    warnings: "Kanama riskini artırır; cerrahi operasyonlardan önce doktora danışılarak kesilmelidir. Mide kanaması geçmişi olanlar kullanırken dikkat etmelidir."
  },
  {
    id: "gaviscon",
    name: "Gaviscon",
    activeIngredient: "Sodyum Aljinat + Sodyum Bikarbonat + Kalsiyum Karbonat",
    drugClass: "Antiasit ve Reflü Önleyici",
    purpose: "Reflü, mide ekşimesi, yemek borusunda yanma ve hazımsızlık.",
    scientificExplanation: "Mide asidiyle temas ettiğinde köpürerek nötr bir aljinat bariyeri (jel salı) oluşturur. Bu bariyer mide içeriğinin üstüne oturarak asidin yemek borusuna kaçmasını fiziksel olarak engeller.",
    howToUse: "Yemeklerden sonra ve yatarken 10-20 ml (sıvı süspansiyon) veya 2-4 tablet (çiğnenerek).",
    warnings: "İçerdiği sodyum nedeniyle tuzsuz diyet yapan kalp veya böbrek hastalarında dikkatli tüketilmelidir. Diğer ilaçların emilimini azaltabileceği için aralarında 2 saat bırakılmalıdır."
  },
  {
    id: "lansor",
    name: "Lansor",
    activeIngredient: "Lansoprazol",
    drugClass: "Proton Pompası İnhibitörü (Mide Koruyucu)",
    purpose: "Mide ve onikiparmak bağırsağı ülseri, gastroözofageal reflü hastalığı ve gastrit.",
    scientificExplanation: "Mide parietal hücrelerindeki asit salgılayan hidrojen-potasyum ATPaz (proton pompası) enzim sistemini spesifik olarak bloke ederek mide asidinin üretimini son aşamada durdurur.",
    howToUse: "Genellikle günde 1 kez sabah aç karnına (kahvaltıdan 30-40 dakika önce) kapsül şeklinde yutulur.",
    warnings: "Uzun süreli kullanımı B12 vitamini ve magnezyum emilimini azaltabilir. Kemik erimesi (osteoporoz) riskini artırabilir."
  },
  {
    id: "nurofen",
    name: "Nurofen",
    activeIngredient: "İbuprofen",
    drugClass: "Nonsteroid Antiinflamatuar İlaç (NSAİİ)",
    purpose: "Baş ağrısı, adet ağrıları, diş ağrısı, grip/soğuk algınlığına bağlı vücut ağrıları ve ateş düşürücü.",
    scientificExplanation: "Siklooksijenaz enzim aktivitesini inhibe ederek ağrı reseptörlerini hassaslaştıran prostaglandinlerin oluşumunu engeller. Hipotalamustaki ısı merkezini düzenleyerek ateşi düşürür.",
    howToUse: "İhtiyaca göre 4-6 saatte bir 200-400 mg. Günlük maksimum doz 1200 mg. Tok karnına bol su ile alınmalıdır.",
    warnings: "Kalp rahatsızlığı olanlarda, bypass öncesi/sonrası süreçlerde risklidir. Mide koruyucu olmadan sık kullanımı önerilmez."
  },
  {
    id: "vermidon",
    name: "Vermidon",
    activeIngredient: "Parasetamol + Kafein",
    drugClass: "Kombine Analjezik (Ağrı Kesici)",
    purpose: "Şiddetli baş ağrısı, migren, eklem-kas ağrıları ve yüksek ateş.",
    scientificExplanation: "Parasetamol prostaglandin sentezini önleyerek ağrıyı keser. Kafein ise beyindeki kan damarlarını daraltarak ağrı sinyallerini zayıflatır ve parasetamolün emilim hızını ve etkisini yaklaşık %40 oranında artırır.",
    howToUse: "Genellikle günde 3-4 kez 1 tablet. Günlük maksimum 6 tablet.",
    warnings: "Kafein içerdiğinden çarpıntı veya uykusuzluk yapabilir. Günlük parasetamol limiti (4g) kesinlikle aşılmamalıdır."
  }
];
