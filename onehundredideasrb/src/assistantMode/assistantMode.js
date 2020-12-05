require('./assistantMode.css');
const template = require('./assistantMode.html');

const OnInit = () => {
    console.log('assistantMode ready')
}

module.exports = {
    template: template,
    oninit: OnInit
}