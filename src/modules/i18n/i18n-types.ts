/**
 * RETZPOST BILINGUAL I18N SYSTEM TYPES
 * 
 * Supports seamless switching between Thai (th) and English (en).
 */

export type Locale = 'th' | 'en';

export interface NavTranslations {
  deskGroup: string;
  publishGroup: string;
  workspaceGroup: string;
  overview: string;
  pricing: string;
  contentLibrary: string;
  composer: string;
  publishingQueue: string;
  calendar: string;
  connectedChannels: string;
  teamPermissions: string;
  settings: string;
  docs: string;
  admin: string;
  landing: string;
  privacy: string;
  terms: string;
}

export interface CommonTranslations {
  save: string;
  saving: string;
  saved: string;
  cancel: string;
  delete: string;
  deleting: string;
  edit: string;
  create: string;
  view: string;
  refresh: string;
  search: string;
  filter: string;
  all: string;
  back: string;
  close: string;
  confirm: string;
  copy: string;
  copied: string;
  loading: string;
  success: string;
  error: string;
  warning: string;
  notice: string;
  learnMore: string;
  goToDashboard: string;
  signIn: string;
  signUp: string;
  signOut: string;
  switchLanguage: string;
}

export interface LandingTranslations {
  mastheadFolio: string;
  allDispatchesOperational: string;
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  startFreeTrialCta: string;
  viewPricingCta: string;
  noCreditCardRequired: string;
  trialBadge: string;
  featuresHeading: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  feature5Title: string;
  feature5Desc: string;
  feature6Title: string;
  feature6Desc: string;
  socialProofHeading: string;
  statsPostsCreated: string;
  statsActiveChannels: string;
  statsTokensCirculated: string;
  statsUptime: string;
}

export interface PricingTranslations {
  badge: string;
  heading: string;
  subtitle: string;
  billingMonthly: string;
  billingYearly: string;
  yearlyDiscountBadge: string;
  freeTrialBannerTitle: string;
  freeTrialBannerDesc: string;
  postTrialPromoToggle: string;
  postTrialPromoMonthly: string;
  postTrialPromoYearly: string;
  masterWalletHeading: string;
  masterWalletDesc: string;
  starterName: string;
  starterTagline: string;
  starterCta: string;
  soloName: string;
  soloTagline: string;
  soloCta: string;
  creatorName: string;
  creatorTagline: string;
  creatorCta: string;
  studioName: string;
  studioTagline: string;
  studioCta: string;
  agencyName: string;
  agencyTagline: string;
  agencyCta: string;
  tokenPackHeading: string;
  tokenPackSubtitle: string;
  perMonth: string;
  perYear: string;
  billedAnnually: string;
  seats: string;
  workspaces: string;
  channels: string;
  unlimitedPosts: string;
  tokensPerMonth: string;
}

export interface CheckoutTranslations {
  title: string;
  subtitle: string;
  orderSummary: string;
  planSubtotal: string;
  vat7: string;
  totalDueToday: string;
  trialZeroChargeNotice: string;
  promptPayTitle: string;
  promptPayScanNotice: string;
  uploadSlipTitle: string;
  uploadSlipInstruction: string;
  confirmPaymentCta: string;
  startTrialCta: string;
  taxInvoiceTitle: string;
  taxInvoiceCheckbox: string;
  companyName: string;
  taxId13Digits: string;
  branchId: string;
  paymentSuccessTitle: string;
  paymentSuccessDesc: string;
  goToDeskCta: string;
}

export interface SettingsTranslations {
  pageTitle: string;
  pageSubtitle: string;
  languageSectionTitle: string;
  languageSectionDesc: string;
  themeSectionTitle: string;
  themeSectionDesc: string;
  timezoneSectionTitle: string;
  timezoneSectionDesc: string;
  mediaAutomationTitle: string;
  mediaAutomationDesc: string;
  autoFrameLabel: string;
  autoFrameDesc: string;
  saveSettingsCta: string;
  settingsSavedNotice: string;
}

export interface DocsTranslations {
  docsHubTitle: string;
  docsHubSubtitle: string;
  guideTab: string;
  privacyTab: string;
  termsTab: string;
  searchPlaceholder: string;
  quickstartTitle: string;
  apiDocsTitle: string;
  troubleshootingTitle: string;
  needHelp: string;
  contactSupport: string;
}

