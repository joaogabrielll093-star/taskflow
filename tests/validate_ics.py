"""Valida um .ics gerado pelo TaskFlow com a biblioteca icalendar (pip install icalendar).
Uso: python3 tests/validate_ics.py arquivo.ics"""
import sys, re
from icalendar import Calendar

raw = open(sys.argv[1], 'rb').read()
text = raw.decode('utf-8')
ok = True
def check(name, cond, detail=''):
    global ok
    ok &= bool(cond)
    print(('PASSOU  ' if cond else 'FALHOU  ') + name + (('  — ' + str(detail)) if detail else ''))

check('Só CRLF como quebra de linha', '\n' not in text.replace('\r\n', ''))
lines = text.split('\r\n')
longest = max(len(l.encode('utf-8')) for l in lines)
check('Nenhuma linha passa de 75 octetos (RFC 5545)', longest <= 75, f'maior: {longest}')
def utf8_ok(b):
    try:
        b.decode('utf-8'); return True
    except UnicodeDecodeError:
        return False
check('Cada linha física é UTF-8 válido sozinha (dobra não corta caractere)', all(utf8_ok(l) for l in raw.split(b'\r\n')))
folded = [l for l in lines if l.startswith(' ')]
check('Há linhas dobradas no arquivo de teste (título e descrição longos)', len(folded) >= 2, f'{len(folded)} continuações')

cal = Calendar.from_ical(raw)
events = [c for c in cal.walk('VEVENT')]
check('Um único VCALENDAR', text.count('BEGIN:VCALENDAR') == 1 and text.count('END:VCALENDAR') == 1)
uids = [str(e['UID']) for e in events]
check('UIDs únicos', len(set(uids)) == len(uids), len(uids))
check('Cada evento tem exatamente 1 alarme', all(len(list(e.walk('VALARM'))) == 1 for e in events))
by = {str(e['SUMMARY']): e for e in events}
print('        eventos:', ' | '.join(sorted(by)))
check('Acentos, vírgula e ponto e vírgula voltam intactos', 'Reunião com cliente; contrato, anexo' in by)
check('Descrição com quebra de linha volta intacta', 'Levar notebook\nImprimir 2 vias' in str(by['Reunião com cliente; contrato, anexo']['DESCRIPTION']))
long_t = [k for k in by if k.startswith('Preparar apresentação')][0]
check('Título longo com acentos (dobrado) volta inteiro', long_t.endswith('açúcar, ação, coração, avaliação'), len(long_t))
check('Descrição longa dobrada volta inteira', str(by[long_t]['DESCRIPTION']).endswith('Não esquecer das notas de rodapé.'))
r = by['Reunião com cliente; contrato, anexo']
check('Com horário: evento de 30 min e alarme na hora (PT0M)', r['DTSTART'].dt.strftime('%H:%M') == '10:00' and (r['DTEND'].dt - r['DTSTART'].dt).seconds == 1800 and list(r.walk('VALARM'))[0]['TRIGGER'].dt.total_seconds() == 0)
a = by['Pagar aluguel']
check('Sem horário: dia inteiro, alarme às 9h e repetição mensal', not hasattr(a['DTSTART'].dt, 'hour') and list(a.walk('VALARM'))[0]['TRIGGER'].dt.total_seconds() == 9 * 3600 and a['RRULE']['FREQ'] == ['MONTHLY'])
t = by['Treino']
check('Recorrente atrasada entra e mantém a repetição semanal', t['RRULE']['FREQ'] == ['WEEKLY'])
for nome in ['Entregar relatório atrasado', 'Ideia sem data', 'Tarefa já concluída', 'Data inválida', 'Hora inválida', 'Data impossível']:
    check(f'Fora do arquivo: {nome}', nome not in by)
check('Total de eventos esperado (4)', len(events) == 4, len(events))
sys.exit(0 if ok else 1)
