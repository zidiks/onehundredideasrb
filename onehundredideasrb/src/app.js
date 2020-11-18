require('./style.css');

const { list } = require('./list');

var lock = false;

console.log('Pharmacy Helper started');

const display = document.getElementById('display-inner');
const voiceStream = document.getElementById('voice-stream');

const drugsList = [];
list.forEach(el => {
    drugsList.push(el.name);
})

const grammar = '#JSGF V1.0; grammar drugs; public <drug> = ' + drugsList.join(' | ') + ' ;';

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

const recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.interimResults = true;
recognition.lang = 'ru-Ru';

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    voiceStream.innerHTML = transcript;
    if (!lock) {
        list.forEach(el => {
            if (transcript.toLowerCase().includes(el.name)) {
                document.getElementById('frame').src = el.src;
                document.getElementById('frame').style.display = 'block';
            }
        })
        lock = true;
        setTimeout(() => {
            lock = false
        }, 300);
    }
});

recognition.start();

recognition.addEventListener('end', recognition.start);