'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Otwórz menu');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelector('#year').textContent = new Date().getFullYear();

const lessons = {
  networks: {
    title: 'Sieci komputerowe — pierwszy pakiet',
    body: '<p><strong>Model OSI</strong> opisuje komunikację w siedmiu warstwach: fizycznej, łącza danych, sieciowej, transportowej, sesji, prezentacji i aplikacji. W modelu TCP/IP wyróżniamy warstwy dostępu do sieci, internetową, transportową i aplikacji.</p><p><strong>IPv4</strong> ma 32 bity. Adres <code>192.168.1.10/24</code> należy do podsieci <code>192.168.1.0</code> z maską <code>255.255.255.0</code>. Typowy zakres hostów to 192.168.1.1–192.168.1.254, a adres rozgłoszeniowy to 192.168.1.255.</p><p><strong>DNS</strong> odwzorowuje nazwy na rekordy, m.in. adresy IP. <strong>DHCP</strong> przydziela konfigurację sieciową automatycznie. Router przekazuje pakiety między sieciami.</p><ol><li>Sprawdź adres poleceniem <code>ip addr</code> (Linux) lub <code>ipconfig</code> (Windows).</li><li>Użyj <code>ping 127.0.0.1</code>, aby sprawdzić stos IP lokalnego urządzenia.</li><li>Oblicz adres sieci i broadcast dla 192.168.10.70/26. Odpowiedź: sieć 192.168.10.64, broadcast 192.168.10.127.</li></ol><p>Brak odpowiedzi na ping nie zawsze oznacza awarię — ruch ICMP może być filtrowany.</p>'
  },
  linux: {
    title: 'Linux — oswój terminal',
    body: '<p>Linux rozróżnia wielkość liter. Katalog <code>/</code> jest korzeniem systemu plików, a <code>~</code> oznacza katalog domowy użytkownika.</p><ul><li><code>pwd</code> — wyświetla bieżący katalog.</li><li><code>ls -la</code> — pokazuje pliki, również ukryte, i ich uprawnienia.</li><li><code>cd nazwa</code> — zmienia katalog; <code>cd ..</code> przechodzi poziom wyżej.</li><li><code>mkdir cwiczenia</code> — tworzy katalog.</li><li><code>chmod 640 notatka.txt</code> — właściciel może czytać i pisać, grupa czytać, pozostali nie mają dostępu.</li><li><code>systemctl status ssh</code> — sprawdza usługę SSH na systemach z systemd (nazwa bywa też sshd).</li></ul><p><strong>Ćwiczenie w maszynie wirtualnej:</strong> utwórz katalog, przejdź do niego i wykonaj <code>touch notatka.txt</code>. Sprawdź uprawnienia przez <code>ls -l</code>. Uprawnienia administratora nadawaj tylko wtedy, gdy są potrzebne.</p>'
  },
  windows: {
    title: 'Windows Server — podstawy domeny',
    body: '<p><strong>Active Directory Domain Services</strong> centralizuje zarządzanie użytkownikami i komputerami. Kontroler domeny obsługuje uwierzytelnianie, a DNS umożliwia klientom odnalezienie usług domenowych.</p><p><strong>GPO</strong> to obiekty zasad grupy. Można je wiązać z lokacjami, domenami i jednostkami organizacyjnymi (OU), aby wdrażać ustawienia komputerów i użytkowników.</p><ol><li>Przygotuj odizolowaną maszynę wirtualną z Windows Server i klienta Windows obsługującego dołączanie do domeny.</li><li>Ustaw stały adres serwera, zainstaluj rolę AD DS z DNS i skonfiguruj testową domenę, np. lab.example.test.</li><li>Ustaw DNS klienta na adres kontrolera domeny, a następnie dołącz klienta do domeny.</li><li>Utwórz testowego użytkownika w OU i sprawdź logowanie.</li></ol><p><strong>Udziały:</strong> przy dostępie przez sieć obowiązują uprawnienia udziału oraz NTFS — wynikowy dostęp uwzględnia ograniczenia obu zestawów. Polecenia <code>ipconfig /all</code> i <code>gpresult /r</code> pomagają w diagnostyce.</p><p>Ćwiczenia wykonuj w środowisku laboratoryjnym, nie na produkcyjnym kontrolerze domeny.</p>'
  }
};
const lesson = document.querySelector('#lesson');
let lessonTrigger;
let activeCourse;
let completed = new Set();
try {
  const saved = JSON.parse(localStorage.getItem('packetlab-progress') || '[]');
  if (Array.isArray(saved)) completed = new Set(saved.filter(key => Object.hasOwn(lessons, key)));
} catch { /* Nauka działa także przy zablokowanej pamięci przeglądarki. */ }
function updateProgress() {
  document.querySelector('#learning-progress').value = completed.size;
  document.querySelector('#progress-label').textContent = `Twoje postępy: ${completed.size} z 3 ścieżek`;
  document.querySelectorAll('[data-course]').forEach(button => {
    const done = completed.has(button.dataset.course);
    button.closest('.course').classList.toggle('completed', done);
    button.closest('.course').querySelector('.badge').textContent = done ? 'OPANOWANE ✓' : {networks:'PODSTAWY',linux:'SYSTEMY',windows:'ADMINISTRACJA'}[button.dataset.course];
  });
  document.querySelector('#complete-lesson').textContent = completed.has(activeCourse) ? 'Cofnij oznaczenie opanowania' : 'Oznacz jako opanowane ✓';
}
updateProgress();
document.querySelector('#complete-lesson').addEventListener('click', () => {
  if (!activeCourse) return;
  if (completed.has(activeCourse)) completed.delete(activeCourse);
  else completed.add(activeCourse);
  try {
    localStorage.setItem('packetlab-progress', JSON.stringify([...completed]));
    document.querySelector('#save-status').textContent = 'Postępy zapisane w tej przeglądarce.';
  } catch {
    document.querySelector('#save-status').textContent = 'Pamięć przeglądarki jest niedostępna. Postępy zachowamy tylko do zamknięcia strony.';
  }
  updateProgress();
});
document.querySelector('#course-search').addEventListener('input', event => {
  const query = event.target.value.trim().toLocaleLowerCase('pl');
  let visible = 0;
  document.querySelectorAll('.course').forEach(card => {
    const key = card.querySelector('[data-course]').dataset.course;
    const matches = (card.textContent + ' ' + lessons[key].body).toLocaleLowerCase('pl').includes(query);
    card.hidden = !matches;
    if (matches) visible++;
  });
  document.querySelector('#search-status').textContent = visible ? `Dostępne ścieżki: ${visible} z 3.` : 'Brak wyników. Spróbuj hasła „Linux”, „DNS” lub „GPO”.';
});
document.querySelectorAll('[data-course]').forEach(button => {
  button.addEventListener('click', () => {
    lessonTrigger = button;
    activeCourse = button.dataset.course;
    document.querySelector('#save-status').textContent = '';
    updateProgress();
    const content = lessons[button.dataset.course];
    document.querySelector('#lesson-title').textContent = content.title;
    // Only fixed, author-written lesson markup is inserted here; no user input.
    document.querySelector('#lesson-body').innerHTML = content.body;
    lesson.hidden = false;
    lesson.focus({ preventScroll: true });
    lesson.scrollIntoView({ block: 'start' });
  });
});
document.querySelector('#close-lesson').addEventListener('click', () => {
  lesson.hidden = true;
  lessonTrigger?.focus();
});

