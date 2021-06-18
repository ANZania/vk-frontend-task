// const addListeners = import('./addListeners');
const addListeners = () => {
    const emojiPicker = document.querySelector('.emoji-picker-wrapper');
    let expireTimerId;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) || (window.clientWidth <= 1024)) {
        document.addEventListener('click', (event) => {
            if (event.target.closest('.button-container')) {
                if (emojiPicker.classList.contains('active')) {
                    emojiPicker.classList.remove('active')
                } else {
                    emojiPicker.classList.add('active')
                }
            }
        })
        alert('mob')
    } else {
        document.addEventListener('mouseover', (event) => {
            if (event.target.closest('.emoji-button')) {
                if (!emojiPicker.classList.contains('active')) {
                    emojiPicker.classList.add('active')
                }
            }
            if (event.target.closest('.emoji-picker-wrapper')) {
                clearTimeout(expireTimerId)
            }
        })
        document.addEventListener('mouseout', (event) => {
            if (event.target.closest('.emoji-button') || event.target.closest('.emoji-picker-wrapper')) {
                if (emojiPicker.classList.contains('active')) {
                    expireTimerId = setTimeout(() => {
                        emojiPicker.classList.remove('active')
                    }, 300)
                }
            }
        })
    }
}
addListeners();