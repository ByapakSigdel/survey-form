'use client'
import { SurveyForm } from '@/components/SurveyForm';
import { ConfigDebug } from '@/components/ConfigDebug';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

export default function Home() {
  const { lang, setLang } = useLanguage();
  const [showLangModal, setShowLangModal] = useState(true); // start visible to avoid flash
  useEffect(() => {
    try {
      const confirmed = localStorage.getItem('survey_lang_confirmed');
      if (confirmed === '1') {
        setShowLangModal(false);
      }
    } catch {
      // keep open
    }
  }, []);
  // Lock scroll & cleanup
  useEffect(() => {
    if (showLangModal) {
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.documentElement.classList.remove('overflow-hidden');
    }
    return () => {
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [showLangModal]);

  const t = (en: string, np: string) => (lang === 'en' ? en : np);

  return (
  <div className="space-y-14 relative" aria-hidden={showLangModal ? 'true' : 'false'}>
      {showLangModal && (
        <div className="fixed left-0 top-0 w-screen h-screen z-[100] flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/60" />
          <div className="relative z-10 w-full max-w-sm mx-auto rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-center">{t('Choose Language','भाषा छान्नुहोस्')}</h2>
            <p className="text-xs text-neutral-400 mb-5 text-center">{t('Select your preferred language for the survey. You can switch later.','सर्वेका लागि मन पर्ने भाषा छान्नुहोस्। पछि पनि परिवर्तन गर्न सक्नुहुन्छ।')}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setLang('en'); try { localStorage.setItem('survey_lang_confirmed','1'); } catch {}; setShowLangModal(false); }} className="w-full rounded-md bg-white text-black py-2 text-sm font-medium hover:bg-neutral-200">English</button>
              <button onClick={() => { setLang('np'); try { localStorage.setItem('survey_lang_confirmed','1'); } catch {}; setShowLangModal(false); }} className="w-full rounded-md border border-neutral-700 py-2 text-sm font-medium hover:bg-neutral-900">नेपाली</button>
            </div>
          </div>
        </div>
      )}
      <section className="text-center md:text-left space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{t('Welcome!','स्वागत छ!')}</h1>
          <p className="text-neutral-300 max-w-3xl text-sm md:text-base leading-relaxed space-y-3">
            <span className="block">{t(
              'Thank you for taking a few minutes to participate in this survey. We’re building a new management app designed to help both individuals (with tools like productivity tracking, finance management, and to-do lists) and businesses (with features like order management, product management, and inventory tracking).',
              'यो सर्वेमा केही मिनेट समय दिनुभएकोमा धन्यवाद। हामी एक नयाँ व्यवस्थापन एप निर्माण गर्दैछौं जसले व्यक्तिगत प्रयोगकर्ताहरूलाई (उत्पादकता ट्र्याकिङ, वित्त व्यवस्थापन, टू-डू सूची) र व्यवसायहरूलाई (अर्डर व्यवस्थापन, उत्पादन व्यवस्थापन, इन्वेन्टरी ट्र्याकिङ) सहायत गर्छ।'
            )}</span>
            <span className="block mt-3">{t(
              'Your feedback will directly shape the features and direction of this app. Whether you’re a student, working professional, entrepreneur, or running a business, your insights are valuable to us.',
              'तपाईंको प्रतिक्रिया यस एपका सुविधाहरू र दिशालाई प्रत्यक्ष रूपमा निर्धारण गर्दछ। तपाईं विद्यार्थी, कामकाजी पेशेवर, उद्यमी वा व्यवसाय सञ्चालनकर्ताजस्तो जोसुकै हुनुहोस्, तपाईंका विचारहरू हामीलाई अत्यन्त मूल्यवान छन्।'
            )}</span>
          </p>
        </div>
        <div className="rounded-md border border-neutral-800 bg-neutral-900/40 p-4 md:p-5 text-left">
          <h2 className="text-base md:text-lg font-semibold mb-3">{t('About This Survey','यो सर्वेबारे')}</h2>
          <ul className="list-disc pl-5 space-y-2 text-neutral-400 text-xs md:text-sm">
            <li>{t(
              'Purpose: This survey aims to understand the needs and challenges of potential users like you, so we can create a tool that truly solves real problems.',
              'उद्देश्य: यो सर्वे तपाईं जस्ता सम्भावित प्रयोगकर्ताहरूका आवश्यकता र चुनौती बुझ्न केन्द्रित छ ताकि हामी साँच्चिकै समस्या समाधान गर्ने उपकरण बनाउन सकौं।'
            )}</li>
            <li>{t('Time required: It will take around 5–7 minutes to complete.', 'समय: यसलाई पूरा गर्न करिब ५–७ मिनेट लाग्छ।')}</li>
            <li>{t('Confidentiality: Your responses will remain confidential and will only be used for research purposes.', 'गोपनीयता: तपाईंका उत्तरहरू गोप्य राखिनेछन् र अनुसन्धान प्रयोजनका लागि मात्र प्रयोग गरिनेछन्।')}</li>
            <li>{t(
              'Impact: By sharing your honest feedback, you’ll be helping us design a product that could become your next go-to app for managing tasks, finances, and business operations.',
              'असर: तपाईंको इमानदार प्रतिक्रिया मार्फत तपाईंले कार्य, वित्त र व्यवसाय सञ्चालन व्यवस्थापनको लागि तपाईंको आगामी रोजाइको एप बन्न सक्ने उत्पादन डिजाइन गर्न हामीलाई सहयोग गर्दै हुनुहुन्छ।'
            )}</li>
          </ul>
          <p className="mt-4 text-[11px] md:text-xs text-neutral-500">{t('All fields marked * are required. Please answer honestly.','तारा (*) भएका सबै प्रश्न अनिवार्य छन्। कृपया इमान्दारीपूर्वक उत्तर दिनुहोस्।')}</p>
        </div>
  {/* Removed Start Survey / Learn More buttons per request */}
      </section>
      <section>
        <SurveyForm />
        <ConfigDebug />
      </section>
      <section id="about" className="pt-10 border-t border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">{t('Why Your Input Matters','किन तपाईंको प्रतिक्रिया महत्वपूर्ण छ')}</h2>
        <div className="space-y-4 text-sm text-neutral-400 leading-relaxed max-w-3xl">
          <p>{t(
            'We’re at an early stage—your insights help us prioritize which features launch first and what pain points we must solve immediately.',
            'हामी सुरुवाती चरणमा छौं—तपाईंका विचारहरूले कुन सुविधा पहिले ल्याउने वा कुन समस्यालाई तुरुन्त समाधान गर्नुपर्ने भन्ने प्राथमिकता निर्धारण गर्न मद्दत गर्दछ।'
          )}</p>
          <p>{t(
            'If you opt in to be contacted, we may reach out for short follow-ups or early beta invites.',
            'यदि तपाईं सम्पर्क गर्न सहमत हुनुहुन्छ भने, हामी छोटो फलोअप वा प्रारम्भिक बीटा निमन्त्रणा लागि सम्पर्क गर्न सक्छौं।'
          )}</p>
          <p className="text-[11px] md:text-xs text-neutral-500">{t('You can close this page any time—partial answers are still valuable if submitted.','तपाईं जुनसुकै बेला यो पृष्ठ बन्द गर्न सक्नुहुन्छ—यदि पेश भयो भने अपूर्ण उत्तर पनि उपयोगी हुन्छन्।')}</p>
        </div>
      </section>
    </div>
  );
}