const commands = {
  help: 'Dostępne polecenia (symulacja):\nhelp       — pomoc\npwd        — bieżący katalog\nls         — pliki w katalogu\nwhoami     — użytkownik\nip addr    — przykładowy adres IP\nping       — przykładowa odpowiedź ICMP\nclear      — wyczyść ekran',
  pwd: '/home/student',
  ls: 'notatki.txt    cwiczenia    sieci',
  whoami: 'student',
  'ip addr': 'eth0: UP\n    inet 192.168.1.10/24\n    brama: 192.168.1.1\nDane przykładowe — nie odczytujemy Twojej sieci.',
  ping: 'PING 192.168.1.1 (symulacja)\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=1ms\n1 packets transmitted, 1 received, 0% packet loss'
};
const output = document.querySelector('#terminal-output');
document.querySelector('#terminal-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#terminal-input');
  const command = input.value.trim().replace(/\s+/g, ' ');
  if (!command) return;
  if (command === 'clear') output.replaceChildren();
  else {
    const entry = document.createElement('p');
    const known = Object.prototype.hasOwnProperty.call(commands, command);
    entry.textContent = '$ ' + command + '\n' + (known ? commands[command] : 'Nieznane polecenie. Wpisz help. To ograniczony symulator, nie prawdziwa powłoka.');
    output.append(entry);
    if (output.children.length > 30) output.firstElementChild.remove();
    output.scrollTop = output.scrollHeight;
  }
  input.value = '';
});

