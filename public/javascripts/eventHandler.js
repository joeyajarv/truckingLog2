class EventHandler {
    constructor() {
        EventHandler.prepApp();
        EventHandler.handleBegin();
        EventHandler.handleEnd();
        EventHandler.handleQuestion();
    }

    static prepApp() {
        document.getElementById('SSL_Instructions').style.display = 'none';
        document.getElementById('endDiv').style.display = 'none';
        document.getElementById('sure').style.display = 'none';
    }

    static handleBegin() {
        document.getElementById('begin').addEventListener('click', () => {
            document.getElementById('SSL_Instructions').style.display = 'block';
        document.getElementById('endDiv').style.display = 'block';
    });
    }

    static handleEnd() {
        document.getElementById('end').addEventListener('click', () => {
            document.getElementById('SSL_Instructions').style.display = 'none';
        document.getElementById('top').style.visibility = 'hidden';
        document.getElementById('endDiv').style.display = 'none';
        document.getElementById('sure').style.display = 'block';
    });
    }

    static handleQuestion() {
        const ANSWERS = document.forms['theForm'].elements['question'];
        for (let i = 0; i < ANSWERS.length; i++) {
            ANSWERS[i].addEventListener('click', () => {
                if (ANSWERS[i].value == 1) {
                window.open('http://zombo.com', '_self', false);
            } else {
                window.location.reload();
            }
        });
        }
    }
}

module.exports = EventHandler;