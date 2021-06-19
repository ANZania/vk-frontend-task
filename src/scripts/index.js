
const toggleListeners = (actionType) => {
    const emojiPicker = document.querySelector('.emoji-picker-wrapper');
    let expireTimerId;

    const toggleEmojiPickerClick = (event) => {
        if (!event.target.closest('.emoji-picker-wrapper')) {
            if (emojiPicker.classList.contains('active')) {
                emojiPicker.classList.remove('active')
            } else if (event.target.closest('.button-container') && !emojiPicker.classList.contains('active')) {
                emojiPicker.classList.add('active')
            }
        }
    }

    const toggleEmojiPickerMouseover = (event) => {
        if (event.target.closest('.emoji-button')) {
            if (!emojiPicker.classList.contains('active')) {
                emojiPicker.classList.add('active')
            }
        }
        if (event.target.closest('.emoji-picker-wrapper')) {
            clearTimeout(expireTimerId)
        }
    }

    const toggleEmojiPickerMouseout = (event) => {
        if (event.target.closest('.emoji-button') || event.target.closest('.emoji-picker-wrapper')) {
            if (emojiPicker.classList.contains('active')) {
                expireTimerId = setTimeout(() => {
                    emojiPicker.classList.remove('active')
                }, 300)
            }
        }
    }

    if (actionType === 'add') {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) || (window.screen.width <= 1024)) {
            document.addEventListener('click', toggleEmojiPickerClick, false)
        } else {
            document.addEventListener('mouseover', toggleEmojiPickerMouseover, false)
            document.addEventListener('mouseout', toggleEmojiPickerMouseout, false)
        }
    } else {
        document.removeEventListener('click', toggleEmojiPickerClick)
        document.removeEventListener('mouseover', toggleEmojiPickerMouseout)
        document.removeEventListener('mouseout', toggleEmojiPickerMouseover)
    }
}


toggleListeners('add');

window.addEventListener('resize', () => {
    toggleListeners('remove');
    toggleListeners('add');
});