const questions = [
  { text: 'Jaki jest adres sieci dla hosta 192.168.10.70/26?', answers: ['192.168.10.0', '192.168.10.64', '192.168.10.70', '192.168.10.128'], correct: 1, explanation: 'Maska /26 dzieli ostatni oktet na bloki po 64 adresy. Host 70 należy do bloku 64–127.' },
  { text: 'Co oznaczają uprawnienia 640 w systemie Linux?', answers: ['Wszyscy mogą zapisywać', 'Tylko właściciel może wykonywać', 'Właściciel: odczyt i zapis, grupa: odczyt, inni: brak', 'Właściciel i grupa mają pełen dostęp'], correct: 2, explanation: '4 oznacza odczyt, 2 zapis, 1 wykonanie. 6 = 4 + 2, a 0 oznacza brak uprawnień.' },
  { text: 'Dlaczego poprawny DNS jest ważny przy dołączaniu do domeny AD?', answers: ['Odnajduje usługi kontrolerów domeny', 'Zastępuje hasło użytkownika', 'Szyfruje każdy plik', 'Przydziela adresy MAC'], correct: 0, explanation: 'Klient korzysta m.in. z rekordów DNS SRV do odnajdywania usług Active Directory.' },
  { text: 'Która usługa automatycznie przydziela adresy IP urządzeniom?', answers: ['DNS', 'DHCP', 'HTTP', 'SSH'], correct: 1, explanation: 'DHCP przekazuje klientom m.in. adres IP, maskę, bramę i adresy serwerów DNS.' },
  { text: 'Które polecenie Linuxa wyświetla bieżący katalog?', answers: ['mkdir', 'chmod', 'pwd', 'whoami'], correct: 2, explanation: 'pwd (print working directory) wyświetla ścieżkę bieżącego katalogu.' },
  { text: 'Ile bitów ma adres IPv4?', answers: ['16', '32', '64', '128'], correct: 1, explanation: 'IPv4 ma 32 bity, zapisywane zwykle jako cztery oktety. IPv6 ma 128 bitów.' },
  { text: 'Do czego służą obiekty GPO w Windows Server?', answers: ['Do mierzenia opóźnień', 'Do nadawania adresów MAC', 'Do wdrażania zasad i ustawień', 'Wyłącznie do kopii zapasowych'], correct: 2, explanation: 'Zasady grupy pozwalają centralnie zarządzać ustawieniami użytkowników i komputerów.' },
  { text: 'Która warstwa OSI odpowiada za routing pakietów IP?', answers: ['Fizyczna', 'Łącza danych', 'Sieciowa', 'Aplikacji'], correct: 2, explanation: 'Warstwa trzecia, czyli sieciowa, obsługuje adresowanie logiczne i routing.' }
];
let questionIndex = 0;
let score = 0;
let answered = false;
const next = document.querySelector('#quiz-next');
const feedback = document.querySelector('#quiz-feedback');
const answers = document.querySelector('#quiz-answers');
function renderQuestion() {
  answered = false;
  const question = questions[questionIndex];
  document.querySelector('#quiz-progress').textContent = `${questionIndex + 1} / ${questions.length}`;
  document.querySelector('#quiz-question').textContent = question.text;
  answers.replaceChildren();
  feedback.textContent = '';
  next.hidden = true;
  next.textContent = questionIndex === questions.length - 1 ? 'Zobacz wynik →' : 'Następne pytanie →';
  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = index === question.correct;
      if (correct) score++;
      [...answers.children].forEach((option, i) => {
        option.disabled = true;
        if (i === question.correct) option.classList.add('correct');
        else if (i === index) option.classList.add('wrong');
      });
      feedback.textContent = (correct ? 'Dobrze! ' : 'Poprawna odpowiedź: ' + question.answers[question.correct] + '. ') + question.explanation;
      next.hidden = false;
      next.focus({ preventScroll: true });
    });
    answers.append(button);
  });
}
next.addEventListener('click', () => {
  if (questionIndex === questions.length) {
    questionIndex = 0;
    score = 0;
    renderQuestion();
    answers.firstElementChild.focus({ preventScroll: true });
    return;
  }
  questionIndex++;
  if (questionIndex < questions.length) {
    renderQuestion();
    answers.firstElementChild.focus({ preventScroll: true });
  } else {
    document.querySelector('#quiz-question').textContent = `Twój wynik: ${score} / ${questions.length}`;
    document.querySelector('#quiz-progress').textContent = 'UKOŃCZONO';
    answers.replaceChildren();
    feedback.textContent = score === questions.length ? 'Świetna robota! Przećwicz teraz zagadnienia w laboratorium.' : 'Wróć do materiałów, powtórz zagadnienia i spróbuj ponownie. Każda próba to krok naprzód.';
    next.textContent = 'Spróbuj ponownie ↻';
  }
});
renderQuestion();
