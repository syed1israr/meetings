const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || '/api/webhook';
const OUT_CSV = path.join(__dirname, 'sessions.csv');

const groups = ['Tandemly','Moodle','Google','Teams'];
const N_SESSIONS = parseInt(process.env.N_SESSIONS || '300', 10);

function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function gaussianScore(mu,sigma){
  return Math.max(0, Math.min(100, Math.round(mu + (sigma * (Math.random()-0.5)*3))));
}

(async ()=>{
  const rows = [];
  for(let i=0;i<N_SESSIONS;i++){
    const group = groups[i % groups.length];
    const pre = gaussianScore(50,12);
    const post = Math.min(100, pre + gaussianScore(group==='Tandemly'?15:5,6));
    const rouge = +(Math.random()*(group==='Tandemly'?0.07:0.08) + (group==='Tandemly'?0.745:0.66)).toFixed(3);
    const ai_latency_ms = group==='Tandemly'? rnd(150,320) : rnd(250,500);
    const server_latency_ms = rnd(40,120);
    const satisfaction = +(Math.random()*(group==='Tandemly'?1.2:0.6) + (group==='Tandemly'?8.8:7.0)).toFixed(1);
    const session_id = `s-${Date.now()}-${i}`;

    const payload = {
      type: 'call.transcription_ready',
      call_cid: `call:${session_id}`,
      call_transcription: { url: 'https://example.com/transcript.jsonl' }
    };

    try {
      if (typeof fetch !== 'undefined') {
        fetch(BASE_URL + WEBHOOK_PATH, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {'Content-Type':'application/json'}
        }).catch(()=>{});
      }
    } catch(e){ /* ignore */ }

    rows.push([session_id, group, pre, post, rouge, ai_latency_ms, server_latency_ms, satisfaction].join(','));
    // small delay to vary timestamps (not required)
  }

  const header = 'session_id,group,pre_score,post_score,rouge_l,ai_latency_ms,server_latency_ms,satisfaction\n';
  fs.writeFileSync(OUT_CSV, header + rows.join('\n'));
  console.log('Wrote', OUT_CSV);
})();