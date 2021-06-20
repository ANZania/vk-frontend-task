function manageListeners() {
    const images = require('../assets/icons/emoji/*/*.png');
    const buttonsToolbar = document.querySelectorAll('.emoji-toolbar__button');
    const emojiBlockWrapper = document.querySelector('.emoji-block_wrapper');
    const emojiRecentWrapper = document.querySelector('.emoji-recent_wrapper');
    const toggleEmojiStates = () => {
        buttonsToolbar.forEach((elem, index) => {
            if (!elem.classList.contains('active')) {
                if (index === 0) {
                    emojiBlockWrapper.classList.add('active');
                    emojiRecentWrapper.classList.remove('active')
                } else {
                    emojiBlockWrapper.classList.remove('active');
                    emojiRecentWrapper.classList.add('active')
                }
                elem.classList.add('active');
            } else {
                elem.classList.remove('active')
            }
        })
    }
    const toggleListeners = (actionType) => {
        const emojiPicker = document.querySelector('.emoji-picker-wrapper');
        let expireTimerId;

        const toggleEmojiPickerClick = (event) => {
            if (!event.target.closest('.emoji-picker-wrapper')) {
                if (emojiPicker.classList.contains('active')) {
                    emojiPicker.classList.remove('active')
                    if (emojiRecentWrapper.classList.contains('active')) {
                        toggleEmojiStates()
                    }
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
                        if (emojiRecentWrapper.classList.contains('active')) {
                            toggleEmojiStates()
                        }
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
    const initEmojiChoice = (event) => {
        if (event.target.closest('.emoji-addButton__container')) {
            event.preventDefault();
            const textInput = document.querySelector('.input');
            const elementId = event.target.closest('.emoji-addButton__container').id;
            const elementBlockIndex = event.target.closest('.emoji-addButton__container').attributes.blockindex.value;

            const imgSrc = images[elementBlockIndex][elementId];
            const img = document.createElement('img');
            img.setAttribute('src',imgSrc);
            img.setAttribute('class','emoji');

            const selection = window.getSelection();
            if (selection.rangeCount === 0 /* нет выделения */ ||
                // выделение лежит не в #conteneditable
                !textInput.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                // вставляем в конец элемента #editable
                textInput.appendChild(img);
                const range = document.createRange();
                range.selectNodeContents(textInput);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range)
            } else {
                let range = selection.getRangeAt(0);
                // сжимаем range в его правый конец
                range.collapse(false);
                // вставляем картинку
                range.insertNode(img);

                // делаем, чтобы курсор был после вставленной картинки
                selection.removeAllRanges();
                range.setStartAfter(img);
                selection.addRange(range);
            }

        } else if (event.target.closest('.emoji-toolbar__button')) {
                toggleEmojiStates()
        }
    }
    const resetFormatting = (event) => {
        if (event.target.closest('.input')) {
            event.preventDefault();
            const text = event.clipboardData.getData("text/plain");
            document.execCommand("insertHTML", false, text);
        }
    }

    toggleListeners('add');

    window.addEventListener('resize', () => {
        toggleListeners('remove');
        toggleListeners('add');
    });

    document.addEventListener('click', (event) => initEmojiChoice(event))
    document.addEventListener("paste", (event) => resetFormatting(event));
}

export default manageListeners