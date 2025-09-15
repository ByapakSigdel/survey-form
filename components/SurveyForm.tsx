"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

// Option sets with bilingual labels
interface BiOption { 
  value: string; 
  en: string; 
  np: string; 
}

interface FormState {
  respondent_type?: 'individual' | 'organization';
  // Individual
  individual_task_management_method?: string;
  individual_finance_tracking?: string;
  individual_challenges?: string[]; // up to 2
  individual_app_usage_frequency?: string;
  individual_top_features?: string[]; // up to 3 (ordered as selected)
  individual_platform_preference?: string;
  individual_sync_importance?: number; // 1-5
  individual_frustrations?: string;
  individual_combined_app_interest?: string; // yes/no/maybe
  individual_free_version_interest?: string; // yes/no
  individual_willing_to_pay?: string;
  individual_upgrade_reason?: string;
  individual_recommend_likelihood?: number; // 1-5
  // Organization
  organization_industry?: string;
  organization_employee_count?: string;
  organization_management_method?: string;
  organization_pain_points?: string[]; // multi
  organization_top_features?: string[]; // up to 3 ordered
  organization_integration_importance?: number; // 1-5
  organization_deployment_preference?: string;
  organization_roles_permissions_importance?: number; // 1-5
  organization_budget_range?: string;
  organization_freemium_interest?: string; // yes/no/maybe
  organization_switch_reason?: string;
  organization_security_importance?: number; // 1-5
  organization_combined_app_interest?: string; // yes/no/maybe
  organization_recommend_likelihood?: number; // 1-5
  // Shared
  email?: string;
  contact_opt_in?: boolean;
}

const respondentTypeOptions: BiOption[] = [
  { value: 'individual', en: 'Individual', np: 'व्यक्ति' },
  { value: 'organization', en: 'Organization / Business', np: 'संस्था / व्यवसाय' },
];

// Individual specific
const individualTaskManageOptions: BiOption[] = [
  { value: 'paper', en: 'Paper / Notebook', np: 'कागज / नोटबुक' },
  { value: 'mobile_apps', en: 'Mobile apps', np: 'मोबाइल एपहरू' },
  { value: 'not_managing', en: 'Not currently managing', np: 'अहिले व्यवस्थापन छैन' },
];
const individualFinanceTrackingOptions: BiOption[] = [
  { value: 'regularly', en: 'Yes, regularly', np: 'हो, नियमित' },
  { value: 'sometimes', en: 'Sometimes', np: 'कहिलेकाहीँ' },
  { value: 'no', en: 'No', np: 'हैन' },
];
const individualChallengesOptions: BiOption[] = [
  { value: 'procrastination', en: 'Staying productive / avoiding procrastination', np: 'उत्पादक रहनु / टालटुल घटाउनु' },
  { value: 'remembering', en: 'Remembering tasks or deadlines', np: 'कार्य वा म्याद सम्झनु' },
  { value: 'tracking_finances', en: 'Tracking income/expenses', np: 'आय / खर्च ट्र्याक गर्नु' },
  { value: 'goal_setting', en: 'Setting and achieving personal goals', np: 'व्यक्तिगत लक्ष्य राख्नु र पुग्नु' },
];
const individualAppUsageFrequencyOptions: BiOption[] = [
  { value: 'daily', en: 'Daily', np: 'दैनिक' },
  { value: 'weekly', en: 'Weekly', np: 'साप्ताहिक' },
  { value: 'monthly', en: 'Monthly', np: 'मासिक' },
  { value: 'rarely', en: 'Rarely', np: 'क्वचित' },
  { value: 'never', en: 'Never', np: 'कहिल्यै पनि होइन' },
];
const individualFeatureOptions: BiOption[] = [
  { value: 'todo', en: 'To-do list & reminders', np: 'To-do सूची र रिमाइन्डर' },
  { value: 'finance_tracker', en: 'Finance tracker', np: 'वित्त ट्रयाकर' },
  { value: 'productivity_tracker', en: 'Productivity tracker (time/goal)', np: 'उत्पादकता ट्रयाकर (समय / लक्ष्य)' },
  { value: 'calendar_integration', en: 'Calendar integration', np: 'क्यालेन्डर एकीकरण' },
  { value: 'habit_tracker', en: 'Habit tracker', np: 'बानी ट्रयाकर' },
];
const platformPreferenceOptions: BiOption[] = [
  { value: 'mobile', en: 'Mobile app', np: 'मोबाइल एप' },
  { value: 'web', en: 'Web app', np: 'वेब एप' },
  { value: 'both', en: 'Both', np: 'दुवै' },
];
const likert1to5 = [1,2,3,4,5];
const yesNoMaybe: BiOption[] = [
  { value: 'yes', en: 'Yes', np: 'हो' },
  { value: 'no', en: 'No', np: 'होइन' },
  { value: 'maybe', en: 'Maybe', np: 'सायद' }
];
const willingnessPayOptions: BiOption[] = [
  { value: 'Rs.100-200', en: 'Rs.100–200', np: 'रु.१००–२००' },
  { value: 'Rs.200-300', en: 'Rs.200–300', np: 'रु.२००–३००' },
  { value: 'Rs.300-400', en: 'Rs.300–400', np: 'रु.३००–४००' },
  { value: 'Rs.400+', en: 'Rs.400+', np: 'रु.४००+' },
];

