import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  prizePool: string;
  prizeDetails: string;
  countdownTitle: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  
  // Navigation
  navClash: string;
  navLeaderboard: string;
  navBrowse: string;
  navJoin: string;
  navStore: string;
  navAdmin: string;
  navSqlSchema: string;
  
  // Voting & Versus
  headToHead: string;
  voteFree: string;
  superVote: string;
  superVoteWorth: string;
  nextPair: string;
  dailyFreeVotesLeft: string;
  outOfFreeVotes: string;
  getSuperVotesNow: string;
  vs: string;
  totalVotes: string;
  
  // Errors & Alerts
  selfVoteError: string;
  ipLimitError: string;
  voteSuccess: string;
  superVoteSuccess: string;
  
  // Application Form
  joinTitle: string;
  joinSubtitle: string;
  fullName: string;
  nickname: string;
  instagramHandle: string;
  characterName: string;
  photoUrl: string;
  photoUrlPlaceholder: string;
  bio: string;
  submitApplication: string;
  applicationPending: string;
  applicationSubmittedMsg: string;
  
  // Leaderboard
  leaderboardTitle: string;
  leaderboardSubtitle: string;
  rank: string;
  cosplayer: string;
  character: string;
  votes: string;
  action: string;
  viewInstagram: string;
  
  // Store / Payments
  storeTitle: string;
  storeSubtitle: string;
  superVotesBalance: string;
  buyVotes: string;
  payCreditCard: string;
  payCrypto: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  payNow: string;
  cryptoInstruction: string;
  selectCrypto: string;
  sendToWallet: string;
  copyAddress: string;
  copied: string;
  txHashLabel: string;
  txHashPlaceholder: string;
  submitCryptoPayment: string;
  paymentSubmittedMsg: string;
  
  // Admin Panel
  adminTitle: string;
  adminSubtitle: string;
  pendingApplicants: string;
  pendingTransactions: string;
  activeContestants: string;
  approve: string;
  reject: string;
  approved: string;
  rejected: string;
  status: string;
  userEmail: string;
  amount: string;
  paymentMethod: string;
  txHash: string;
  date: string;
  noPendingApplicants: string;
  noPendingTransactions: string;
  adminModeToggle: string;
  adminModeActive: string;
  adminModeGuest: string;
  statsTotalVotes: string;
  statsTotalContestants: string;
  statsPendingApps: string;
  statsPendingPayments: string;
  copySqlScript: string;

  // Auth Modal
  authModalTitleRegister: string;
  authModalTitleLogin: string;
  authModalSubtitleRegister: string;
  authModalSubtitleLogin: string;
  authTabRegister: string;
  authTabLogin: string;
  accountTypeLabel: string;
  voterRoleTitle: string;
  voterRoleDesc: string;
  contestantRoleTitle: string;
  contestantRoleDesc: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  passwordLabel: string;
  submitRegister: string;
  authAlreadyRegistered: string;
  submitLogin: string;

  // Prize Banner
  prizeBannerTitle: string;
  firstPlacePrize: string;
  secondPlacePrize: string;
  thirdPlacePrize: string;

  // Legal & FAQ
  faqNav: string;
  rulesNav: string;
  privacyNav: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  rulesR1: string;
  rulesR2: string;
  rulesR3: string;
  privacyP1: string;
  privacyP2: string;
  privacyP3: string;

  // User Profile Modal
  userProfileTitle: string;
  userProfileSubtitle: string;
  userRoleLabel: string;
  roleVoter: string;
  roleContestant: string;
  superVoteCredits: string;
  logoutBtn: string;
  loginRegisterBtn: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "SpiderQueens",
    tagline: "Viral Cosplay & Costume World Championship",
    prizePool: "Monthly Prize Pool",
    prizeDetails: "$1,000 Cash + $250 Gift Voucher",
    countdownTitle: "Prize Distribution Countdown",
    days: "Days",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
    
    navClash: "Arena Clash",
    navLeaderboard: "Leaderboard",
    navBrowse: "All Queens",
    navJoin: "Join Contest",
    navStore: "Super Votes Shop",
    navAdmin: "Admin Panel",
    navSqlSchema: "Supabase SQL",
    
    headToHead: "Cosplay Battle Arena",
    voteFree: "Free Vote",
    superVote: "Super Vote",
    superVoteWorth: "5x Power!",
    nextPair: "Next Battle",
    dailyFreeVotesLeft: "Daily Free Votes Remaining",
    outOfFreeVotes: "You've used all 5 free daily votes for your IP!",
    getSuperVotesNow: "Buy Super Votes to Keep Voting",
    vs: "VS",
    totalVotes: "Votes",
    
    selfVoteError: "Rule Violation: You cannot vote for your own cosplay!",
    ipLimitError: "IP Limit Reached: Maximum 5 free votes per day for your network.",
    voteSuccess: "Vote recorded successfully!",
    superVoteSuccess: "Super Vote (+5) cast successfully!",
    
    joinTitle: "Join SpiderQueens Championship",
    joinSubtitle: "Showcase your cosplay art, build your audience, and win the $1,250 prize pool!",
    fullName: "Full Name",
    nickname: "Cosplay Nickname",
    instagramHandle: "Instagram Handle",
    characterName: "Character / Costume Title",
    photoUrl: "Cosplay Photo Image URL",
    photoUrlPlaceholder: "https://images.unsplash.com/... or paste image URL",
    bio: "Short Bio / Cosplay Story",
    submitApplication: "Submit Cosplay Entry",
    applicationPending: "Your application is under review by our team.",
    applicationSubmittedMsg: "Application submitted! Once approved by an Admin, your profile will appear in the Arena.",
    
    leaderboardTitle: "Top 10 Cosplay Queens",
    leaderboardSubtitle: "The most voted cosplayers competing for this month's $1,250 Grand Prize Pool.",
    rank: "Rank",
    cosplayer: "Cosplayer",
    character: "Character",
    votes: "Total Votes",
    action: "Action",
    viewInstagram: "Instagram Profile",
    
    storeTitle: "Super Votes Shop",
    storeSubtitle: "Power up your favorite cosplayers with 5x vote weight and no daily IP limits!",
    superVotesBalance: "Your Super Votes",
    buyVotes: "Buy Now",
    payCreditCard: "Credit Card (Instant)",
    payCrypto: "Crypto Payment (Manual USDT / BTC / ETH)",
    cardNumber: "Card Number",
    cardExpiry: "MM/YY",
    cardCvc: "CVC",
    cardName: "Cardholder Name",
    payNow: "Pay & Load Votes",
    cryptoInstruction: "Send exact amount to our official wallet address and enter your Transaction Hash below.",
    selectCrypto: "Select Cryptocurrency",
    sendToWallet: "Deposit Wallet Address",
    copyAddress: "Copy Wallet",
    copied: "Copied!",
    txHashLabel: "Transaction Hash (TX ID) / Receipt Note",
    txHashPlaceholder: "e.g. 0x8f2d... or TRC20 TX Hash",
    submitCryptoPayment: "Submit Transaction for Verification",
    paymentSubmittedMsg: "Payment submitted! Super Votes will be added automatically once an Admin approves your transaction.",
    
    adminTitle: "Admin Control Center",
    adminSubtitle: "Verify cosplay applications, approve crypto payments, and manage tournament status.",
    pendingApplicants: "Pending Applications",
    pendingTransactions: "Pending Crypto/Card Payments",
    activeContestants: "Approved Cosplayers",
    approve: "Approve",
    reject: "Reject",
    approved: "Approved",
    rejected: "Rejected",
    status: "Status",
    userEmail: "User Email",
    amount: "Amount",
    paymentMethod: "Payment Method",
    txHash: "TX Hash / Note",
    date: "Date",
    noPendingApplicants: "No pending contestant applications at the moment.",
    noPendingTransactions: "No pending payments awaiting review.",
    adminModeToggle: "Admin Access Mode",
    adminModeActive: "Admin Status: ENABLED",
    adminModeGuest: "Admin Status: DISABLED (Click to toggle)",
    statsTotalVotes: "Total Votes Cast",
    statsTotalContestants: "Active Queens",
    statsPendingApps: "Pending Reviews",
    statsPendingPayments: "Pending Payments",
    copySqlScript: "Copy Supabase SQL Schema Script",

    authModalTitleRegister: "Create Account",
    authModalTitleLogin: "Welcome Back",
    authModalSubtitleRegister: "Join the cosplay championship to vote or participate!",
    authModalSubtitleLogin: "Log in with your existing account to continue",
    authTabRegister: "Register",
    authTabLogin: "Log In",
    accountTypeLabel: "Select Account Type",
    voterRoleTitle: "Voter (Fan)",
    voterRoleDesc: "Vote for your favorite cosplayers & buy Super Votes",
    contestantRoleTitle: "Contestant",
    contestantRoleDesc: "Upload your cosplay & compete for $1,250 prizes",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "e.g. Elena Rostova",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    submitRegister: "Create Account & Start",
    authAlreadyRegistered: "This email is already registered. Please log in or reset your password.",
    submitLogin: "Log In to Account",

    prizeBannerTitle: "Monthly Championship Rewards",
    firstPlacePrize: "$1,000 CASH (1st Place)",
    secondPlacePrize: "$250 Gift Voucher (2nd Place)",
    thirdPlacePrize: "$50 Gift Voucher (3rd Place)",

    faqNav: "FAQ",
    rulesNav: "Rules & Terms",
    privacyNav: "Privacy Policy",
    faqQ1: "How does the voting system work?",
    faqA1: "Each IP address receives 5 free votes daily. Super Votes purchased from the store provide 5x voting power and bypass IP limits.",
    faqQ2: "When are prizes distributed?",
    faqA2: "On the last day of every month when the timer ends, top 3 ranked cosplayers receive $1,000 Cash, $250 Voucher, and $50 Voucher.",
    faqQ3: "How can I join as a cosplayer?",
    faqA3: "Fill out the application form in the 'Join Championship' tab with your cosplay photo & Instagram. Once approved, your profile goes live in the Arena.",
    rulesR1: "1. Originality & Rights: All submitted cosplay photos must be your own work or used with authorized permission.",
    rulesR2: "2. Fair Play: Automated bots, VPN manipulation, or fraudulent voting are strictly banned and lead to immediate disqualification.",
    rulesR3: "3. Community Respect: Harassment, hate speech, or inappropriate content will be removed immediately.",
    privacyP1: "1. Data Usage: Email and profile info are used strictly for tournament communications and Super Vote transactions.",
    privacyP2: "2. IP Protection: IP addresses are anonymized solely to enforce daily fair voting limits and are never sold.",
    privacyP3: "3. Payment Security: Credit card and crypto payments are processed through encrypted, secure gateways.",

    userProfileTitle: "My Profile",
    userProfileSubtitle: "Your SpiderQueens Account Details",
    userRoleLabel: "Account Type",
    roleVoter: "Voter (Fan)",
    roleContestant: "Contestant",
    superVoteCredits: "Super Vote Balance",
    logoutBtn: "Log Out",
    loginRegisterBtn: "Log In / Register"
  },
  tr: {
    appName: "SpiderQueens",
    tagline: "Viral Cosplay ve Kostüm Dünya Şampiyonası",
    prizePool: "Aylık Ödül Havuzu",
    prizeDetails: "1.000$ Nakit + 250$ Hediye Çeki",
    countdownTitle: "Ödül Dağıtımına Kalan Süre",
    days: "Gün",
    hours: "Saat",
    minutes: "Dakika",
    seconds: "Saniye",
    
    navClash: "Oylama Arenası",
    navLeaderboard: "Liderlik Tablosu",
    navBrowse: "Tüm Yarışmacılar",
    navJoin: "Yarışmaya Katıl",
    navStore: "Super Vote Mağazası",
    navAdmin: "Yönetici Paneli",
    navSqlSchema: "Supabase SQL",
    
    headToHead: "Cosplay Karşılaştırma Arenası",
    voteFree: "Ücretsiz Oy",
    superVote: "Super Vote",
    superVoteWorth: "5 Kat Güç!",
    nextPair: "Sıradaki Eşleşme",
    dailyFreeVotesLeft: "Günlük Kalan Ücretsiz Oy Sayınız",
    outOfFreeVotes: "Bu IP adresi için günlük 5 ücretsiz oy hakkınız bitti!",
    getSuperVotesNow: "Oylamaya Devam Etmek İçin Super Vote Satın Al",
    vs: "VS",
    totalVotes: "Oy",
    
    selfVoteError: "Kural İhlali: Kendi cosplay fotoğrafınıza oy veremezsiniz!",
    ipLimitError: "IP Limiti Doldu: Ağınız için günlük maksimum 5 ücretsiz oy hakkı.",
    voteSuccess: "Oyunuz başarıyla kaydedildi!",
    superVoteSuccess: "Super Vote (+5) başarıyla kullanıldı!",
    
    joinTitle: "SpiderQueens Şampiyonasına Katıl",
    joinSubtitle: "Cosplay sanatını sergile, kitleni büyüt ve 1.250$'lık ödül havuzunu kazan!",
    fullName: "Ad Soyad",
    nickname: "Cosplay Takma Adı (Nickname)",
    instagramHandle: "Instagram Hesabı",
    characterName: "Karakter / Kostüm Adı",
    photoUrl: "Cosplay Fotoğraf URL'si",
    photoUrlPlaceholder: "https://images.unsplash.com/... veya görsel bağlantısı",
    bio: "Kısa Biyografi / Cosplay Hikayesi",
    submitApplication: "Başvuruyu Gönder",
    applicationPending: "Başvurunuz ekibimiz tarafından incelenmektedir.",
    applicationSubmittedMsg: "Başvurunuz alındı! Admin onayından sonra profiliniz Arenada yayınlanacaktır.",
    
    leaderboardTitle: "En Çok Oy Alan 10 Cosplay Kraliçesi",
    leaderboardSubtitle: "Bu ayın 1.250$'lık büyük ödülü için yarışan en popüler cosplayer'lar.",
    rank: "Sıra",
    cosplayer: "Cosplayer",
    character: "Karakter",
    votes: "Toplam Oy",
    action: "İşlem",
    viewInstagram: "Instagram Profili",
    
    storeTitle: "Super Vote Mağazası",
    storeSubtitle: "Favori cosplayer'ına 5 kat oy gücüyle destek ol, günlük IP limitine takılma!",
    superVotesBalance: "Mevcut Super Vote Bakiyeniz",
    buyVotes: "Hemen Satın Al",
    payCreditCard: "Kredi Kartı (Anında Yükleme)",
    payCrypto: "Kripto Para (Manuel USDT / BTC / ETH)",
    cardNumber: "Kart Numarası",
    cardExpiry: "A/Y",
    cardCvc: "CVC",
    cardName: "Kart Üzerindeki İsim",
    payNow: "Öde ve Oyları Yükle",
    cryptoInstruction: "Belirtilen cüzdan adresine ödemeyi yapıp İşlem Hash (TX ID) kodunu aşağıya giriniz.",
    selectCrypto: "Kripto Birimi Seçin",
    sendToWallet: "Yatırılacak Cüzdan Adresi",
    copyAddress: "Adresi Kopyala",
    copied: "Kopyalandı!",
    txHashLabel: "İşlem Hash (TX ID) / Dekont Notu",
    txHashPlaceholder: "Örn: 0x8f2d... veya TRC20 TX Hash",
    submitCryptoPayment: "Ödemeyi Admin Onayına Gönder",
    paymentSubmittedMsg: "Ödeme bildirimi alındı! Admin onayından sonra Super Vote kredileriniz hesabınıza tanımlanacaktır.",
    
    adminTitle: "Yönetici Kontrol Merkezi",
    adminSubtitle: "Cosplay başvurularını incele, kripto ödemelerini onayla ve turnuvayı yönet.",
    pendingApplicants: "Onay Bekleyen Başvurular",
    pendingTransactions: "Onay Bekleyen Ödemeler",
    activeContestants: "Onaylı Yarışmacılar",
    approve: "Onayla",
    reject: "Reddet",
    approved: "Onaylandı",
    rejected: "Reddedildi",
    status: "Durum",
    userEmail: "Kullanıcı E-Posta",
    amount: "Tutar",
    paymentMethod: "Ödeme Yöntemi",
    txHash: "TX Kodu / Not",
    date: "Tarih",
    noPendingApplicants: "Şu anda onay bekleyen başvuru bulunmamaktadır.",
    noPendingTransactions: "İnceleme bekleyen ödeme bulunmuyor.",
    adminModeToggle: "Admin Erişim Modu",
    adminModeActive: "Admin Durumu: AKTİF",
    adminModeGuest: "Admin Durumu: KAPALI (Değiştirmek için tıklayın)",
    statsTotalVotes: "Toplam Kullanılan Oy",
    statsTotalContestants: "Onaylı Yarışmacı",
    statsPendingApps: "Bekleyen Başvuru",
    statsPendingPayments: "Bekleyen Ödeme",
    copySqlScript: "Supabase SQL Şema Kodunu Kopyala",

    authModalTitleRegister: "Hesap Oluştur",
    authModalTitleLogin: "Tekrar Hoş Geldiniz",
    authModalSubtitleRegister: "Oy vermek veya yarışmaya katılmak için kaydolun!",
    authModalSubtitleLogin: "Devam etmek için mevcut hesabınızla giriş yapın",
    authTabRegister: "Kayıt Ol",
    authTabLogin: "Giriş Yap",
    accountTypeLabel: "Hesap Türü Seçin",
    voterRoleTitle: "Oylayıcı (Hayran)",
    voterRoleDesc: "Favori cosplayer'lara oy ver & Super Vote kazan",
    contestantRoleTitle: "Yarışmacı",
    contestantRoleDesc: "Cosplay fotoğrafını yükle & 1.250$'lık ödül için yarış",
    fullNameLabel: "Ad Soyad",
    fullNamePlaceholder: "Örn: Elena Rostova",
    emailLabel: "E-Posta Adresi",
    passwordLabel: "Şifre",
    submitRegister: "Kayıt Ol & Başla",
    authAlreadyRegistered: "Bu e-posta zaten kayıtlı. Lütfen giriş yapın veya şifrenizi sıfırlayın.",
    submitLogin: "Giriş Yap",

    prizeBannerTitle: "Aylık Şampiyona Ödül Havuzu",
    firstPlacePrize: "1.000$ NAKİT ÖDÜL (1. Sıra)",
    secondPlacePrize: "250$ HEDİYE ÇEKİ (2. Sıra)",
    thirdPlacePrize: "50$ HEDİYE ÇEKİ (3. Sıra)",

    faqNav: "Sıkça Sorulan Sorular",
    rulesNav: "Kurallar ve Şartlar",
    privacyNav: "Gizlilik Politikası",
    faqQ1: "Oylama sistemi nasıl çalışır?",
    faqA1: "Her IP adresinin günlük 5 adet ücretsiz oy hakkı bulunmaktadır. Mağazadan edineceğiniz Super Vote kredileri 5 kat (5x) oy gücüne sahiptir ve IP sınırına takılmaz.",
    faqQ2: "Ödüller ne zaman dağıtılır?",
    faqA2: "Her ayın son gününde geri sayım tamamlandığında liderlik tablosundaki ilk 3 cosplayer'a sırasıyla $1.000 Nakit, $250 Hediye Çeki ve $50 Hediye Çeki teslim edilir.",
    faqQ3: "Cosplayer olarak nasıl başvurabilirim?",
    faqA3: "'Yarışmaya Katıl' sekmesindeki formu doldurup cosplay fotoğrafınızı ve Instagram hesabınızı ekleyerek başvurabilirsiniz. Ekip onayından sonra profiliniz Arenada yayınlanır.",
    rulesR1: "1. Orijinallik ve Haklar: Yüklenen tüm görseller yarışmacının kendi cosplay çalışması veya izinli fotoğrafı olmalıdır.",
    rulesR2: "2. Adil Oylama Kuralları: Otomatik bot, VPN manipülasyonu veya hileli oy üretimi kesinlikle yasaktır ve diskalifiye sebebidir.",
    rulesR3: "3. Saygı ve Topluluk Kuralları: Hakaret içeren, nefret söylemi barındıran veya uygunsuz içerikler derhal kaldırılır.",
    privacyP1: "1. Veri Kullanımı: E-posta ve profil bilgileriniz yalnızca turnuva iletişimi ve Super Vote işlemleri için kullanılır.",
    privacyP2: "2. IP Adresi Güvenliği: IP adresleri adil oy haklarını hesaplamak için anonimleştirilerek saklanır ve paylaşılmaz.",
    privacyP3: "3. Ödeme Güvenliği: Kredi kartı ve kripto ödemeleri şifrelenmiş güvenli ödeme kanalları üzerinden işlenir.",

    userProfileTitle: "Profilim",
    userProfileSubtitle: "SpiderQueens Hesap Detaylarınız",
    userRoleLabel: "Hesap Türü",
    roleVoter: "Oylayıcı (Hayran)",
    roleContestant: "Yarışmacı",
    superVoteCredits: "Super Vote Bakiyesi",
    logoutBtn: "Çıkış Yap",
    loginRegisterBtn: "Giriş Yap / Kayıt Ol"
  },
  ru: {
    appName: "SpiderQueens",
    tagline: "Вирусный Чемпионат по Косплею и Костюмам",
    prizePool: "Ежемесячный Призовой Фонд",
    prizeDetails: "$1,000 Наличными + $250 Подарочный Сертификат",
    countdownTitle: "До Раздачи Наград Остарлось",
    days: "Дней",
    hours: "Часов",
    minutes: "Минут",
    seconds: "Секунд",
    
    navClash: "Арена Битв",
    navLeaderboard: "Таблица Лидеров",
    navBrowse: "Все Участники",
    navJoin: "Подать Заявку",
    navStore: "Магазин Super Vote",
    navAdmin: "Панель Админа",
    navSqlSchema: "Supabase SQL",
    
    headToHead: "Битва Косплееров 1 на 1",
    voteFree: "Бесплатный Голос",
    superVote: "Super Vote",
    superVoteWorth: "Сила x5!",
    nextPair: "Следующая Пара",
    dailyFreeVotesLeft: "Осталось Бесплатных Голосов На Сегодня",
    outOfFreeVotes: "Вы использовали все 5 бесплатных голосов для вашего IP на сегодня!",
    getSuperVotesNow: "Купить Super Votes, Чтобы Продолжить",
    vs: "VS",
    totalVotes: "Голосов",
    
    selfVoteError: "Нарушение Правил: Нельзя голосовать за свой косплей!",
    ipLimitError: "Лимит IP Достигнут: Максимум 5 бесплатных голосов в день для вашей сети.",
    voteSuccess: "Ваш голос успешно засчитан!",
    superVoteSuccess: "Super Vote (+5) успешно использован!",
    
    joinTitle: "Присоединяйтесь к Чемпионату SpiderQueens",
    joinSubtitle: "Покажите свой косплей, найдите фанатов и выиграйте $1,250!",
    fullName: "Полное Имя",
    nickname: "Никнейм Косплеера",
    instagramHandle: "Профиль Instagram",
    characterName: "Персонаж / Костюм",
    photoUrl: "Ссылка На Фото Косплея",
    photoUrlPlaceholder: "https://images.unsplash.com/... или ссылка на фото",
    bio: "О Себе / История Костюма",
    submitApplication: "Отправить Заявку",
    applicationPending: "Ваша заявка находится на рассмотрении модератора.",
    applicationSubmittedMsg: "Заявка отправлена! После проверки администратором вы появитесь на Арене.",
    
    leaderboardTitle: "Топ 10 Королев Косплея",
    leaderboardSubtitle: "Лидеры голосования в борьбе за главный приз $1,250 в этом месяце.",
    rank: "Место",
    cosplayer: "Косплеер",
    character: "Персонаж",
    votes: "Всего Голосов",
    action: "Действие",
    viewInstagram: "Instagram Профиль",
    
    storeTitle: "Магазин Super Votes",
    storeSubtitle: "Поддержите любимого косплеера силой 5x без суточных ограничений IP!",
    superVotesBalance: "Ваши Super Votes",
    buyVotes: "Купить Сейчас",
    payCreditCard: "Банковская Карта (Мгновенно)",
    payCrypto: "Криптовалюта (USDT / BTC / ETH)",
    cardNumber: "Номер Карты",
    cardExpiry: "ММ/ГГ",
    cardCvc: "CVC",
    cardName: "Имя На Карте",
    payNow: "Оплатить и Начислить",
    cryptoInstruction: "Переведите сумму на указанный кошелек и введите Hash транзакции ниже.",
    selectCrypto: "Выберите Криптовалюту",
    sendToWallet: "Адрес Кошелька",
    copyAddress: "Скопировать",
    copied: "Скопировано!",
    txHashLabel: "Хеш Транзакции (TX ID) / Примечание",
    txHashPlaceholder: "Например, 0x8f2d... или TRC20 TX Hash",
    submitCryptoPayment: "Отправить На Проверку",
    paymentSubmittedMsg: "Платеж отправлен! Голоса будут зачислены сразу после одобрения администратором.",
    
    adminTitle: "Панель Управления",
    adminSubtitle: "Проверка заявок, одобрение крипто-платежей и управление турниром.",
    pendingApplicants: "Заявки На Проверку",
    pendingTransactions: "Ожидающие Платежи",
    activeContestants: "Одобренные Участники",
    approve: "Одобрить",
    reject: "Отклонить",
    approved: "Одобрено",
    rejected: "Отклонено",
    status: "Статус",
    userEmail: "Email Пользователя",
    amount: "Сумма",
    paymentMethod: "Метод Оплаты",
    txHash: "TX Хеш / Заметка",
    date: "Дата",
    noPendingApplicants: "В данный момент нет новых заявок.",
    noPendingTransactions: "Нет платежей, ожидающих проверки.",
    adminModeToggle: "Режим Администратора",
    adminModeActive: "Статус Админа: ВКЛЮЧЕН",
    adminModeGuest: "Статус Админа: ВЫКЛЮЧЕН (Нажмите для переключения)",
    statsTotalVotes: "Всего Отдано Голосов",
    statsTotalContestants: "Активных Участников",
    statsPendingApps: "Заявок На Проверку",
    statsPendingPayments: "Платежей На Проверку",
    copySqlScript: "Скопировать Supabase SQL Скрипт",

    authModalTitleRegister: "Создать Аккаунт",
    authModalTitleLogin: "С Возвращением",
    authModalSubtitleRegister: "Зарегистрируйтесь, чтобы голосовать или участвовать!",
    authModalSubtitleLogin: "Войдите под своим аккаунтом для продолжения",
    authTabRegister: "Регистрация",
    authTabLogin: "Вход",
    accountTypeLabel: "Выберите Тип Аккаунта",
    voterRoleTitle: "Голосующий (Фанат)",
    voterRoleDesc: "Голосуйте за любимых косплееров",
    contestantRoleTitle: "Участник",
    contestantRoleDesc: "Загрузите фото и боритесь за $1,250",
    fullNameLabel: "Полное Имя",
    fullNamePlaceholder: "Например, Елена Ростова",
    emailLabel: "Email Адрес",
    passwordLabel: "Пароль",
    submitRegister: "Зарегистрироваться",
    authAlreadyRegistered: "Этот email уже зарегистрирован. Войдите или сбросьте пароль.",
    submitLogin: "Войти в Аккаунт",

    prizeBannerTitle: "Ежемесячные Награды Чемпионата",
    firstPlacePrize: "$1,000 НАЛИЧНЫМИ (1 Место)",
    secondPlacePrize: "$250 Подарочный Сертификат (2 Место)",
    thirdPlacePrize: "$50 Подарочный Сертификат (3 Место)",

    faqNav: "Частые Вопросы (FAQ)",
    rulesNav: "Правила и Условия",
    privacyNav: "Политика Конфиденциальности",
    faqQ1: "Как работает система голосования?",
    faqA1: "Каждый IP получает 5 бесплатных голосов ежедневно. Super Vote из магазина дают 5x силу и обходят IP-лимиты.",
    faqQ2: "Когда выплачиваются призы?",
    faqA2: "В последний день каждого месяца топ-3 косплеера получают $1,000, $250 и $50.",
    faqQ3: "Как подать заявку косплееру?",
    faqA3: "Заполните форму во вкладке 'Подать Заявку' с фото и Instagram. После одобрения ваш профиль появится на Арене.",
    rulesR1: "1. Оригинальность: Все фото должны быть вашими собственными работами.",
    rulesR2: "2. Честная игра: Боты, накрутка и VPN строго запрещены и ведут к дисквалификации.",
    rulesR3: "3. Уважение: Оскорбления и неприемлемый контент немедленно удаляются.",
    privacyP1: "1. Использование данных: Email и данные используются только для коммуникации и транзакций.",
    privacyP2: "2. Безопасность IP: IP-адреса анонимизируются для честных лимитов.",
    privacyP3: "3. Безопасность платежей: Все платежи защищены шифрованием.",

    userProfileTitle: "Мой Профиль",
    userProfileSubtitle: "Детали Вашего Аккаунта SpiderQueens",
    userRoleLabel: "Тип Аккаунта",
    roleVoter: "Голосующий (Фанат)",
    roleContestant: "Участник",
    superVoteCredits: "Баланс Super Vote",
    logoutBtn: "Выйти",
    loginRegisterBtn: "Войти / Регистрация"
  },
  th: {
    appName: "SpiderQueens",
    tagline: "การแข่งขันคอสเพลย์และชุดแต่งกายระดับโลก",
    prizePool: "เงินรางวัลประจำเดือน",
    prizeDetails: "$1,000 เงินสด + $250 บัตรของขวัญ",
    countdownTitle: "นับถอยหลังการแจกรางวัล",
    days: "วัน",
    hours: "ชั่วโมง",
    minutes: "นาที",
    seconds: "วินาที",
    
    navClash: "สนามโหวต",
    navLeaderboard: "ตารางผู้นำ",
    navBrowse: "ผู้เข้าแข่งขันทั้งหมด",
    navJoin: "สมัครเข้าแข่งขัน",
    navStore: "ร้านค้า Super Vote",
    navAdmin: "แผงควบคุมแอดมิน",
    navSqlSchema: "Supabase SQL",
    
    headToHead: "การดวลคอสเพลย์แบบ 1 ต่อ 1",
    voteFree: "โหวตฟรี",
    superVote: "Super Vote",
    superVoteWorth: "พลังโหวต x5!",
    nextPair: "คู่ถัดไป",
    dailyFreeVotesLeft: "โหวตฟรีที่เหลือประจำวัน",
    outOfFreeVotes: "คุณใช้สิทธิ์โหวตฟรี 5 ครั้งสำหรับ IP นี้ครบแล้ว!",
    getSuperVotesNow: "ซื้อ Super Votes เพื่อโหวตต่อ",
    vs: "VS",
    totalVotes: "คะแนนโหวต",
    
    selfVoteError: "ละเมิดกฎ: คุณไม่สามารถโหวตให้คอสเพลย์ของตัวเองได้!",
    ipLimitError: "จำกัด IP: จำกัดโหวตฟรีสูงสุด 5 ครั้งต่อวันสำหรับเครือข่ายของคุณ",
    voteSuccess: "บันทึกคะแนนโหวตเรียบร้อยแล้ว!",
    superVoteSuccess: "ใช้ Super Vote (+5) สำเร็จ!",
    
    joinTitle: "เข้าร่วมการแข่งขัน SpiderQueens",
    joinSubtitle: "โชว์ผลงานคอสเพลย์ของคุณ สร้างฐานแฟนคลับ และชิงเงินรางวัลรวม $1,250!",
    fullName: "ชื่อ-นามสกุล",
    nickname: "ชื่อฉายาคอสเพลย์",
    instagramHandle: "บัญชี Instagram",
    characterName: "ตัวละคร / ชื่อชุด",
    photoUrl: "ลิงก์รูปภาพคอสเพลย์",
    photoUrlPlaceholder: "https://images.unsplash.com/... หรือ URL รูปภาพ",
    bio: "ประวัติย่อ / เรื่องราวคอสเพลย์",
    submitApplication: "ส่งใบสมัคร",
    applicationPending: "ใบสมัครของคุณกำลังอยู่ในการตรวจสอบโดยทีมงาน",
    applicationSubmittedMsg: "ส่งใบสมัครเรียบร้อยแล้ว! เมื่อได้รับการอนุมัติจากแอดมิน โปรไฟล์จะปรากฏในสนามแข่ง",
    
    leaderboardTitle: "Top 10 ควีนคอสเพลย์",
    leaderboardSubtitle: "คอสเพลเยอร์ที่มีคะแนนสูงสุดในการชิงเงินรางวัลรวม $1,250 ประจำเดือนนี้",
    rank: "อันดับ",
    cosplayer: "คอสเพลเยอร์",
    character: "ตัวละคร",
    votes: "คะแนนรวม",
    action: "การกระทำ",
    viewInstagram: "โปรไฟล์ Instagram",
    
    storeTitle: "ร้านค้า Super Vote",
    storeSubtitle: "ซัพพอร์ตคอสเพลเยอร์คนโปรดด้วยพลังโหวต 5 เท่า โดยไม่มีข้อจำกัด IP รายวัน!",
    superVotesBalance: "Super Votes ของคุณ",
    buyVotes: "ซื้อเลย",
    payCreditCard: "บัตรเครดิต (รับโหวตทันที)",
    payCrypto: "คริปโทเคอร์เรนซี (USDT / BTC / ETH)",
    cardNumber: "หมายเลขบัตร",
    cardExpiry: "ดด/ปป",
    cardCvc: "CVC",
    cardName: "ชื่อบนบัตร",
    payNow: "ชำระเงินและรับคะแนนโหวต",
    cryptoInstruction: "โอนเงินตามจำนวนเข้ากระเป๋าทางการ แล้วกรอก Transaction Hash ด้านล่าง",
    selectCrypto: "เลือกสกุลเงินคริปโท",
    sendToWallet: "ที่อยู่กระเป๋าโอนเงิน",
    copyAddress: "คัดลอกที่อยู่",
    copied: "คัดลอกแล้ว!",
    txHashLabel: "Transaction Hash (TX ID) / หมายเหตุ",
    txHashPlaceholder: "เช่น 0x8f2d... หรือ TRC20 TX Hash",
    submitCryptoPayment: "ส่งแจ้งชำระเงินเพื่อตรวจสอบ",
    paymentSubmittedMsg: "ส่งการแจ้งชำระเงินแล้ว! คะแนน Super Vote จะถูกเพิ่มให้ทันทีหลังแอดมินอนุมัติ",
    
    adminTitle: "ศูนย์ควบคุมแอดมิน",
    adminSubtitle: "ตรวจสอบใบสมัคร อนุมัติการชำระเงินคริปโท และจัดการการแข่งขัน",
    pendingApplicants: "ใบสมัครที่รอตรวจสอบ",
    pendingTransactions: "การชำระเงินที่รออนุมัติ",
    activeContestants: "คอสเพลเยอร์ที่ได้รับการอนุมัติ",
    approve: "อนุมัติ",
    reject: "ปฏิเสธ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธแล้ว",
    status: "สถานะ",
    userEmail: "อีเมลผู้ใช้",
    amount: "จำนวนเงิน",
    paymentMethod: "วิธีการชำระเงิน",
    txHash: "TX Hash / หมายเหตุ",
    date: "วันที่",
    noPendingApplicants: "ไม่มีใบสมัครใหม่ในขณะนี้",
    noPendingTransactions: "ไม่มีรายการชำระเงินที่รอการตรวจสอบ",
    adminModeToggle: "โหมดแอดมิน",
    adminModeActive: "สถานะแอดมิน: เปิดใช้งาน",
    adminModeGuest: "สถานะแอดมิน: ปิดใช้งาน (คลิกเพื่อสลับ)",
    statsTotalVotes: "จำนวนโหวตทั้งหมด",
    statsTotalContestants: "คอสเพลเยอร์ที่ลงแข่ง",
    statsPendingApps: "ใบสมัครรอตรวจ",
    statsPendingPayments: "การชำระเงินรอตรวจ",
    copySqlScript: "คัดลอกโค้ด Supabase SQL Schema",

    authModalTitleRegister: "สร้างบัญชีผู้ใช้",
    authModalTitleLogin: "ยินดีต้อนรับกลับ",
    authModalSubtitleRegister: "ลงทะเบียนเพื่อโหวตหรือเข้าร่วมแข่งขัน!",
    authModalSubtitleLogin: "เข้าสู่ระบบด้วยบัญชีเดิมเพื่อดำเนินการต่อ",
    authTabRegister: "ลงทะเบียน",
    authTabLogin: "เข้าสู่ระบบ",
    accountTypeLabel: "เลือกประเภทบัญชี",
    voterRoleTitle: "ผู้โหวต (แฟนคลับ)",
    voterRoleDesc: "โหวตให้คอสเพลเยอร์ที่คุณชื่นชอบ",
    contestantRoleTitle: "ผู้เข้าแข่งขัน",
    contestantRoleDesc: "อัปโหลดคอสเพลย์และชิงรางวัล $1,250",
    fullNameLabel: "ชื่อ-นามสกุล",
    fullNamePlaceholder: "เช่น Elena Rostova",
    emailLabel: "อีเมล",
    passwordLabel: "รหัสผ่าน",
    submitRegister: "ลงทะเบียนและเริ่มต้น",
    authAlreadyRegistered: "อีเมลนี้ถูกลงทะเบียนแล้ว กรุณาเข้าสู่ระบบหรือรีเซ็ตรหัสผ่าน",
    submitLogin: "เข้าสู่ระบบ",

    prizeBannerTitle: "เงินรางวัลประจำเดือน",
    firstPlacePrize: "$1,000 เงินสด (อันดับ 1)",
    secondPlacePrize: "$250 บัตรของขวัญ (อันดับ 2)",
    thirdPlacePrize: "$50 บัตรของขวัญ (อันดับ 3)",

    faqNav: "คำถามที่พบบ่อย",
    rulesNav: "กติกาและเงื่อนไข",
    privacyNav: "นโยบายความเป็นส่วนตัว",
    faqQ1: "ระบบโหวตทำงานอย่างไร?",
    faqA1: "แต่ละ IP จะได้รับโหวตฟรี 5 ครั้งต่อวัน Super Vote จากร้านค้าจะมีพลังโหวต 5 เท่าและไม่จำกัด IP",
    faqQ2: "แจกรางวัลเมื่อใด?",
    faqA2: "วันสุดท้ายของทุกเดือนเมื่อเวลานับถอยหลังสิ้นสุด อันดับ 1-3 จะได้รับ $1,000, $250 และ $50 ตามลำดับ",
    faqQ3: "จะสมัครเป็นคอสเพลเยอร์ได้อย่างไร?",
    faqA3: "กรอกแบบฟอร์มในแท็บ 'สมัครเข้าแข่งขัน' พร้อมรูปถ่ายและ Instagram เมื่อได้รับการอนุมัติ โปรไฟล์ของคุณจะปรากฏในอารีนา",
    rulesR1: "1. ความเป็นต้นฉบับ: รูปถ่ายคอสเพลย์ทั้งหมดต้องเป็นผลงานของคุณเองหรือได้รับอนุญาตอย่างถูกต้อง",
    rulesR2: "2. การแข่งขันที่ยุติธรรม: ห้ามใช้บอท, VPN หรือการทุจริตโหวตโดยเด็ดขาด",
    rulesR3: "3. การเคารพชุมชน: ข้อความสร้างความเกลียดชังหรือเนื้อหาที่ไม่เหมาะสมจะถูกลบทันที",
    privacyP1: "1. การใช้ข้อมูล: อีเมลและข้อมูลโปรไฟล์ใช้เพื่อการแข่งขันและ Super Vote เท่านั้น",
    privacyP2: "2. การปกป้อง IP: IP address ถูกแปลงเป็นนิรนามเพื่อคำนวณสิทธิ์โหวตฟรีเท่านั้น",
    privacyP3: "3. ความปลอดภัยในการชำระเงิน: การชำระเงินทั้งหมดได้รับการเข้ารหัสอย่างปลอดภัย",

    userProfileTitle: "โปรไฟล์ของฉัน",
    userProfileSubtitle: "รายละเอียดบัญชี SpiderQueens ของคุณ",
    userRoleLabel: "ประเภทบัญชี",
    roleVoter: "ผู้โหวต (แฟนคลับ)",
    roleContestant: "ผู้เข้าแข่งขัน",
    superVoteCredits: "ยอดคงเหลือ Super Vote",
    logoutBtn: "ออกจากระบบ",
    loginRegisterBtn: "เข้าสู่ระบบ / ลงทะเบียน"
  },
  ja: {
    appName: "SpiderQueens",
    tagline: "バイラルコスプレ＆コスチューム世界選手権",
    prizePool: "月間賞金プール",
    prizeDetails: "$1,000 キャッシュ + $250 ギフト券",
    countdownTitle: "賞金配布までのカウントダウン",
    days: "日",
    hours: "時間",
    minutes: "分",
    seconds: "秒",
    
    navClash: "バトルアリーナ",
    navLeaderboard: "リーダーボード",
    navBrowse: "全員を見る",
    navJoin: "コンテストに応募",
    navStore: "Super Vote ショップ",
    navAdmin: "管理者パネル",
    navSqlSchema: "Supabase SQL",
    
    headToHead: "コスプレ 1v1 バトルアリーナ",
    voteFree: "無料投票",
    superVote: "Super Vote",
    superVoteWorth: "5倍の投票力！",
    nextPair: "次のバトル",
    dailyFreeVotesLeft: "本日の残り無料投票数",
    outOfFreeVotes: "本日のIP無料投票（5回）をすべて使い切りました！",
    getSuperVotesNow: "Super Vote を購入して投票を続ける",
    vs: "VS",
    totalVotes: "票数",
    
    selfVoteError: "ルール違反：ご自身のコスプレ写真には投票できません！",
    ipLimitError: "IP制限：お使いのネットワークからは1日最大5回の無料投票までです。",
    voteSuccess: "投票が正常に記録されました！",
    superVoteSuccess: "Super Vote (+5) が正常に使用されました！",
    
    joinTitle: "SpiderQueens 選手権に参加しよう",
    joinSubtitle: "あなたのコスプレ作品を披露し、ファンを増やして賞金$1,250を掴み取ろう！",
    fullName: "氏名",
    nickname: "コスプレ名 (ニックネーム)",
    instagramHandle: "Instagram アカウント",
    characterName: "キャラクター / 衣装名",
    photoUrl: "コスプレ写真の画像URL",
    photoUrlPlaceholder: "https://images.unsplash.com/... または画像リンク",
    bio: "自己紹介 / コスプレのエピソード",
    submitApplication: "エントリーを送信",
    applicationPending: "ご応募内容は現在運営チームにて審査中です。",
    applicationSubmittedMsg: "応募完了！管理者の承認後、アリーナにプロフィールが表示されます。",
    
    leaderboardTitle: "トップ10 コスプレクイーン",
    leaderboardSubtitle: "今月の賞金$1,250をかけて競い合う最も人気のあるコスプレイヤー。",
    rank: "順位",
    cosplayer: "コスプレイヤー",
    character: "キャラクター",
    votes: "総得票数",
    action: "操作",
    viewInstagram: "Instagram プロフィール",
    
    storeTitle: "Super Vote ショップ",
    storeSubtitle: "1日のIP制限なし＆5倍の投票権で、推しのコスプレイヤーを応援しよう！",
    superVotesBalance: "保有 Super Votes",
    buyVotes: "今すぐ購入",
    payCreditCard: "クレジットカード (即時反映)",
    payCrypto: "暗号資産決済 (手動 USDT / BTC / ETH)",
    cardNumber: "カード番号",
    cardExpiry: "月/年",
    cardCvc: "CVC",
    cardName: "名義人氏名",
    payNow: "決済して投票権を追加",
    cryptoInstruction: "指定のウォレットアドレスに送金し、下にトランザクションハッシュを入力してください。",
    selectCrypto: "暗号資産を選択",
    sendToWallet: "送金先ウォレットアドレス",
    copyAddress: "アドレスをコピー",
    copied: "コピーしました！",
    txHashLabel: "トランザクションハッシュ (TX ID) / 備考",
    txHashPlaceholder: "例：0x8f2d... または TRC20 TX Hash",
    submitCryptoPayment: "確認のため支払いを送信",
    paymentSubmittedMsg: "お支払い通知を送信しました！管理者の承認後、Super Voteがアカウントに反映されます。",
    
    adminTitle: "管理者コントロールセンター",
    adminSubtitle: "応募内容の審査、暗号資産決済の承認、コンテストの管理を行います。",
    pendingApplicants: "承認待ちの応募",
    pendingTransactions: "承認待ちのお支払い",
    activeContestants: "承認済みコスプレイヤー",
    approve: "承認する",
    reject: "却下する",
    approved: "承認済み",
    rejected: "却下済み",
    status: "ステータス",
    userEmail: "ユーザーEmail",
    amount: "金額",
    paymentMethod: "決済方法",
    txHash: "TXハッシュ / 備考",
    date: "日時",
    noPendingApplicants: "現在、承認待ちの応募はありません。",
    noPendingTransactions: "確認待ちの支払い請求はありません。",
    adminModeToggle: "管理者アクセスモード",
    adminModeActive: "管理者ステータス：有効",
    adminModeGuest: "管理者ステータス：無効（クリックで切替）",
    statsTotalVotes: "総投票数",
    statsTotalContestants: "参加中のクイーン",
    statsPendingApps: "審査待ち応募",
    statsPendingPayments: "確認待ち決済",
    copySqlScript: "Supabase SQL スクリプトをコピー",

    authModalTitleRegister: "アカウント作成",
    authModalTitleLogin: "おかえりなさい",
    authModalSubtitleRegister: "投票やコンテスト参加のために登録しよう！",
    authModalSubtitleLogin: "既存のアカウントでログインしてください",
    authTabRegister: "新規登録",
    authTabLogin: "ログイン",
    accountTypeLabel: "アカウント種別を選択",
    voterRoleTitle: "投票者 (ファン)",
    voterRoleDesc: "推しのコスプレイヤーに投票する",
    contestantRoleTitle: "コンテスト参加者",
    contestantRoleDesc: "写真を投稿して賞金$1,250に挑戦",
    fullNameLabel: "氏名",
    fullNamePlaceholder: "例：Elena Rostova",
    emailLabel: "メールアドレス",
    passwordLabel: "パスワード",
    submitRegister: "登録して始める",
    authAlreadyRegistered: "このメールアドレスは既に登録されています。ログインするかパスワードをリセットしてください。",
    submitLogin: "ログイン",

    prizeBannerTitle: "月間チャンピオンシップ賞金",
    firstPlacePrize: "$1,000 キャッシュ (1位)",
    secondPlacePrize: "$250 ギフト券 (2位)",
    thirdPlacePrize: "$50 ギフト券 (3位)",

    faqNav: "よくある質問 (FAQ)",
    rulesNav: "利用規約・ルール",
    privacyNav: "プライバシーポリシー",
    faqQ1: "投票システムはどのように機能しますか？",
    faqA1: "各IPアドレスごとに毎日5回の無料投票権が付与されます。ショップの Super Vote は5倍の投票力があり、IP制限も回避できます。",
    faqQ2: "賞金はいつ支給されますか？",
    faqA2: "毎月最終日のカウントダウン終了時に、1位〜3位のコスプレイヤーにそれぞれ $1,000、$250、$50 が贈呈されます。",
    faqQ3: "コスプレイヤーとして参加するには？",
    faqA3: "「コンテストに応募」タブから写真とInstagramアカウントを入力して応募してください。審査通過後にアリーナに掲載されます。",
    rulesR1: "1. オリジナリティ：投稿する写真はご自身のコスプレ作品または使用許諾を得たものに限ります。",
    rulesR2: "2. フェアプレイ：自動ボット、VPN不正、不正投票は固く禁止されており、即時失格となります。",
    rulesR3: "3. コミュニティの尊重：誹謗中傷や不適切なコンテンツは即座に削除されます。",
    privacyP1: "1. データの利用：メールアドレス等の情報は大会運営および Super Vote 付与にのみ使用されます。",
    privacyP2: "2. IPアドレスの保護：IPアドレスは毎日の無料投票上限計算のために匿名化して処理されます。",
    privacyP3: "3. 決済の安全性：クレジットカードおよび暗号資産決済は暗号化された安全な決済経由で処理されます。",

    userProfileTitle: "マイプロフィール",
    userProfileSubtitle: "SpiderQueens アカウント詳細",
    userRoleLabel: "アカウント種別",
    roleVoter: "投票者 (ファン)",
    roleContestant: "コンテスト参加者",
    superVoteCredits: "Super Vote 残高",
    logoutBtn: "ログアウト",
    loginRegisterBtn: "ログイン / 新規登録"
  },
  zh: {
    appName: "SpiderQueens",
    tagline: "病毒式 Cosplay & 服装全球锦标赛",
    prizePool: "本月奖金池",
    prizeDetails: "$1,000 现金 + $250 礼品卡",
    countdownTitle: "奖金发放倒计时",
    days: "天",
    hours: "小时",
    minutes: "分钟",
    seconds: "秒",
    
    navClash: "对决擂台",
    navLeaderboard: "排行榜",
    navBrowse: "全部选手",
    navJoin: "报名参赛",
    navStore: "Super Vote 商店",
    navAdmin: "管理员后台",
    navSqlSchema: "Supabase SQL",
    
    headToHead: "Cosplay 1v1 对决擂台",
    voteFree: "免费投票",
    superVote: "Super Vote",
    superVoteWorth: "5倍票力！",
    nextPair: "下一组对决",
    dailyFreeVotesLeft: "今日剩余免费票数",
    outOfFreeVotes: "您已用完该 IP 今日的 5 次免费投票机会！",
    getSuperVotesNow: "购买 Super Votes 继续投票",
    vs: "VS",
    totalVotes: "总票数",
    
    selfVoteError: "违反规则：严禁为自己的 Cosplay 作品投票！",
    ipLimitError: "IP 限制：每个网络每天最多可投 5 票免费票。",
    voteSuccess: "投票成功！",
    superVoteSuccess: "Super Vote (+5) 投递成功！",
    
    joinTitle: "加入 SpiderQueens 锦标赛",
    joinSubtitle: "展示你的 Cosplay 艺术，吸引粉丝，争夺 $1,250 大奖池！",
    fullName: "真实姓名",
    nickname: "Cosplay 昵称",
    instagramHandle: "Instagram 账号",
    characterName: "角色 / 服装名称",
    photoUrl: "Cosplay 照片 URL",
    photoUrlPlaceholder: "https://images.unsplash.com/... 或图片链接",
    bio: "个人简介 / Cosplay 故事",
    submitApplication: "提交参赛申请",
    applicationPending: "您的申请正在等待管理员审核。",
    applicationSubmittedMsg: "申请已提交！管理员审核通过后，您的资料将出现在擂台中。",
    
    leaderboardTitle: "Top 10 Cosplay 女王",
    leaderboardSubtitle: "争夺本月 $1,250 大奖池得票最高的 Cosplayer。",
    rank: "排名",
    cosplayer: "Cosplayer",
    character: "饰演角色",
    votes: "总票数",
    action: "操作",
    viewInstagram: "Instagram 主页",
    
    storeTitle: "Super Vote 商店",
    storeSubtitle: "用 5 倍投票权重支持你喜欢的 Cosplayer，且不受每日 IP 限制！",
    superVotesBalance: "您的 Super Votes 余额",
    buyVotes: "立即购买",
    payCreditCard: "信用卡支付（即时到账）",
    payCrypto: "加密货币支付（手动 USDT / BTC / ETH）",
    cardNumber: "卡号",
    cardExpiry: "月/年",
    cardCvc: "CVC",
    cardName: "持卡人姓名",
    payNow: "支付并充值票数",
    cryptoInstruction: "请将对应金额转入我们的官方钱包地址，并在下方填写交易 Hash。",
    selectCrypto: "选择加密货币",
    sendToWallet: "收款钱包地址",
    copyAddress: "复制地址",
    copied: "已复制！",
    txHashLabel: "交易 Hash (TX ID) / 凭证备注",
    txHashPlaceholder: "例如：0x8f2d... 或 TRC20 TX Hash",
    submitCryptoPayment: "提交交易等待审核",
    paymentSubmittedMsg: "支付凭证已提交！管理员审核通过后，Super Vote 额度将自动注入您的账户。",
    
    adminTitle: "管理员控制中心",
    adminSubtitle: "审核选手申请、确认加密货币支付并管理锦标赛状态。",
    pendingApplicants: "待审核申请",
    pendingTransactions: "待确认支付",
    activeContestants: "已审核选手",
    approve: "批准",
    reject: "拒绝",
    approved: "已批准",
    rejected: "已拒绝",
    status: "状态",
    userEmail: "用户邮箱",
    amount: "金额",
    paymentMethod: "支付方式",
    txHash: "TX Hash / 备注",
    date: "日期",
    noPendingApplicants: "暂无待审核的选手申请。",
    noPendingTransactions: "暂无等待确认的支付订单。",
    adminModeToggle: "管理员权限模式",
    adminModeActive: "管理员状态：已启用",
    adminModeGuest: "管理员状态：已禁用（点击切换）",
    statsTotalVotes: "总投出票数",
    statsTotalContestants: "参赛选手数",
    statsPendingApps: "待审核申请",
    statsPendingPayments: "待确认支付",
    copySqlScript: "复制 Supabase SQL 数据库脚本",

    authModalTitleRegister: "创建账号",
    authModalTitleLogin: "欢迎回来",
    authModalSubtitleRegister: "注册以进行投票或报名参赛！",
    authModalSubtitleLogin: "使用现有账号登录以继续",
    authTabRegister: "注册",
    authTabLogin: "登录",
    accountTypeLabel: "选择账号类型",
    voterRoleTitle: "投票者 (粉丝)",
    voterRoleDesc: "为你喜欢的 Cosplayer 投票",
    contestantRoleTitle: "参赛选手",
    contestantRoleDesc: "上传 Cosplay 作品角逐 $1,250 大奖",
    fullNameLabel: "真实姓名",
    fullNamePlaceholder: "例如：Elena Rostova",
    emailLabel: "邮箱地址",
    passwordLabel: "密码",
    submitRegister: "注册并开始",
    authAlreadyRegistered: "该邮箱已注册。请登录或重置密码。",
    submitLogin: "登录账号",

    prizeBannerTitle: "本月锦标赛大奖池",
    firstPlacePrize: "$1,000 现金大奖 (第 1 名)",
    secondPlacePrize: "$250 礼品卡 (第 2 名)",
    thirdPlacePrize: "$50 礼品卡 (第 3 名)",

    faqNav: "常见问题",
    rulesNav: "规则与条款",
    privacyNav: "隐私政策",
    faqQ1: "投票系统是如何运作的？",
    faqA1: "每个 IP 地址每天可获得 5 票免费投票额度。从商店购买的 Super Vote 拥有 5 倍投票权重且不受 IP 限制。",
    faqQ2: "奖金何时发放？",
    faqA2: "每月最后一天的倒计时结束时，排行榜前 3 名的 Cosplayer 将分别获得 $1,000 现金、$250 礼品卡和 $50 礼品卡。",
    faqQ3: "如何作为 Cosplayer 参赛？",
    faqA3: "在“报名参赛”标签页中填写申请表，上传您的 Cosplay 照片及 Instagram 账号。审核通过后，您的资料将出现在擂台中。",
    rulesR1: "1. 原创性与版权：所有上传的 Cosplay 照片必须为参赛者本人作品或已获合法授权。",
    rulesR2: "2. 公平竞争规则：严禁使用自动脚本、VPN 刷票或虚假投票，违者将被取消参赛资格。",
    rulesR3: "3. 社区尊重：禁止任何人身攻击、仇恨言论或不当内容，违规内容将被立即删除。",
    privacyP1: "1. 数据使用：您的邮箱及个人资料仅用于锦标赛通知及 Super Vote 额度发货。",
    privacyP2: "2. IP 地址保护：IP 地址仅经匿名化处理后用于计算每日免费投票额度，绝不泄露。",
    privacyP3: "3. 支付安全：所有信用卡及加密货币支付均通过加密通道安全处理。",

    userProfileTitle: "个人资料",
    userProfileSubtitle: "您的 SpiderQueens 账号详情",
    userRoleLabel: "账号类型",
    roleVoter: "投票者 (粉丝)",
    roleContestant: "参赛选手",
    superVoteCredits: "Super Vote 余额",
    logoutBtn: "退出登录",
    loginRegisterBtn: "登录 / 注册"
  },
  ko: {
    appName: "SpiderQueens",
    tagline: "바이럴 코스프레 & 코스튬 월드 챔피언십",
    prizePool: "월간 상금 풀",
    prizeDetails: "$1,000 현금 + $250 기프트카드",
    countdownTitle: "상금 지급까지 남은 시간",
    days: "일",
    hours: "시간",
    minutes: "분",
    seconds: "초",
    
    navClash: "대결 아레나",
    navLeaderboard: "리더보드",
    navBrowse: "전체 참가자",
    navJoin: "대회 참가 신청",
    navStore: "Super Vote 상점",
    navAdmin: "관리자 패널",
    navSqlSchema: "Supabase SQL",
    
    headToHead: "코스프레 1v1 대결 아레나",
    voteFree: "무료 투표",
    superVote: "Super Vote",
    superVoteWorth: "5배 투표 파워!",
    nextPair: "다음 대결",
    dailyFreeVotesLeft: "오늘 남은 무료 투표 횟수",
    outOfFreeVotes: "해당 IP의 오늘 무료 투표 5회를 모두 사용하셨습니다!",
    getSuperVotesNow: "Super Vote 구매하고 계속 투표하기",
    vs: "VS",
    totalVotes: "총 투표수",
    
    selfVoteError: "규칙 위반: 자신의 코스프레 사진에는 투표할 수 없습니다!",
    ipLimitError: "IP 제한: 해당 네트워크에서 하루 최대 5회의 무료 투표만 가능합니다.",
    voteSuccess: "투표가 성공적으로 반영되었습니다!",
    superVoteSuccess: "Super Vote (+5)가 성공적으로 투표되었습니다!",
    
    joinTitle: "SpiderQueens 챔피언십에 도전하세요",
    joinSubtitle: "당신의 코스프레 작품을 선보이고 팬을 모아 $1,250 상금에 도전하세요!",
    fullName: "성함",
    nickname: "코스프레 닉네임",
    instagramHandle: "인스타그램 계정",
    characterName: "캐릭터 / 의상 명칭",
    photoUrl: "코스프레 사진 이미지 URL",
    photoUrlPlaceholder: "https://images.unsplash.com/... 또는 이미지 링크",
    bio: "소개글 / 코스프레 스토리",
    submitApplication: "참가 신청서 제출",
    applicationPending: "신청서가 운영팀에서 검토 중입니다.",
    applicationSubmittedMsg: "신청 완료! 관리자 승인 후 아레나에 프로필이 등록됩니다.",
    
    leaderboardTitle: "Top 10 코스프레 퀸",
    leaderboardSubtitle: "이번 달 $1,250 상금을 두고 경쟁하는 상위 코스플레이어입니다.",
    rank: "순위",
    cosplayer: "코스플레이어",
    character: "캐릭터",
    votes: "총 득표수",
    action: "작업",
    viewInstagram: "인스타그램 프로필",
    
    storeTitle: "Super Vote 상점",
    storeSubtitle: "일일 IP 제한 없이 5배의 투표 권한으로 최애 코스플레이어를 응원하세요!",
    superVotesBalance: "보유 Super Votes",
    buyVotes: "지금 구매",
    payCreditCard: "신용카드 (즉시 반영)",
    payCrypto: "암호화폐 결제 (수동 USDT / BTC / ETH)",
    cardNumber: "카드 번호",
    cardExpiry: "MM/YY",
    cardCvc: "CVC",
    cardName: "카드 소유자 이름",
    payNow: "결제 및 투표권 충전",
    cryptoInstruction: "지정된 지갑 주소로 송금 후 거래 Hash(TX ID)를 아래에 입력해주세요.",
    selectCrypto: "암호화폐 선택",
    sendToWallet: "입금 지갑 주소",
    copyAddress: "주소 복사",
    copied: "복사됨!",
    txHashLabel: "거래 Hash (TX ID) / 영수증 메모",
    txHashPlaceholder: "예: 0x8f2d... 또는 TRC20 TX Hash",
    submitCryptoPayment: "결제 내역 검토 요청",
    paymentSubmittedMsg: "결제 요청이 제출되었습니다! 관리자 승인 후 Super Vote가 즉시 충전됩니다.",
    
    adminTitle: "관리자 제어 센터",
    adminSubtitle: "참가 신청 검토, 암호화폐 결제 승인 및 대회 상태를 관리합니다.",
    pendingApplicants: "승인 대기 신청",
    pendingTransactions: "승인 대기 결제",
    activeContestants: "승인된 코스플레이어",
    approve: "승인",
    reject: "거절",
    approved: "승인됨",
    rejected: "거절됨",
    status: "상태",
    userEmail: "사용자 이메일",
    amount: "금액",
    paymentMethod: "결제 방법",
    txHash: "TX Hash / 메모",
    date: "일시",
    noPendingApplicants: "현재 승인 대기 중인 신청이 없습니다.",
    noPendingTransactions: "검토 대기 중인 결제 내역이 없습니다.",
    adminModeToggle: "관리자 접근 모드",
    adminModeActive: "관리자 상태: 활성화됨",
    adminModeGuest: "관리자 상태: 비활성화됨 (클릭하여 전환)",
    statsTotalVotes: "총 투표수",
    statsTotalContestants: "참가 중인 퀸",
    statsPendingApps: "대기 중인 신청",
    statsPendingPayments: "대기 중인 결제",
    copySqlScript: "Supabase SQL 스크립트 복사",

    authModalTitleRegister: "계정 생성",
    authModalTitleLogin: "다시 오신 것을 환영합니다",
    authModalSubtitleRegister: "투표하거나 대회에 참가하려면 가입하세요!",
    authModalSubtitleLogin: "기존 계정으로 로그인하세요",
    authTabRegister: "회원가입",
    authTabLogin: "로그인",
    accountTypeLabel: "계정 유형 선택",
    voterRoleTitle: "투표자 (팬)",
    voterRoleDesc: "최애 코스플레이어에게 투표하기",
    contestantRoleTitle: "참가자",
    contestantRoleDesc: "코스프레 업로드 및 상금 경쟁",
    fullNameLabel: "성함",
    fullNamePlaceholder: "예: Elena Rostova",
    emailLabel: "이메일 주소",
    passwordLabel: "비밀번호",
    submitRegister: "가입하고 시작하기",
    authAlreadyRegistered: "이미 등록된 이메일입니다. 로그인하거나 비밀번호를 재설정하세요.",
    submitLogin: "로그인",

    prizeBannerTitle: "월간 챔피언십 상금",
    firstPlacePrize: "$1,000 현금 (1위)",
    secondPlacePrize: "$250 기프트카드 (2위)",
    thirdPlacePrize: "$50 기프트카드 (3위)",

    faqNav: "자주 묻는 질문",
    rulesNav: "규정 및 약관",
    privacyNav: "개인정보 처리방침",
    faqQ1: "투표 시스템은 어떻게 작동하나요?",
    faqA1: "각 IP 주소당 매일 5회의 무료 투표권이 부여됩니다. 상점에서 구매한 Super Vote는 5배의 투표 권한을 가지며 IP 제한을 우회합니다.",
    faqQ2: "상금은 언제 지급되나요?",
    faqA2: "매월 마지막 날 카운트다운이 종료되면 1~3위 코스플레이어에게 각각 $1,000, $250, $50가 지급됩니다.",
    faqQ3: "코스플레이어로 참가하려면 어떻게 하나요?",
    faqA3: "'대회 참가 신청' 탭에서 사진과 인스타그램을 입력하여 신청하세요. 승인 후 아레나에 프로필이 등록됩니다.",
    rulesR1: "1. 독창성 및 권리: 모든 사진은 본인의 코스프레 작품이거나 정당한 허가를 받은 것이어야 합니다.",
    rulesR2: "2. 공정 투표 규정: 자동 봇, VPN 조작, 부정 투표는 엄격히 금지되며 즉시 자격이 박탈됩니다.",
    rulesR3: "3. 커뮤니티 존중: 비하, 혐오 발언, 부적절한 콘텐츠는 즉시 삭제됩니다.",
    privacyP1: "1. 데이터 사용: 이메일 및 프로필 정보는 대회 안내 및 Super Vote 지급 목적으로만 사용됩니다.",
    privacyP2: "2. IP 보호: IP 주소는 공정한 무료 투표 계산을 위해 암호화 처리됩니다.",
    privacyP3: "3. 결제 보안: 신용카드 및 암호화폐 결제는 암호화된 보안 채널을 통해 처리됩니다.",

    userProfileTitle: "내 프로필",
    userProfileSubtitle: "SpiderQueens 계정 정보",
    userRoleLabel: "계정 유형",
    roleVoter: "투표자 (팬)",
    roleContestant: "참가자",
    superVoteCredits: "Super Vote 잔액",
    logoutBtn: "로그아웃",
    loginRegisterBtn: "로그인 / 회원가입"
  }
};
