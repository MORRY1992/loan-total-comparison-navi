// Independent hypothetical model. No real lender schedule is represented.
export function simulate({principal,apr,months=36,payment=0,mode='annuity'}) {
 for(const v of [principal,apr,months,payment]) if(typeof v!=='number'||!Number.isFinite(v)) throw Error('数値を正しく入力してください。');
 if(!Number.isInteger(principal)||principal<1||principal>100000000) throw Error('借入残高は1円〜1億円の整数で入力してください。');
 if(apr<0||apr>30) throw Error('仮定の年利は0〜30％で入力してください。');
 if(!['annuity','principal','payment'].includes(mode)) throw Error('返済方式を確認してください。');
 if(!Number.isInteger(months)||months<1||months>600) throw Error('返済期間は1〜600か月の整数で入力してください。');
 const r=apr/1200;
 const regular=mode==='payment'?payment:mode==='principal'?Math.max(1,Math.ceil(principal/months)):Math.max(1,Math.round(r===0?principal/months:principal*r/(-Math.expm1(-months*Math.log1p(r)))));
 if(mode==='payment'&&(!Number.isInteger(payment)||payment<1||payment>100000000)) throw Error('毎月返済額は1円〜1億円の整数で入力してください。');
 let balance=principal,total=0,interest=0; const schedule=[];
 const limit=mode==='payment'?600:months;
 for(let n=1;n<=limit&&balance>0;n++) {
  const fee=Math.round(balance*r);
  if(mode==='payment'&&regular<=fee) throw Error('毎月返済額が利息以下のため完済できません。返済額を見直してください。');
  let pay=mode==='principal'?Math.min(regular,balance)+fee:Math.min(regular,balance+fee);
  if(mode!=='payment'&&n===limit) pay=balance+fee;
  const paidPrincipal=pay-fee;
  if(paidPrincipal<0) throw Error('返済額が利息を下回ります。条件を見直してください。');
  balance-=paidPrincipal; total+=pay; interest+=fee;
  schedule.push({month:n,payment:pay,principal:paidPrincipal,interest:fee,balance});
 }
 if(balance>0) throw Error('完済まで600か月を超えます。返済額を見直してください。');
 return {principal,apr,months:schedule.length,payment:schedule[0].payment,lastPayment:schedule.at(-1).payment,total,interest,schedule};
}
export function consolidate(loans, next, fee=0) {
 if(!Array.isArray(loans)||loans.length<1||loans.length>5) throw Error('借入は1〜5件にしてください。');
 if(!Number.isInteger(fee)||fee<0||fee>10000000) throw Error('手数料は0〜1,000万円の整数で入力してください。');
 const sims=loans.map(simulate);
 const before=sims.reduce((a,s)=>({principal:a.principal+s.principal,payment:a.payment+s.payment,total:a.total+s.total,interest:a.interest+s.interest,months:Math.max(a.months,s.months)}),{principal:0,payment:0,total:0,interest:0,months:0});
 const after=simulate({...next,principal:before.principal});
 return {before,after,fee,afterTotal:after.total+fee,monthlyDifference:after.payment-before.payment,totalDifference:after.total+fee-before.total,interestDifference:after.interest-before.interest,monthsDifference:after.months-before.months};
}
export function finishMonth(start, months){
 if(!/^\d{4}-\d{2}$/.test(start)) throw Error('初回返済月を指定してください。');
 const [y,m]=start.split('-').map(Number);if(y<2000||y>2100||m<1||m>12)throw Error('初回返済月は2000〜2100年で入力してください。');
 const d=new Date(Date.UTC(y,m-1+months-1,1));return `${d.getUTCFullYear()}年${d.getUTCMonth()+1}月`;
}