// Organization specific
const employeeCountOptions: BiOption[] = [
  { value: '1-10', en: '1–10', np: '१–१०' },
  { value: '11-50', en: '11–50', np: '११–५०' },
  { value: '51-200', en: '51–200', np: '५१–२००' },
  { value: '200+', en: '200+', np: '२००+' },
];
const orgManagementMethodOptions: BiOption[] = [
  { value: 'excel_manual', en: 'Excel / Manual', np: 'एक्सेल / म्यानुअल' },
  { value: 'dedicated_software', en: 'Dedicated software', np: 'समर्पित सफ्टवेयर' },
  { value: 'other', en: 'Other', np: 'अन्य' },
];
const orgPainPointsOptions: BiOption[] = [
  { value: 'inventory_accuracy', en: 'Inventory tracking accuracy', np: 'इन्वेन्टरी ट्र्याकिङ शुद्धता' },
  { value: 'order_delays', en: 'Order management delays', np: 'अर्डर व्यवस्थापन ढिलाइ' },
  { value: 'lack_centralization', en: 'Lack of centralization', np: 'केन्द्रीकरणको कमी' },
  { value: 'tool_cost', en: 'Cost of existing tools', np: 'विद्यमान उपकरणको लागत' },
  { value: 'staff_adoption', en: 'Staff adoption / training issues', np: 'कर्मचारी अपनत्व / तालिम समस्या' },
];
const orgFeatureOptions: BiOption[] = [
  { value: 'order_management', en: 'Order management', np: 'अर्डर व्यवस्थापन' },
  { value: 'inventory_management', en: 'Inventory management', np: 'इन्वेन्टरी व्यवस्थापन' },
  { value: 'product_catalog', en: 'Product catalog & sorter', np: 'उत्पादन क्याटलग र क्रमबद्ध' },
  { value: 'team_productivity', en: 'Team productivity tracking', np: 'टोली उत्पादकता ट्र्याक' },
  { value: 'finance_expense', en: 'Finance / expense management', np: 'वित्त / खर्च व्यवस्थापन' },
];
const deploymentPreferenceOptions: BiOption[] = [
  { value: 'cloud', en: 'Cloud-based', np: 'क्लाउड-आधारित' },
  { value: 'on_premise', en: 'On-premise', np: 'अन-प्रिमाइस' },
  { value: 'not_sure', en: 'Not sure', np: 'निश्चित छैन' },
];
const orgBudgetOptions: BiOption[] = [
  { value: 'Rs.10000+', en: 'Rs.10000+', np: 'रु.१००००+' },
  { value: 'Rs.20000+', en: 'Rs.20000+', np: 'रु.२००००+' },
];

// Reusable small helper for radio group label
const Radio = (props: { name: string; value: string; checked: boolean; onChange: (v: string)=>void; label: string; required?: boolean }) => (
  <label className="flex items-center gap-2 text-sm cursor-pointer group">
    <input
      type="radio"
      name={props.name}
      value={props.value}
      checked={props.checked}
      onChange={e=>props.onChange(e.target.value)}
      className="h-4 w-4 accent-blue-500 transition-colors"
      required={props.required}
    />
    <span className={props.checked ? 'text-blue-300' : 'group-hover:text-blue-200/70 transition-colors'}>{props.label}</span>
  </label>
);

