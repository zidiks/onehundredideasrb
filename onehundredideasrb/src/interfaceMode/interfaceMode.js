require('./interfaceMode.css');
const template = require('./interfaceMode.html');
const { db } = require('../services/firebase');

const OnInit = () => {
    const symptoms = [];
    var addedSymptoms = [];
    const deseases = [];
    var deseasesResults = [];
    var drugsResults = [];

    const addSymptom = document.getElementById('myInputBtn');
    const myInput = document.getElementById('myInput');
    const myResults = document.getElementById('myResults');
    const myAnalys = document.getElementById('myAnalysis');
    const interfaceMode = document.getElementById('interfaceMode');
    const backBtn = document.getElementById('back');
    const desResults = document.getElementById('desease-results');
    const myClear = document.getElementById('myClear');
    const backLastBtn = document.getElementById('back-last');

    db.collection("symptoms").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //console.log(doc.id, doc.data());
            symptoms.push(doc.id);
        });
    });

    db.collection("desease").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            deseases.push(doc.data());
        });
    });



    myClear.removeEventListener('click', clearSympt);
    myClear.addEventListener('click', clearSympt);

    backBtn.removeEventListener('click', backFunc);
    backBtn.addEventListener('click', backFunc);

    backLastBtn.removeEventListener('click', backLastFunc);
    backLastBtn.addEventListener('click', backLastFunc);

    addSymptom.removeEventListener('click', adSymt);
    addSymptom.addEventListener('click', adSymt);

    myAnalys.removeEventListener('click', analysSymt);
    myAnalys.addEventListener('click', analysSymt);

    function clearSympt() {
        addedSymptoms = [];
        myResults.innerHTML = '';
    }

    function backLastFunc() {
        interfaceMode.style.transform = `translateX(-33.33%)`;
    }

    function analysSymt() {
        deseasesResults = [];
        desResults.innerHTML = '';
        if (addedSymptoms.length > 0) {
            //console.log('analysed', deseases);
            deseases.forEach((el, id) => {
                let count = 0;
                addedSymptoms.forEach((sympt, index) => {
                    if (Object.keys(el.symptoms).map(s => s.trim()).includes(sympt)) count++;
                });
                //console.log(Object.keys(el.symptoms));
                //console.log(count);
                if ((count / addedSymptoms.length) > 0.49) deseasesResults.push({
                    rate: Math.round(count / addedSymptoms.length * 100),
                    description: el.discription,
                    name: el.name,
                    id: id
                });
            });
            deseasesResults.sort((a, b) => { a.rate - b.rate });
            if (deseasesResults.length > 0) {
                deseasesResults.forEach(res => {
                    let desRes = document.createElement('li');
                    desRes.classList.add('des-li');
                    desRes.innerHTML = `<span style="color:#3eb75d; font-weight: 600;">${res.name}:</span> ${res.description} ${addedSymptoms.length > 2 ? '(' + res.rate + '% совпадений)' : ''}`;
                    desRes.addEventListener('click', () => {
                        drugsResults = [];
                        Object.keys(deseases[res.id].drugs).forEach(item => {
                            let count = 0;
                            addedSymptoms.forEach(sympt => {
                                if (Object.keys(deseases[res.id].drugs[item].sympt).map(s => s.trim()).includes(sympt)) count++;
                            });
                            if (count > 0) drugsResults.push(item);
                        });
                        let dr = document.getElementById('drugs-results');
                        dr.innerHTML = '';
                        drugsResults.forEach(el => {
                            let div = document.createElement('div');
                            div.innerHTML = el;
                            dr.appendChild(div);
                        })
                        interfaceMode.style.transform = `translateX(-66.66%)`;
                    })
                    desResults.appendChild(desRes);
                });
            } else {
                desResults.innerHTML = 'совпадений не найдено'
            }
            console.log('Возможные заболевания', deseasesResults);
            interfaceMode.style.transform = `translateX(-33.33%)`;
        }

    }

    function backFunc() {
        interfaceMode.style.transform = `translateX(0)`;
    }

    function adSymt() {
        if (symptoms.includes(myInput.value) && !addedSymptoms.includes(myInput.value)) {
            console.log(myInput.value);
            let addResult = document.createElement('li');
            addResult.classList.add('sympt-li')
            addResult.innerHTML = myInput.value;
            myResults.appendChild(addResult);
            addedSymptoms.push(myInput.value);
            console.log(addedSymptoms);
            myInput.value = '';
        }
    }

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].toUpperCase().includes(val.toUpperCase())) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    let currPoint = arr[i].toUpperCase().indexOf(val.toUpperCase());
                    b.innerHTML = arr[i].substr(0, currPoint);
                    b.innerHTML += "<strong>" + arr[i].substr(currPoint, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(currPoint + val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function(e) {
            closeAllLists(e.target);
        });
    }

    autocomplete(document.getElementById("myInput"), symptoms);
}

module.exports = {
    template: template,
    oninit: OnInit
}