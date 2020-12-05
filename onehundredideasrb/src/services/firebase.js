var firebaseConfig = {
    apiKey: "AIzaSyDEIgMKdu-0WhVRdGrzh-EiqGme6g1hca0",
    authDomain: "pharmhelper-6d6dc.firebaseapp.com",
    projectId: "pharmhelper-6d6dc",
    storageBucket: "pharmhelper-6d6dc.appspot.com",
    messagingSenderId: "1018457457757",
    appId: "1:1018457457757:web:4acb474168f8ae465ef9b4",
    measurementId: "G-7XEEWN3JNE"
};

const my_app = firebase.initializeApp(firebaseConfig);
exports.db = my_app.firestore();