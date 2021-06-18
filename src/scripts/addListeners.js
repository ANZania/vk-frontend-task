const addListeners = () => {
    const emojiPicker = document.querySelector('.emoji-picker-wrapper');
    document.addEventListener('click', (event) => {
        if (event.target.closest('.emoji-button')) {
            if (emojiPicker.classList.contains('active')) {
                emojiPicker.classList.remove('active')
            } else {
                emojiPicker.classList.add('active')
            }
        }
    })
}
//
// export  default  addListeners()