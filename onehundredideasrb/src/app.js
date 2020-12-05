window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

require(['./main.css', './services/router']);
const { htmlDOM, states } = require('./services/globalProps');

const audioPlay = new Audio('/assets/start.wav');

htmlDOM.voiceAnimation = document.getElementById('voice-animation');
htmlDOM.voiceInfo = document.getElementById('voice-info');
htmlDOM.voiceMode = document.getElementById('voiceMode');

var checkTimer = undefined;

const endVoice = () => {
    //htmlDOM.voiceInfo.style.opacity = 1;
    htmlDOM.voiceAnimation.style.top = '90vh';
    states.voice = false;
    states.checkOrder = [];
    setTimeout(() => {
        htmlDOM.voiceMode.style.display = 'none';
    }, 200);
}

const voiceToggle = document.getElementById('voice-mode');
voiceToggle.addEventListener('click', () => {
    states.onTalk = !states.onTalk;
    if (states.onTalk) {
        voiceToggle.innerHTML = 'mic';
        audioPlay.volume = 0;
        audioPlay.play();
        //htmlDOM.voiceInfo.innerHTML = 'скажите «Привет, Адель»';
    } else {
        voiceToggle.innerHTML = 'mic_off';
        endVoice();
        if (checkTimer) clearInterval(checkTimer);
        //htmlDOM.voiceInfo.innerHTML = 'активируйте помощник  <span class="material-icons">mic</span>';
    }
})


const recognition = new SpeechRecognition();
// var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
recognition.interimResults = true;
recognition.lang = 'ru-Ru';

const voiceAnim = () => {
    htmlDOM.voiceAnimation.style.transform = 'scale(1.7)';
    setTimeout(() => {
        htmlDOM.voiceAnimation.style.transform = 'scale(1)';
    }, 500);
}

const startVoice = () => {
    htmlDOM.voiceMode.style.display = 'flex';
    setTimeout(() => {
        audioPlay.volume = 1;
        states.voice = true;
        //htmlDOM.voiceInfo.style.opacity = 0;
        htmlDOM.voiceAnimation.style.top = '0vh';
        audioPlay.currentTime = 0;
        setTimeout(() => {
            audioPlay.play();
        }, 100);
        const order = states.checkOrder;
        checkTimer = setInterval(() => {
            order.push(states.checkCache);
            console.log(order);
            if (order.length > 3) {
                if (order[order.length - 1] == order[order.length - 2] && order[order.length - 2] == order[order.length - 3]) {
                    endVoice();
                    clearInterval(checkTimer);
                } else states.checkOrder = [];
            }
        }, 5000);
    }, 100);
}

recognition.addEventListener('result', e => {
    if (states.onTalk) {
        voiceAnim();
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        states.checkCache = transcript;
        if (transcript.toLowerCase().includes('адель') && transcript.toLowerCase().includes('привет')) {
            if (!states.voice) startVoice();
        }
    }

    // if (!lock) {
    //     list.forEach(el => {
    //         if (transcript.toLowerCase().includes(el.name)) {
    //             document.getElementById('frame').src = el.src;
    //             document.getElementById('frame').style.display = 'block';
    //         }
    //     })
    //     lock = true;
    //     setTimeout(() => {
    //         lock = false
    //     }, 300);
    // }
});

setTimeout(() => {
    recognition.start();
}, 1000);

recognition.onend = function() {
    recognition.start();
};