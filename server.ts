import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Lazy init for Gemini SDK
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Decision endpoint: "وش أفضل قرار أسويه الآن؟"
app.post('/api/dabbirni/decision', async (req: Request, res: Response) => {
  try {
    const { question, state } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مربوطة بعد. استخدم الإدخال اليدوي.' });

    const ai = getGeminiClient();
    const prompt = `
أنت «دبّرني» — رفيق الحياة المالية واليومية الذكي بالسعودية.
أنت مو شات بوت عام، أنت خبير وقريب للمستخدم، بلهجة سعودية ذكية، خفيفة دم، صريحة، وحكيمة جداً.
هدفك الإجابة على سؤال واحد فقط:
«وش أفضل قرار أسويه الآن؟»

بيانات المستخدم الحالية:
- الاسم: ${state?.name || 'صديقنا'}
- الراتب الشهري: ${state?.salary || 6000} ريال
- الرصيد المتبقي لين الراتب: ${state?.currentBalance || 730} ريال
- باقي على نزول الراتب: ${state?.daysToSalary || 12} يوم
- الميزانية اليومية الآمنة: ${state?.todaySpendingTarget || 47} ريال
- الصرف اليوم حتى الآن: ${state?.todayExpenses?.reduce((acc: number, e: { amount: number }) => acc + e.amount, 0) || 0} ريال
- الالتزامات والفواتير القادمة: ${JSON.stringify(state?.commitments || [])}
- قائمة الرغبات المؤجلة: ${JSON.stringify(state?.wishlist || [])}
- ملاحظات نمط الحياة: ${state?.lifestyleNotes || 'دوام، سيارة تحتاج صيانة، طلبات'}

سؤال أو حيرة المستخدم الآن:
"${question}"

المطلوب: اتخذ قراراً حاسماً وواقعياً جداً يخدم مصلحة المستخدم وميزانيته بدون فلسفة زائدة.
قم بالرد بصيغة JSON حصراً بهذا الهيكل:
{
  "decision": "go" أو "wait" أو "alternative" أو "warning",
  "decisionLabel": "عنوان القرار باختصار (مثلاً: توكل على الله / اصبر مو وقته / بديل ذكي / انتبه خطر)",
  "verdictTitle": "جملة حاسمة بلهجة سعودية خفيفة وعفوية مثل: لا تتحمس مو وقتها 😂 أو اطبخ ووفّر 40 ريال اليوم",
  "summary": "شرح القرار بحسبة رياضية واضحة ومباشرة مبنية على رصيده وأيامه المتبقية",
  "financialImpact": "الأثر المالي المباشر (مثلاً: توفير 60 ريال / خصم 400 ريال من رصيد الطوارئ)",
  "smartAlternative": "بديل حكيم وذكي يقضي الحاجة بأقل تكلفة أو خطة بديلة",
  "nextStep": "خطوة عملية واضحة يسويها المستخدم الآن فوراً",
  "tone": "humorous" أو "firm" أو "encouraging"
}
`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in decision endpoint:', error);
    return res.status(500).json({ error: 'Failed to generate decision' });
  }
});