export interface AdminTranslations {
  commandDeskTitle: string;
  commandDeskSubtitle: string;
  overviewTab: string;
  usersTab: string;
  invoicesTab: string;
  legalTab: string;
  circuitTab: string;
  settingsTab: string;
  refreshData: string;
  backToDesk: string;
}

export interface DeskTranslations {
  pageTitle: string;
  pageSubtitle: string;
  quickCompose: string;
  quickComposePlaceholder: string;
  publishNow: string;
  schedule: string;
  liveTelemetry: string;
  forceSync: string;
  tokenBalance: string;
  topUpTokens: string;
  kpiGrade: string;
  kpiCoaching: string;
  postDiagnosis: string;
  recentDispatches: string;
  emergencyRecall: string;
  channelsActive: string;
  viewAllDispatches: string;
  emptyDispatches: string;
  operationsTab: string;
  trackingTab: string;
  teamKpiTab: string;
}

export interface CreateTranslations {
  pageTitle: string;
  pageSubtitle: string;
  tabFeed: string;
  tabStory: string;
  tabReel: string;
  tabShort: string;
  captionLabel: string;
  captionPlaceholder: string;
  mediaLabel: string;
  uploadDropzone: string;
  autoFrameLabel: string;
  autoFrameDesc: string;
  channelSelector: string;
  schedulePicker: string;
  scheduleNow: string;
  scheduleLater: string;
  publishing: string;
  publishSuccess: string;
  draftSaved: string;
  saveDraft: string;
}

export interface CalendarTranslations {
  pageTitle: string;
  pageSubtitle: string;
  viewMonth: string;
  viewWeek: string;
  viewDay: string;
  today: string;
  filterChannels: string;
  newSchedule: string;
  scheduledPostsCount: string;
  emptySlot: string;
}

export interface ContentTranslations {
  pageTitle: string;
  pageSubtitle: string;
  tabAll: string;
  tabImages: string;
  tabVideos: string;
  tabTemplates: string;
  uploadMedia: string;
  searchPlaceholder: string;
  useTemplate: string;
  deleteMedia: string;
}

export interface QueueTranslations {
  pageTitle: string;
  pageSubtitle: string;
  statusAll: string;
  statusScheduled: string;
  statusPublishing: string;
  statusCompleted: string;
  statusFailed: string;
  emergencyRevoke: string;
  retryDispatch: string;
  queueEmpty: string;
}

export interface TeamTranslations {
  pageTitle: string;
  pageSubtitle: string;
  tabMembers: string;
  tabTokenTracker: string;
  inviteMember: string;
  roleOwner: string;
  roleEditor: string;
  roleDispatcher: string;
  roleViewer: string;
  tokenCap: string;
  tokenConsumed: string;
  topConsumer: string;
}

export interface AuthTranslations {
  loginTitle: string;
  loginSubtitle: string;
  registerTitle: string;
  registerSubtitle: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  nameLabel: string;
  rememberMe: string;
  forgotPasswordLink: string;
  signInButton: string;
  signUpButton: string;
  quickDemoLogin: string;
  noAccountYet: string;
  alreadyHaveAccount: string;
  termsNotice: string;
}

export interface AccountsTranslations {
  pageTitle: string;
  pageSubtitle: string;
  allChannels: string;
  connectNew: string;
  projectMapping: string;
  statusActive: string;
  statusBypassed: string;
  demoBadge: string;
  liveBadge: string;
  addFacebook: string;
  addInstagram: string;
  addTiktok: string;
  addYoutube: string;
  addX: string;
  addLemon8: string;
  searchPlaceholder: string;
  openAll: string;
  closeAll: string;
  createNewProject: string;
  connectChannel: string;
  loadDemo: string;
  clearDemo: string;
  channels: string;
  pages: string;
}

export interface LegalTranslations {
  privacyTitle: string;
  termsTitle: string;
  lastUpdated: string;
  ccaNotice: string;
  pdpaNotice: string;
}

export interface TranslationSchema {
  nav: NavTranslations;
  common: CommonTranslations;
  landing: LandingTranslations;
  pricing: PricingTranslations;
  checkout: CheckoutTranslations;
  settings: SettingsTranslations;
  docs: DocsTranslations;
  admin: AdminTranslations;
  desk: DeskTranslations;
  create: CreateTranslations;
  calendar: CalendarTranslations;
  content: ContentTranslations;
  queue: QueueTranslations;
  team: TeamTranslations;
  auth: AuthTranslations;
  accounts: AccountsTranslations;
  legal: LegalTranslations;
}
