/**
 * Teste de ponta a ponta do botão "Enviar tarefas ao calendário" (navegador real), na v5 do TaskFlow.
 * Requer Playwright e um servidor local:  python3 -m http.server 8790
 * Uso: node tests/calendar-export.e2e.cjs [http://localhost:8790/] [pasta-de-saída-dos-.ics]
 * Os .ics gerados são validados à parte por tests/validate_ics.py (biblioteca icalendar).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.argv[2] || 'http://localhost:8790/';
const OUT = process.argv[3] || fs.mkdtempSync('/tmp/tf-ics-');
fs.mkdirSync(OUT, { recursive: true });

const pad = (n) => String(n).padStart(2, '0');
const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const results = [];
const check = (name, ok, detail = '') => { results.push(ok); console.log(`${ok ? 'PASSOU' : 'FALHOU'}  ${name}${detail ? '  — ' + detail : ''}`); };

const TASKS = [
  { title: 'Reunião com cliente; contrato, anexo', description: 'Levar notebook\nImprimir 2 vias', due: day(2), reminder: '10:00' },
  { title: 'Pagar aluguel', due: day(5), repeat: 'monthly' },
  { title: 'Treino', due: day(-3), reminder: '06:30', repeat: 'weekly' },
  { title: 'Entregar relatório atrasado', due: day(-2) },
  { title: 'Ideia sem data' },
  { title: 'Tarefa já concluída', due: day(3), done: true },
  { title: 'Preparar apresentação trimestral para a diretoria — açúcar, ação, coração, avaliação', description: 'Incluir gráficos de receita; comparar com o ano anterior, revisar premissas e alinhar com o time financeiro antes da reunião de quinta-feira. Não esquecer das notas de rodapé.', due: day(7), reminder: '14:15' },
  { title: 'Data inválida', due: 'amanhã' },
  { title: 'Hora inválida', due: day(4), reminder: '25:99' },
  { title: 'Data impossível', due: '2026-02-30' },
];

// Como uma pessoa usaria: digita o nome na primeira visita, toca para pular a entrada,
// fecha a ajuda da primeira visita e dispensa avisos de lembrete que aparecem.
async function clearOverlays(page) {
  for (let i = 0; i < 10; i++) {
    if (await page.isVisible('#nameForm')) { await page.fill('#nameIn', 'Teste'); await page.click('#nameForm button[type="submit"]'); }
    else if (await page.isVisible('#entry')) await page.click('#entry', { force: true });
    else if (await page.isVisible('#helpDlg[open]')) await page.evaluate(() => document.querySelector('#helpDlg').close());
    else if (await page.isVisible('#alerts.show #aDismiss')) await page.click('#aDismiss');
    else break;
    await page.waitForTimeout(500);
  }
}
async function seedThroughApp(page) {
  await clearOverlays(page);
  await page.click('#menuBtn');
  await page.click('#mImport');
  await page.fill('#importData', JSON.stringify(TASKS));
  await page.click('#importForm button[type="submit"]');
  await page.waitForTimeout(400);
  await clearOverlays(page);
}

(async () => {
  const browser = await chromium.launch();

  // ---- A) iPhone: folha de compartilhamento (navigator.share com arquivo) ----
  let ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => {
    navigator.canShare = () => true;
    navigator.share = async ({ files }) => { window.__shared = { name: files[0].name, type: files[0].type, text: await files[0].text(), at: performance.now() }; };
  });
  let page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE);
  await seedThroughApp(page);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('taskflow')).length);
  check('Tarefas criadas pelo formulário de importar do app', stored === TASKS.length, `${stored} tarefas salvas`);
  await clearOverlays(page);
  await page.click('#menuBtn');
  check('Botão "Enviar tarefas ao calendário" está no menu', await page.isVisible('#mCal'));
  await page.click('#mCal');
  await page.waitForFunction(() => window.__shared, null, { timeout: 5000 });
  const shared = await page.evaluate(() => window.__shared);
  fs.writeFileSync(path.join(OUT, 'share.ics'), shared.text);
  check('Compartilha um arquivo .ics com o tipo text/calendar', shared.name.endsWith('.ics') && shared.type === 'text/calendar', `${shared.name}`);
  const toastTxt = await page.textContent('#toast');
  check('Aviso conta quantas entraram e quais ficaram de fora', /4 tarefas/.test(toastTxt) && /1 sem data/.test(toastTxt) && /1 atrasada/.test(toastTxt) && /3 com data ou hora inválida/.test(toastTxt), toastTxt.trim());
  await page.screenshot({ path: path.join(OUT, 'iphone-toast.png') });
  check('Sem erros de JavaScript (caminho do iPhone)', errors.length === 0, errors.join(' | '));
  await ctx.close();

  // ---- B) sem suporte a compartilhar arquivo: baixa o .ics ----
  ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  await ctx.addInitScript(() => { navigator.canShare = () => false; });
  page = await ctx.newPage();
  await page.goto(BASE);
  await seedThroughApp(page);
  await clearOverlays(page);
  await page.click('#menuBtn');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#mCal')]);
  await dl.saveAs(path.join(OUT, 'download.ics'));
  check('Sem compartilhamento, baixa o arquivo', /^taskflow-tarefas-\d{4}-\d{2}-\d{2}\.ics$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  const same = fs.readFileSync(path.join(OUT, 'download.ics'), 'utf8').replace(/(UID|DTSTAMP):\S+/g, '') === shared.text.replace(/(UID|DTSTAMP):\S+/g, ''); // ids do import e a hora do carimbo variam a cada execução
  check('Download e compartilhamento geram o mesmo conteúdo', same);

  // ---- C) botão por tarefa continua funcionando ----
  await page.evaluate(() => { document.querySelector('#menu').close?.(); });
  const one = await page.evaluate(() => { const t = JSON.parse(localStorage.getItem('taskflow')).find((x) => x.title === 'Pagar aluguel'); return icsFor(t); });
  check('Evento único (botão por tarefa) continua com 1 VEVENT e 1 VALARM', (one.match(/BEGIN:VEVENT/g) || []).length === 1 && (one.match(/BEGIN:VALARM/g) || []).length === 1);
  await ctx.close();

  // ---- D) nada para enviar ----
  ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  page = await ctx.newPage();
  let downloads = 0; page.on('download', () => downloads++);
  await page.goto(BASE);
  await clearOverlays(page);
  await page.click('#menuBtn');
  await page.click('#mCal');
  await page.waitForTimeout(400);
  const emptyToast = await page.textContent('#toast');
  check('Sem tarefas: avisa e não gera arquivo', /Nenhuma tarefa aberta com data/.test(emptyToast) && downloads === 0, emptyToast.trim());
  await ctx.close();

  await browser.close();
  console.log(`\n${results.filter(Boolean).length}/${results.length} verificações passaram. .ics em ${OUT}`);
  process.exit(results.every(Boolean) ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
