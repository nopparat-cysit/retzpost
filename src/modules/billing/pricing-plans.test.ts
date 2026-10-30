import { describe, it, expect } from 'vitest';
import {
  PRICING_PLANS,
  TOKEN_TOPUP_PACKS,
  TOKEN_RATES,
  THEME_CONFIGS,
  calculatePlanPrice,
  calculatePromotionalPrice,
  calculateVat,
  isThemeUnlocked,
  canAffordTokens,
} from './pricing-plans';

describe('Pricing Plans & Token Economy (79 / 199 / 599 / 1490 Ladder)', () => {
  describe('Plan Price Calculations & Normal 25% Yearly Discount', () => {
    it('returns 0 for Starter plan on both monthly and yearly cycles', () => {
      expect(calculatePlanPrice('STARTER', 'MONTHLY')).toBe(0);
      expect(calculatePlanPrice('STARTER', 'YEARLY')).toBe(0);
    });

    it('returns ฿79/mo and ฿711/yr (~25% off) for Solo Press with 7-day trial', () => {
      expect(calculatePlanPrice('SOLO', 'MONTHLY')).toBe(79);
      expect(calculatePlanPrice('SOLO', 'YEARLY')).toBe(711); // 79 * 9 = 711
      expect(PRICING_PLANS.SOLO.has7DayTrial).toBe(true);
      expect(PRICING_PLANS.SOLO.trialDays).toBe(7);
      expect(PRICING_PLANS.SOLO.monthlyTokens).toBe(150);
    });

    it('returns ฿199/mo and ฿1,791/yr (~25% off) for Creator Team with 5 team seats', () => {
      expect(calculatePlanPrice('CREATOR', 'MONTHLY')).toBe(199);
      expect(calculatePlanPrice('CREATOR', 'YEARLY')).toBe(1791); // 199 * 9 = 1791
      expect(PRICING_PLANS.CREATOR.teamMembersLimit).toBe(5); // Guarantees <= 5 people team!
      expect(PRICING_PLANS.CREATOR.monthlyTokens).toBe(600);
      expect(PRICING_PLANS.CREATOR.workspacesLimit).toBe(3);
    });

    it('returns ฿599/mo and ฿5,391/yr (~25% off) for Studio Pro with 15 seats', () => {
      expect(calculatePlanPrice('STUDIO_PRO', 'MONTHLY')).toBe(599);
      expect(calculatePlanPrice('STUDIO_PRO', 'YEARLY')).toBe(5391); // 599 * 9 = 5391
      expect(PRICING_PLANS.STUDIO_PRO.teamMembersLimit).toBe(15);
      expect(PRICING_PLANS.STUDIO_PRO.monthlyTokens).toBe(2500);
    });

    it('returns ฿1,490/mo and ฿13,410/yr (~25% off) for Agency Syndicate with 50 seats', () => {
      expect(calculatePlanPrice('AGENCY', 'MONTHLY')).toBe(1490);
      expect(calculatePlanPrice('AGENCY', 'YEARLY')).toBe(13410); // 1490 * 9 = 13410
      expect(PRICING_PLANS.AGENCY.teamMembersLimit).toBe(50);
      expect(PRICING_PLANS.AGENCY.monthlyTokens).toBe(8000);
    });
  });

  describe('Post-Trial Promotional Offers (25% off 3mo / 35% off 1yr)', () => {
    it('calculates 25% discount for 3 months on Solo plan (฿59/mo)', () => {
      const promo = calculatePromotionalPrice('SOLO', 'MONTHLY', 'POST_TRIAL_MONTHLY_3MO');
      expect(promo.originalPrice).toBe(79);
      expect(promo.discountedPrice).toBe(59); // 79 * 0.75 = 59.25 -> 59
      expect(promo.discountRate).toBe(0.25);
    });

    it('calculates 35% discount for year 1 on Solo plan (฿616/yr)', () => {
      const promo = calculatePromotionalPrice('SOLO', 'YEARLY', 'POST_TRIAL_YEARLY_1YR');
      expect(promo.originalPrice).toBe(79 * 12); // 948
      expect(promo.discountedPrice).toBe(616); // 948 * 0.65 = 616.2 -> 616
      expect(promo.discountRate).toBe(0.35);
    });

    it('calculates 25% discount for 3 months on Creator Team plan (฿149/mo)', () => {
      const promo = calculatePromotionalPrice('CREATOR', 'MONTHLY', 'POST_TRIAL_MONTHLY_3MO');
      expect(promo.originalPrice).toBe(199);
      expect(promo.discountedPrice).toBe(149); // 199 * 0.75 = 149.25 -> 149
    });

    it('calculates 35% discount for year 1 on Creator Team plan (฿1,552/yr)', () => {
      const promo = calculatePromotionalPrice('CREATOR', 'YEARLY', 'POST_TRIAL_YEARLY_1YR');
      expect(promo.originalPrice).toBe(199 * 12); // 2388
      expect(promo.discountedPrice).toBe(1552); // 2388 * 0.65 = 1552.2 -> 1552
    });
  });

  describe('Thai VAT (7%) Calculation', () => {
    it('calculates 7% VAT accurately for Solo monthly (79 THB)', () => {
      const result = calculateVat(79);
      expect(result.subtotal).toBe(79);
      expect(result.vat).toBe(6); // 79 * 0.07 = 5.53 -> 6
      expect(result.total).toBe(85);
      expect(result.vatRateText).toBe('7%');
    });

    it('calculates 7% VAT accurately for Creator monthly (199 THB)', () => {
      const result = calculateVat(199);
      expect(result.subtotal).toBe(199);
      expect(result.vat).toBe(14); // 199 * 0.07 = 13.93 -> 14
      expect(result.total).toBe(213);
    });

    it('calculates 7% VAT accurately for Studio Pro yearly (5,391 THB)', () => {
      const result = calculateVat(5391);
      expect(result.subtotal).toBe(5391);
      expect(result.vat).toBe(377); // 5391 * 0.07 = 377.37 -> 377
      expect(result.total).toBe(5768);
    });
  });

  describe('Theme Preset Access & Gating', () => {
    it('allows STARTER tier to use NEWSPRINT theme only', () => {
      expect(isThemeUnlocked('NEWSPRINT', 'STARTER')).toBe(true);
      expect(isThemeUnlocked('MIDNIGHT', 'STARTER')).toBe(false);
      expect(isThemeUnlocked('MATCHA', 'STARTER')).toBe(false);
    });

    it('allows SOLO tier to access NEWSPRINT and MIDNIGHT (Dark Mode)', () => {
      expect(isThemeUnlocked('NEWSPRINT', 'SOLO')).toBe(true);
      expect(isThemeUnlocked('MIDNIGHT', 'SOLO')).toBe(true);
      expect(isThemeUnlocked('MATCHA', 'SOLO')).toBe(false);
    });

    it('allows CREATOR tier to access NEWSPRINT, MIDNIGHT, MATCHA, and TERRACOTTA', () => {
      expect(isThemeUnlocked('NEWSPRINT', 'CREATOR')).toBe(true);
      expect(isThemeUnlocked('MIDNIGHT', 'CREATOR')).toBe(true);
      expect(isThemeUnlocked('MATCHA', 'CREATOR')).toBe(true);
      expect(isThemeUnlocked('TERRACOTTA', 'CREATOR')).toBe(true);
      expect(isThemeUnlocked('INDIGO', 'CREATOR')).toBe(false);
    });

    it('allows STUDIO_PRO and AGENCY to access all 5 themes', () => {
      expect(isThemeUnlocked('INDIGO', 'STUDIO_PRO')).toBe(true);
      expect(isThemeUnlocked('INDIGO', 'AGENCY')).toBe(true);
    });
  });

  describe('Press Token Affordability & Rates', () => {
    it('verifies AI post diagnosis costs 5 tokens', () => {
      expect(TOKEN_RATES.AI_POST_DIAGNOSIS).toBe(5);
      expect(canAffordTokens(4, 'AI_POST_DIAGNOSIS')).toBe(false);
      expect(canAffordTokens(5, 'AI_POST_DIAGNOSIS')).toBe(true);
    });

    it('verifies force sync now costs 2 tokens', () => {
      expect(TOKEN_RATES.FORCE_SYNC_NOW).toBe(2);
      expect(canAffordTokens(1, 'FORCE_SYNC_NOW')).toBe(false);
      expect(canAffordTokens(2, 'FORCE_SYNC_NOW')).toBe(true);
    });
  });
});
