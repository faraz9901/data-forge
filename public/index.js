const socket = io();

// adding event listeners to forms

document
    .getElementById('summarizer')
    .addEventListener('submit', (event) => {
        event.preventDefault();
        const text = event.target.text.value;
        socket.emit('summarize', text);
        toast(true)
    });


document
    .getElementById('mock-data')
    .addEventListener('submit', (event) => {
        event.preventDefault();
        const schema = event.target.schema.value;
        socket.emit('create-mock-data', { schema });
        toast(true)
    });



// Socket connections
socket.on('summarized', (data) => {
    const output = document.getElementById('output-summarizer');
    output.classList.remove('hidden')
    output.textContent = "";

    for (const letter of data) {
        setTimeout(() => {
            output.textContent += letter;
        }, 1000);
    }

    toast(false)
})

socket.on('mock-data', (data) => {
    const output = document.getElementById('output-mock-data');
    output.classList.remove('hidden')
    output.textContent = "";

    for (const letter of data) {
        setTimeout(() => {
            output.textContent += letter;
        }, 1000);
    }

    toast(false)
})

socket.on('error', (error) => {
    alert(error)
})


// Helper functions
const toast = (show) => {
    const loader = document.getElementById('loader');
    let isHidden = show ? true : false;
    if (isHidden) {
        loader.classList.remove('loader-hide')

        // Hiding the loader
        setTimeout(() => {
            loader.classList.add('loader-hide')
        }, 5000);

    } else {
        loader.classList.add('loader-hide')
    }
}

const copy = (id, buttonID) => {
    const text = document.getElementById(id).textContent
    if (!text || !text.trim()) return
    navigator.clipboard.writeText(text)
    document.getElementById('copy-' + buttonID).textContent = "Copied!"
}

