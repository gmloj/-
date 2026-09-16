import React, { useState } from 'react';
import { ChevronRight, Receipt, CheckCircle2, Image } from 'lucide-react';
import { UserState, Expense } from '../../types';
interface Props { userState:UserState; onBack:()=>void; onExpenseAdded?:(expense:Omit<Expense,'id'|'timestamp'>)=>void }
export function InvoiceScanScreen({onBack,onExpenseAdded}:Props) {
 const [merchant,setMerchant]=useState('');
 const [amount,setAmount]=useState('');
 const [preview,setPreview]=useState('');
 const [saved,setSaved]=useState(false);
 const [error,setError]=useState('');
 const valid=merchant.trim() && Number.isFinite(Number(amount)) && Number(amount)>0;
 return <section className="min-h-[640px] bg-[#070A12] text-slate-100 p-5 rounded-3xl border border-slate-800 flex flex-col gap-5">
  <header className="flex justify-between items-center"><h1 className="font-black">إضافة فاتورة</h1><button onClick={onBack} title="رجوع"><ChevronRight/></button></header>
  <div className="text-center py-5"><Receipt className="mx-auto text-cyan-300 w-14 h-14 mb-3"/><h2 className="font-black text-xl">فواتيرك، تحت السيطرة</h2><p className="text-slate-400 text-sm mt-2">أرفق الصورة وراجع بياناتها بنفسك قبل الحفظ.</p></div>
  <p className="bg-cyan-500/10 border border-cyan-500/25 rounded-xl p-3 text-xs text-cyan-200">القراءة التلقائية غير مفعّلة في هذه النسخة. لن نستخرج أو نخمن مبلغاً من الصورة. الصورة للمعاينة فقط ولا تُحفظ.</p>
  <label className="border border-dashed border-cyan-500/50 p-5 rounded-2xl text-center cursor-pointer"><Image className="mx-auto mb-2"/>اختيار صورة الفاتورة<input aria-label="صورة الفاتورة" type="file" accept="image/*" className="block w-full mt-3 text-xs" onChange={e=>{const f=e.target.files?.[0];setError('');if(!f)return;if(!f.type.startsWith('image/')||f.size>10*1024*1024){setError('اختر صورة أصغر من 10 ميجابايت');return;}const reader=new FileReader();reader.onload=()=>setPreview(String(reader.result));reader.readAsDataURL(f);}}/></label>
  {preview && <img src={preview} alt="معاينة الفاتورة المرفقة" className="max-h-48 w-full object-contain rounded-xl"/>}
  <label className="text-sm">المتجر<input aria-label="المتجر" disabled={saved} value={merchant} onChange={e=>setMerchant(e.target.value)} className="block w-full mt-2 bg-[#10192e] border border-slate-700 rounded-xl p-3" placeholder="اسم المتجر"/></label>
  <label className="text-sm">المبلغ بالريال<input aria-label="المبلغ بالريال" disabled={saved} value={amount} onChange={e=>setAmount(e.target.value)} type="number" min="0.01" step="0.01" className="block w-full mt-2 bg-[#10192e] border border-slate-700 rounded-xl p-3" placeholder="0.00"/></label>
  {error && <p role="alert">{error}</p>}
  <button disabled={!valid||saved} onClick={()=>{if(valid&&!saved){onExpenseAdded?.({title:merchant.trim(),amount:Number(amount),category:'other'});setSaved(true);}}} className="bg-cyan-300 text-slate-950 rounded-full p-3 font-black mt-auto">{saved?'تم حفظ المصروف وخصمه من الرصيد':'تأكيد البيانات وإضافة المصروف'}</button>
  {saved && <CheckCircle2 className="mx-auto text-emerald-400"/>}
 </section>;
}