// 2. Vision endpoint: تحليل الفاتورة / المنتج / العرض
app.post('/api/dabbirni/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', type = 'auto', state } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مربوطة بعد. استخدم الإدخال اليدوي.' });

    const ai = getGeminiClient();
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `
أنت «دبّرني» — رفيق الحياة والقرارات المالية في السعودية.
المستخدم التقط أو أرسل صورة يريد تحليلك المالي الصادق والحكيم لها.
نوع الصورة المتوقع: ${type === 'bill' ? 'فاتورة دفع أو إيصال' : type === 'product' ? 'منتج يريد شراءه' : type === 'offer' ? 'عرض تخفيض أو سكرين شوت إعلان' : 'تلقائي (فاتورة، منتج، أو عرض)'}.

وضع المستخدم المالي:
- الرصيد المتوفر: ${state?.currentBalance || 730} ريال
- الأيام المتبقية للراتب: ${state?.daysToSalary || 12} يوم
- الميزانية اليومية المسموحة: ${state?.todaySpendingTarget || 47} ريال
- الالتزامات القادمة: ${JSON.stringify(state?.commitments || [])}

المطلوب:
1. استخرج تفاصيل ما في الصورة (اسم الفاتورة أو المنتج أو تفاصيل العرض، والمبلغ إن وجد).
2. قيّم هل يناسب وضعه المالي حالياً أو فخ تسويقي أو فاتورة يجب دفعها أو تأجيلها.
3. اكتب خلاصة بلهجة سعودية واضحة ومباشرة وصادقة بدون مجاملة.

أرجع النتيجة بصيغة JSON حصراً بهذا الشكل:
{
  "type": "bill" أو "product" أو "offer" أو "other",
  "itemTitle": "اسم ما تم التعرف عليه (مثال: فاتورة كهرباء / سماعة آبل / عرض خصم مطعم 50%)",
  "extractedAmount": 150, // رقم المبلغ المستخرج أو التقديري إن وجد، أو null
  "verdict": "pay_now" أو "delay" أو "buy" أو "skip" أو "trap_alert" أو "good_deal",
  "verdictTitle": "عنوان الحكم الصريح والممتع (مثلاً: ادفعها فوراً ضرورية / اسحب عليه فخ تسويقي / مو وقتها أبداً 😂)",
  "verdictText": "التحليل المالي المباشر وتأثيره على رصيده الحالي وأيامه المتبقية",
  "impactExplanation": "شرح أثر هذه العملية على ميزانيته اليومية الآمنة",
  "smartAdvice": "نصيحة بديلة أو حيلة ذكية للاستفادة أو التوفير"
}
`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in vision endpoint:', error);
    return res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// 3. Daily Briefing endpoint (صباح دبّرني و ليل دبّرني)
app.post('/api/dabbirni/daily-briefing', async (req: Request, res: Response) => {
  try {
    const { mode = 'morning', state } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const totalSpentToday = state?.todayExpenses?.reduce((acc: number, e: { amount: number }) => acc + e.amount, 0) || 0;
    const safeTarget = state?.todaySpendingTarget || 47;
    const diff = totalSpentToday - safeTarget;

    if (!apiKey) return res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مربوطة بعد. استخدم الإدخال اليدوي.' });

    const ai = getGeminiClient();
    const prompt = `
أنت «دبّرني» — رفيق قرارات الحياة اليومية والمالية.
قم بإعداد إحاطة ${mode === 'morning' ? 'صباحية تبث الحماس والواقعية' : 'مسائية مريحة تقيّم الصرف وتعدل خطة الغد'} للمستخدم.

بيانات المستخدم:
- الاسم: ${state?.name || 'إيسكو'}
- باقي على الراتب: ${state?.daysToSalary || 12} يوم
- الرصيد الحالي: ${state?.currentBalance || 730} ريال
- الميزانية الآمنة لليوم: ${safeTarget} ريال
- الصرف المسجل اليوم: ${totalSpentToday} ريال
- الالتزامات القادمة: ${JSON.stringify(state?.commitments || [])}
- قائمة الرغبات: ${JSON.stringify(state?.wishlist || [])}
- النمط: ${state?.lifestyleNotes || 'دوام وسيارة'}

المطلوب:
إذا كان mode = morning:
قدّم صباح الخير مع عدد الأيام، ميزانية اليوم الآمنة، تذكير بأهم التزام قادم، وتعليق سريع وطريف على رغباته (مثل شراء السماعة: لا تتحمس مو وقتها 😂).

إذا كان mode = night:
راجع صرف اليوم مقارنة بالحد، وإذا كان أعلى وضّح الفرق بلطف وعدّل ميزانية بكرة ليرجع للمسار، أو امتدحه لو التزم.

أرجع JSON بهذا الهيكل:
{
  "greeting": "التحية بالاسم",
  "headline": "جملة رئيسية قوية ومريحة",
  "safeBudget": ${safeTarget},
  "totalSpent": ${totalSpentToday},
  "verdictSummary": "الرسالة الأساسية بالعامية السعودية الذكية",
  "actionableTip": "نصيحة محددة لليوم أو للغد",
  "statusBadge": "شارة الحالة (مثال: في المسار / انتبه / منضبط)"
}
`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in briefing endpoint:', error);
    return res.status(500).json({ error: 'Failed to generate daily briefing' });
  }
});

// Direct download endpoint for project ZIP
app.get(['/dabbirni-project.zip', '/api/download-zip'], (req: Request, res: Response) => {
  const zipFile = path.join(process.cwd(), 'public', 'dabbirni-project.zip');
  res.download(zipFile, 'dabbirni-project.zip');
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'dabbirni' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`دبّرني server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