export function SurveyForm() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState<FormState>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  // Local storage persistence
  const STORAGE_KEY = 'survey_form_v1';

  // Load saved form data on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setFormData(parsed as FormState);
        }
      }
    } catch (e) {
      console.warn('Failed to load saved form data', e);
    }
  }, []);

  // Persist formData changes (skip after submit -> clear)
  useEffect(() => {
    if (submitted) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      return;
    }
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      }
    } catch (e) {
      console.warn('Failed to save form data', e);
    }
  }, [formData, submitted]);

  const toggleArrayValue = (key: keyof FormState, value: string, limit?: number) => {
    setFormData(prev => {
      const current = Array.isArray(prev[key]) ? [...(prev[key] as string[])] : [];
      const exists = current.includes(value);
      let next = exists ? current.filter(v => v !== value) : [...current, value];
      if (limit && next.length > limit) next = next.slice(0, limit); // keep first selections
      return { ...prev, [key]: next };
    });
  };

  const updateField = (key: keyof FormState, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validate = (): string[] => {
    const m: string[] = [];
    if (!formData.respondent_type) m.push('respondent_type');
  if (!formData.email) m.push('email');
    if (formData.respondent_type === 'individual') {
      const requiredIndividual: (keyof FormState)[] = [
    'individual_task_management_method','individual_finance_tracking','individual_app_usage_frequency','individual_platform_preference','individual_sync_importance','individual_combined_app_interest','individual_free_version_interest','individual_willing_to_pay','individual_recommend_likelihood','email'
      ];
      requiredIndividual.forEach(k=>{ if(formData[k]===undefined||formData[k]===null||formData[k]==='') m.push(k as string); });
      if (!formData.individual_challenges || formData.individual_challenges.length===0) m.push('individual_challenges');
      if (!formData.individual_top_features || formData.individual_top_features.length===0) m.push('individual_top_features');
    } else if (formData.respondent_type === 'organization') {
      const requiredOrg: (keyof FormState)[] = [
    'organization_industry','organization_employee_count','organization_management_method','organization_integration_importance','organization_deployment_preference','organization_roles_permissions_importance','organization_budget_range','organization_freemium_interest','organization_security_importance','organization_combined_app_interest','organization_recommend_likelihood','email'
      ];
      requiredOrg.forEach(k=>{ if(formData[k]===undefined||formData[k]===null||formData[k]==='') m.push(k as string); });
      if (!formData.organization_pain_points || formData.organization_pain_points.length===0) m.push('organization_pain_points');
      if (!formData.organization_top_features || formData.organization_top_features.length===0) m.push('organization_top_features');
    }
    return m;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError(null);
    setAttempted(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      const missing = validate();
      if (missing.length) {
        throw new Error(`Please fill all required fields ( आवश्यक सबै फिल्ड भर्नुहोस् ) — Missing: ${missing.join(', ')}`);
      }
      // Build row dynamically including only non-null values to avoid column mismatch 400 errors
      const valueMap: Record<string, any> = {
        respondent_type: formData.respondent_type,
        individual_task_management_method: formData.individual_task_management_method,
        individual_finance_tracking: formData.individual_finance_tracking,
        individual_challenges: formData.individual_challenges?.length ? formData.individual_challenges : null,
        individual_app_usage_frequency: formData.individual_app_usage_frequency,
        individual_top_features: formData.individual_top_features?.length ? formData.individual_top_features : null,
        individual_platform_preference: formData.individual_platform_preference,
        individual_sync_importance: formData.individual_sync_importance,
        individual_frustrations: formData.individual_frustrations,
        individual_combined_app_interest: formData.individual_combined_app_interest,
        individual_free_version_interest: formData.individual_free_version_interest,
        individual_willing_to_pay: formData.individual_willing_to_pay,
        individual_upgrade_reason: formData.individual_upgrade_reason,
        individual_recommend_likelihood: formData.individual_recommend_likelihood,
        organization_industry: formData.organization_industry,
        organization_employee_count: formData.organization_employee_count,
        organization_management_method: formData.organization_management_method,
        organization_pain_points: formData.organization_pain_points?.length ? formData.organization_pain_points : null,
        organization_top_features: formData.organization_top_features?.length ? formData.organization_top_features : null,
        organization_integration_importance: formData.organization_integration_importance,
        organization_deployment_preference: formData.organization_deployment_preference,
        organization_roles_permissions_importance: formData.organization_roles_permissions_importance,
        organization_budget_range: formData.organization_budget_range,
        organization_freemium_interest: formData.organization_freemium_interest,
        organization_switch_reason: formData.organization_switch_reason,
        organization_security_importance: formData.organization_security_importance,
        organization_combined_app_interest: formData.organization_combined_app_interest,
        organization_recommend_likelihood: formData.organization_recommend_likelihood,
        email: formData.email,
        contact_opt_in: typeof formData.contact_opt_in === 'boolean' ? formData.contact_opt_in : null,
        // raw removed unless you really have a 'raw' JSONB column in table. Uncomment if exists.
        // raw: formData
      };

      const row: Record<string, any> = {};
      Object.entries(valueMap).forEach(([k,v]) => {
        if (v !== undefined && v !== null && v !== '') row[k] = v;
      });

      // Debug: surface outgoing payload (won't show secrets)
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[SurveyForm] inserting row', row);
      }

      const { error } = await supabase.from('responses').insert(row).select().single();
      if (error) throw error;
      setSubmitted(true);
    } catch (err: unknown) {
      // Supabase PostgrestError shape: { message, details, hint, code }
      let friendly = 'Submission failed';
      if (typeof err === 'object' && err && 'message' in err) {
        const anyErr: any = err;
        friendly = anyErr.message;
        if (anyErr.details) friendly += ` — ${anyErr.details}`;
        if (/column .* does not exist/i.test(friendly)) {
          friendly += '\nHint: Make sure your Supabase table "responses" has all expected columns or remove missing ones from the insert payload.';
        } else if (/violates row-level security policy/i.test(friendly)) {
          friendly += '\nHint: Enable an INSERT RLS policy for anon role on table responses.';
        }
      }
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Thank you! ( धन्यवाद! )</h2>
        <p className="text-sm text-neutral-400">Your response has been recorded. ( तपाईंको उत्तर सुरक्षित गरिएको छ )</p>
      </div>
    );
  }

  const t = (enStr: string, npStr: string) => lang==='en'? enStr : npStr;
  const optLabel = (o: BiOption) => lang==='en'? o.en : o.np;

  // approximate progress (count filled required vs total) for a simple UX cue
  const requiredKeysIndividual: (keyof FormState)[] = ['respondent_type','individual_task_management_method','individual_finance_tracking','individual_app_usage_frequency','individual_platform_preference','individual_sync_importance','individual_combined_app_interest','individual_free_version_interest','individual_willing_to_pay','individual_recommend_likelihood','email'];
  const requiredKeysOrg: (keyof FormState)[] = ['respondent_type','organization_industry','organization_employee_count','organization_management_method','organization_integration_importance','organization_deployment_preference','organization_roles_permissions_importance','organization_budget_range','organization_freemium_interest','organization_security_importance','organization_combined_app_interest','organization_recommend_likelihood','email'];
  const dynamicRequired = formData.respondent_type === 'individual' ? requiredKeysIndividual : formData.respondent_type === 'organization' ? requiredKeysOrg : ['respondent_type'];
  const filledCount = dynamicRequired.reduce<number>((acc, k) => {
    const key = k as keyof FormState;
    const value = formData[key];
    return (value !== undefined && value !== null && value !== '') ? acc + 1 : acc;
  }, 0);
  const totalRequired = dynamicRequired.length;
  const progress = Math.min(100, Math.round((filledCount/totalRequired)*100));

  return (
    <form onSubmit={handleSubmit} className="space-y-8 ui-card rounded-xl p-6 md:p-8" id="survey">
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight gradient-text">{t('Productivity & Finance Needs Survey','उत्पादकता र वित्त आवश्यक सर्वेक्षण')}</h1>
        <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">{t('Help us design an integrated productivity + finance experience tailored for Nepal—takes just a few minutes.','हामीलाई नेपालका लागि उपयुक्त संयोजित उत्पादकता + वित्त अनुभव डिजाइन गर्न मद्दत गर्नुहोस् — केही मिनेट मात्र लाग्छ।')}</p>
  <div className="h-2 w-full rounded bg-neutral-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-300 transition-all duration-500" style={{width: progress + '%'}} /></div>
        <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">{progress}% {t('complete','पूरा')}</div>
      </div>
      {!supabase && (
        <div className="rounded-md border border-red-600/40 bg-red-950/30 text-red-300 p-4 text-xs">
          {lang==='en' ? 'Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY and restart dev server.' : 'Supabase कन्फिग छैन। NEXT_PUBLIC_SUPABASE_URL र NEXT_PUBLIC_SUPABASE_ANON_KEY थपेर सर्वर पुन: सुरु गर्नुहोस्।'}
        </div>
      )}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium text-sm">{t('Respondent type','उत्तरदाता प्रकार')} <span className="text-red-400">*</span></label>
          <select
            required
            value={formData.respondent_type || ''}
            onChange={e => updateField('respondent_type', e.target.value as 'individual' | 'organization')}
            className="w-full rounded-md bg-neutral-950 border border-neutral-800 focus:border-neutral-600 focus:outline-none px-3 py-2 text-sm"
          >
            <option value="" disabled>{t('Choose...','छान्नुहोस्...')}</option>
            {respondentTypeOptions.map(o => (
              <option key={o.value} value={o.value}>{optLabel(o)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* INDIVIDUAL SECTION */}
      {formData.respondent_type === 'individual' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('How do you currently manage your daily tasks & to-dos?','तपाईं अहिले दैनिक कार्य तथा To-do कसरी व्यवस्थापन गर्नुहुन्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {individualTaskManageOptions.map(o => (
                <Radio key={o.value} name="individual_task_management_method" value={o.value} label={optLabel(o)} checked={formData.individual_task_management_method===o.value} onChange={v=>updateField('individual_task_management_method', v)} required />
              ))}
            </div>
            {formData.individual_task_management_method === 'mobile_apps' && (
              <input type="text" placeholder="Which apps? (optional)" className="mt-2 w-full rounded-md bg-neutral-950 border border-neutral-800 focus:border-neutral-600 px-3 py-2 text-sm" onChange={e=> updateField('individual_frustrations', (formData.individual_frustrations? formData.individual_frustrations + '\n' : '') + 'Apps: '+ e.target.value)} />
            )}
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Do you track your personal finances?','के तपाईं व्यक्तिगत वित्त (खर्च, बचत, लगानी) ट्र्याक गर्नुहुन्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {individualFinanceTrackingOptions.map(o => (
                <Radio key={o.value} name="individual_finance_tracking" value={o.value} label={optLabel(o)} checked={formData.individual_finance_tracking===o.value} onChange={v=>updateField('individual_finance_tracking', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Which of the following do you find most challenging? (Select up to 2)','तलका मध्ये कुन कुरा तपाईँलाई सबैभन्दा चुनौतीपूर्ण लाग्छ? (२ सम्म छान्नुहोस्)')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-3">
              {individualChallengesOptions.map(o => (
                <label key={o.value} className={`flex items-center gap-2 text-xs md:text-sm cursor-pointer rounded px-3 py-1 border transition-colors ${formData.individual_challenges?.includes(o.value)?'bg-blue-600/20 border-blue-500 text-blue-200':'bg-neutral-900/60 border-neutral-800 hover:border-blue-500/40 hover:bg-neutral-800/40'}`}> 
                  <input type="checkbox" className="h-4 w-4 accent-blue-500" checked={formData.individual_challenges?.includes(o.value)||false} onChange={()=> toggleArrayValue('individual_challenges', o.value, 2)} />
                  <span>{optLabel(o)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('How often do you use productivity or finance apps?','उत्पादकता वा वित्त एप कत्तिको प्रयोग गर्नुहुन्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {individualAppUsageFrequencyOptions.map(o => (
                <Radio key={o.value} name="individual_app_usage_frequency" value={o.value} label={optLabel(o)} checked={formData.individual_app_usage_frequency===o.value} onChange={v=>updateField('individual_app_usage_frequency', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Which features would be most valuable? (Select up to 3)','कुन सुविधाहरू तपाईंका लागि सबैभन्दा उपयोगी? (३ सम्म छान्नुहोस्)')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-3">
              {individualFeatureOptions.map(o => (
                <label key={o.value} className={`flex items-center gap-2 text-xs md:text-sm cursor-pointer rounded px-3 py-1 border transition-colors ${formData.individual_top_features?.includes(o.value)?'bg-blue-600/20 border-blue-500 text-blue-200':'bg-neutral-900/60 border-neutral-800 hover:border-blue-500/40 hover:bg-neutral-800/40'}`}> 
                  <input type="checkbox" className="h-4 w-4 accent-blue-500" checked={formData.individual_top_features?.includes(o.value)||false} onChange={()=> toggleArrayValue('individual_top_features', o.value, 3)} />
                  <span>{optLabel(o)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Would you prefer a mobile app, web app, or both?','मोबाइल एप, वेब एप वा दुवै?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {platformPreferenceOptions.map(o => (
                <Radio key={o.value} name="individual_platform_preference" value={o.value} label={optLabel(o)} checked={formData.individual_platform_preference===o.value} onChange={v=>updateField('individual_platform_preference', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('How important is syncing across devices? (1 = Not important, 5 = Very important)','विभिन्न उपकरणबीच Sync कत्तिको महत्वपूर्ण? (१ = महत्वहीन, ५ = धेरै महत्वपूर्ण)')} <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-3 w-full max-w-sm">
              <input type="range" min={1} max={5} value={formData.individual_sync_importance ?? 3} onChange={e=> updateField('individual_sync_importance', Number(e.target.value))} className="flex-grow accent-blue-500" />
              <span className="text-xs tabular-nums w-4 text-right">{formData.individual_sync_importance ?? 3}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('What frustrates you most about existing apps?','हालका एपहरूसँगको सबैभन्दा ठूलो असन्तोष के हो?')}</label>
            <textarea rows={3} className="w-full rounded-md bg-neutral-950 border border-neutral-800 focus:border-neutral-600 px-4 py-2 text-sm" value={formData.individual_frustrations || ''} onChange={e=> updateField('individual_frustrations', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Interested in a combined finance + tasks + productivity app?','वित्त + कार्य + उत्पादकता एउटै एपमा चाहनुहुन्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {yesNoMaybe.map(o => (
                <Radio key={o.value} name="individual_combined_app_interest" value={o.value} label={optLabel(o)} checked={formData.individual_combined_app_interest===o.value} onChange={v=>updateField('individual_combined_app_interest', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Would you use a free version with limited features?','सीमित सुविधासहित नि:शुल्क संस्करण प्रयोग गर्नुहुन्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex gap-6">
              {['yes','no'].map(v => <Radio key={v} name="individual_free_version_interest" value={v} label={t(v==='yes'?'Yes':'No', v==='yes'?'हो':'होइन')} checked={formData.individual_free_version_interest===v} onChange={val=>updateField('individual_free_version_interest', val)} required />)}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('How much are you willing to pay for enhanced features?','थप सुविधाहरूका लागि कति तिर्न इच्छुक हुनुहुन्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {willingnessPayOptions.map(o => (
                <Radio key={o.value} name="individual_willing_to_pay" value={o.value} label={optLabel(o)} checked={formData.individual_willing_to_pay===o.value} onChange={v=>updateField('individual_willing_to_pay', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('What would make you upgrade from free to premium?','फ्रीबाट प्रिमियममा जान के कारण हुन्छ?')}</label>
            <textarea rows={3} className="w-full rounded-md bg-neutral-950 border border-neutral-800 focus:border-neutral-600 px-4 py-2 text-sm" value={formData.individual_upgrade_reason || ''} onChange={e=> updateField('individual_upgrade_reason', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('How likely are you to recommend such an app (1–5)?','यस्तो एप सिफारिस गर्ने सम्भाव्यता (१–५)?')} <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-3 w-full max-w-sm">
              <input type="range" min={1} max={5} value={formData.individual_recommend_likelihood ?? 3} onChange={e=> updateField('individual_recommend_likelihood', Number(e.target.value))} className="flex-grow accent-blue-500" />
              <span className="text-xs tabular-nums w-4 text-right">{formData.individual_recommend_likelihood ?? 3}</span>
            </div>
          </div>
        </div>
      )}

      {/* ORGANIZATION SECTION */}
      {formData.respondent_type === 'organization' && (
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('What type of business / organization (industry)?','कस्तो प्रकारको व्यवसाय / संस्था (उद्योग)?')} <span className="text-red-400">*</span></label>
            <input type="text" className="w-full rounded-md bg-neutral-950 border border-neutral-800 focus:border-neutral-600 px-4 py-2 text-sm" value={formData.organization_industry || ''} onChange={e=> updateField('organization_industry', e.target.value)} placeholder="e.g. Retail, Manufacturing" />
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Number of employees?','कति कर्मचारी?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {employeeCountOptions.map(o => (
                <Radio key={o.value} name="organization_employee_count" value={o.value} label={optLabel(o)} checked={formData.organization_employee_count===o.value} onChange={v=>updateField('organization_employee_count', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('How do you currently manage inventory / orders / products?','हाल इन्वेन्टरी / अर्डर / उत्पादन कसरी व्यवस्थापन गर्नुहुन्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {orgManagementMethodOptions.map(o => (
                <Radio key={o.value} name="organization_management_method" value={o.value} label={optLabel(o)} checked={formData.organization_management_method===o.value} onChange={v=>updateField('organization_management_method', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('What are the biggest pain points? (Select all that apply)','सबैभन्दा ठूलो समस्या / चुनौतीहरू? (लागु हुने सबै छान्नुहोस्)')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-3">
              {orgPainPointsOptions.map(o => (
                <label key={o.value} className={`flex items-center gap-2 text-xs md:text-sm cursor-pointer rounded px-3 py-1 border transition-colors ${formData.organization_pain_points?.includes(o.value)?'bg-blue-600/20 border-blue-500 text-blue-200':'bg-neutral-900/60 border-neutral-800 hover:border-blue-500/40 hover:bg-neutral-800/40'}`}>
                  <input type="checkbox" className="h-4 w-4 accent-blue-500" checked={formData.organization_pain_points?.includes(o.value)||false} onChange={()=> toggleArrayValue('organization_pain_points', o.value)} />
                  <span>{optLabel(o)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Which features would be most valuable? (Select up to 3)','कुन सुविधाहरू सबैभन्दा महत्वपूर्ण? (३ सम्म छान्नुहोस्)')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-3">
              {orgFeatureOptions.map(o => (
                <label key={o.value} className={`flex items-center gap-2 text-xs md:text-sm cursor-pointer rounded px-3 py-1 border transition-colors ${formData.organization_top_features?.includes(o.value)?'bg-blue-600/20 border-blue-500 text-blue-200':'bg-neutral-900/60 border-neutral-800 hover:border-blue-500/40 hover:bg-neutral-800/40'}`}>
                  <input type="checkbox" className="h-4 w-4 accent-blue-500" checked={formData.organization_top_features?.includes(o.value)||false} onChange={()=> toggleArrayValue('organization_top_features', o.value, 3)} />
                  <span>{optLabel(o)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('How important is integration with accounting / ERP / other software? (1–5)','लेखा / ERP / अन्य सफ्टवेयरसँग एकीकरण कत्तिको महत्वपूर्ण? (१–५)')} <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-3 w-full max-w-sm">
              <input type="range" min={1} max={5} value={formData.organization_integration_importance ?? 3} onChange={e=> updateField('organization_integration_importance', Number(e.target.value))} className="flex-grow accent-blue-500" />
              <span className="text-xs tabular-nums w-4 text-right">{formData.organization_integration_importance ?? 3}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Preferred deployment?','प्राथमिक डिप्लोयमेन्ट विधि?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {deploymentPreferenceOptions.map(o => (
                <Radio key={o.value} name="organization_deployment_preference" value={o.value} label={optLabel(o)} checked={formData.organization_deployment_preference===o.value} onChange={v=>updateField('organization_deployment_preference', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Importance of multi-user roles/permissions? (1–5)','मल्टि-यूजर भूमिका / अनुमति कत्तिको महत्वपूर्ण? (१–५)')} <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-3 w-full max-w-sm">
              <input type="range" min={1} max={5} value={formData.organization_roles_permissions_importance ?? 3} onChange={e=> updateField('organization_roles_permissions_importance', Number(e.target.value))} className="flex-grow accent-blue-500" />
              <span className="text-xs tabular-nums w-4 text-right">{formData.organization_roles_permissions_importance ?? 3}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('How much are you willing to pay for a management app completely customized to your liking?','तपाईंको मनपर्दो अनुसार पूर्ण रूपमा अनुकूलित व्यवस्थापन एपका लागि कति तिर्न इच्छुक हुनुहुन्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {orgBudgetOptions.map(o => (
                <Radio key={o.value} name="organization_budget_range" value={o.value} label={optLabel(o)} checked={formData.organization_budget_range===o.value} onChange={v=>updateField('organization_budget_range', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Does a freemium model appeal to you?','Freemium मोडेल (बेसिक फ्री) आकर्षक लाग्छ?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {yesNoMaybe.map(o => (
                <Radio key={o.value} name="organization_freemium_interest" value={o.value} label={optLabel(o)} checked={formData.organization_freemium_interest===o.value} onChange={v=>updateField('organization_freemium_interest', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('What would convince you to switch from current system?','हालको प्रणालीबाट स्विच गर्न के कारण पर्याप्त हुन्छ?')}</label>
            <textarea rows={3} className="w-full rounded-md bg-neutral-950 border border-neutral-800 focus:border-neutral-600 px-4 py-2 text-sm" value={formData.organization_switch_reason || ''} onChange={e=> updateField('organization_switch_reason', e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Importance of data security & privacy? (1–5)','डेटा सुरक्षात्मकता र गोपनीयता कत्तिको महत्वपूर्ण? (१–५)')} <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-3 w-full max-w-sm">
              <input type="range" min={1} max={5} value={formData.organization_security_importance ?? 3} onChange={e=> updateField('organization_security_importance', Number(e.target.value))} className="flex-grow accent-blue-500" />
              <span className="text-xs tabular-nums w-4 text-right">{formData.organization_security_importance ?? 3}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Interested in combined app tracking employee productivity & tasks?','कर्मचारी उत्पादकता तथा कार्य ट्र्याक गर्ने संयोजित एपमा चासो?')} <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-4">
              {yesNoMaybe.map(o => (
                <Radio key={o.value} name="organization_combined_app_interest" value={o.value} label={optLabel(o)} checked={formData.organization_combined_app_interest===o.value} onChange={v=>updateField('organization_combined_app_interest', v)} required />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-medium text-sm">{t('Likelihood to recommend (1–5)','सिफारिस गर्ने सम्भाव्यता (१–५)')} <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-3 w-full max-w-sm">
              <input type="range" min={1} max={5} value={formData.organization_recommend_likelihood ?? 3} onChange={e=> updateField('organization_recommend_likelihood', Number(e.target.value))} className="flex-grow accent-blue-500" />
              <span className="text-xs tabular-nums w-4 text-right">{formData.organization_recommend_likelihood ?? 3}</span>
            </div>
          </div>
        </div>
      )}

      {/* SHARED FIELDS */}
      <div className="space-y-2">
        <label className="block font-medium text-sm">{t('Email','इमेल')} <span className="text-red-400">*</span></label>
        <input required type="email" value={formData.email || ''} onChange={e=> updateField('email', e.target.value)} placeholder="you@example.com" className="w-full rounded-md bg-neutral-950 border border-neutral-800 focus:border-neutral-600 px-4 py-2 text-sm" />
      </div>
      <div className="flex items-center gap-2">
  <input id="contact_opt_in" type="checkbox" checked={formData.contact_opt_in || false} onChange={e=> updateField('contact_opt_in', e.target.checked)} className="h-4 w-4 accent-blue-500" />
        <label htmlFor="contact_opt_in" className="text-sm">{t('I agree to be contacted for future product ideas','भविष्यका उत्पादन विचारका लागि सम्पर्क गर्न सहमत छु')}</label>
      </div>

      {error && <p className="text-sm text-red-400 break-words">{error}</p>}
      <div className="flex items-center gap-4 flex-wrap pt-2">
    <button type="submit" disabled={loading || !supabase} className="group inline-flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold px-7 py-2.5 text-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_18px_-4px_rgba(59,130,246,0.45)] hover:shadow-[0_6px_22px_-6px_rgba(59,130,246,0.55)] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-blue-400/60">
          <span className="relative pr-5">
      {supabase ? (loading ? t('Submitting...','पेश गर्दै...') : t('Submit','पेश गर्नुहोस्')) : t('Config Required','कन्फिग आवश्यक')}
      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-300 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
        <p className="text-[10px] text-neutral-500">{t('Your data is securely stored.','तपाईंको डेटा सुरक्षित रूपमा भण्डारण हुन्छ।')}</p>
      </div>
      {attempted && !submitted && (
        <p className="text-[10px] text-neutral-500">{t('All * questions & required multi-selects need at least one selection.','सबै * प्रश्न र अनिवार्य मल्टि-सेलेक्टमा कम्तीमा एक चयन आवश्यक।')}</p>
      )}
    </form>
  );
}