import renderRecent from "./renderRecent";

function manageListeners(data, images) {
    const emojiPickerWrapper = document.querySelector('.emoji-picker-wrapper');
    const buttonsToolbar = document.querySelectorAll('.emoji-toolbar__button');
    const emojiWrap = document.querySelectorAll('.emoji__wrap');
    const emojiBlockWrapper = document.querySelector('.emoji-block_wrapper');
    const emojiRecentWrapper = document.querySelector('.emoji-recent_wrapper');
    const textInput = document.querySelector('.input');

    let recent = [];
    let focusedEmoji = 0;
    let expireTimerId;

    const setSavedState = () => {
        const msg = textInput.innerHTML;
        localStorage.setItem('msg', msg);
        localStorage.setItem('recent', JSON.stringify(recent))
    }

    const loadSavedState = () => {
        const msg = localStorage.getItem('msg');
        const rcntEmoji = JSON.parse(localStorage.getItem('recent'));
        if (msg) {
            textInput.innerHTML = msg
        }
        if (rcntEmoji) {
            recent = rcntEmoji;
            renderRecent(recent)
        } else {
            recent = [];
        }
    }

    const toggleEmojiPicker = () => {
        if (!emojiPickerWrapper.classList.contains('active')) {
            emojiPickerWrapper.classList.add('active')
        } else {
            emojiPickerWrapper.classList.remove('active')
        }
    }

    const toggleToolbar = () => {
        buttonsToolbar.forEach((elem, index) => {
            if (!elem.classList.contains('active')) {
                if (index === 0) {
                    focusedEmoji = 0;
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

    const moveCursorToEnd = () => {
        const range = document.createRange();
        range.selectNodeContents(textInput);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    const manageRecent = (id, index, src) => {
        let duplicateIndex;
        recent.forEach((element, index) => {
            if (element.id === id) {
                duplicateIndex = index;
            }
        })
        if (duplicateIndex === undefined) {
            recent.unshift({
                "id": id,
                "index": index,
                "src": src
            });
            recent = recent.splice(0, 25);
            renderRecent(recent);
        } else {
            if (duplicateIndex!==0) {
                const elementsBefore = recent.slice(0, duplicateIndex);
                const elementsAfter = recent.slice(duplicateIndex+1);

                recent = [{
                    "id": id,
                    "index": index,
                    "src": src
                }, ...elementsBefore, ...elementsAfter];

                recent = recent.splice(0, 25);
                renderRecent(recent);
            }
        }
    }

    const chooseEmoji = (event, emoji = null) => {
        if (event.target.closest('.emoji-addButton__container') || emoji) {
            let elementId;
            let elementBlockIndex;

            if (emoji && emoji.querySelector('.emoji-addButton__container')) {
                elementId = emoji.querySelector('.emoji-addButton__container').id;
                elementBlockIndex = emoji.querySelector('.emoji-addButton__container').attributes.blockindex.value;
            } else {
                event.preventDefault();
                elementId = event.target.closest('.emoji-addButton__container').id;
                elementBlockIndex = event.target.closest('.emoji-addButton__container').attributes.blockindex.value;
            }

            const imgSrc = images[elementBlockIndex][elementId];

            const img = document.createElement('img');
            img.setAttribute('src',imgSrc);
            img.setAttribute('class','emoji');

            const selection = window.getSelection();
            if (selection.rangeCount === 0 ||
                !textInput.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                textInput.appendChild(img);
                moveCursorToEnd()
            } else {
                let range = selection.getRangeAt(0);
                range.collapse(false);
                range.insertNode(img);
                selection.removeAllRanges();
                range.setStartAfter(img);
                selection.addRange(range);
            }
            manageRecent(elementId, elementBlockIndex, imgSrc)
            setSavedState()
        } else if (event.target.closest('.emoji-toolbar__button')) {
            toggleToolbar()
        }
    }

    const toggleEmojiPickerOnClick = (event) => {
        if (!event.target.closest('.emoji-picker-wrapper')) {
            if (emojiPickerWrapper.classList.contains('active')) {
                emojiPickerWrapper.classList.remove('active')
                if (emojiRecentWrapper.classList.contains('active')) {
                    toggleToolbar()
                }
            } else if (event.target.closest('.button-container') && !emojiPickerWrapper.classList.contains('active')) {
                emojiPickerWrapper.classList.add('active')
                const chosenEmoji = document.querySelector('.chosen');
                if (chosenEmoji) {
                    chosenEmoji.classList.remove('chosen');
                }
            }
        }
    }

    const toggleEmojiPickerOnMouseover = (event) => {
        if (event.target.closest('.emoji-button')) {
            if (!emojiPickerWrapper.classList.contains('active')) {
                emojiPickerWrapper.classList.add('active')
                const chosenEmoji = document.querySelector('.chosen');
                if (chosenEmoji) {
                    chosenEmoji.classList.remove('chosen');
                }
            }
        }
        if (event.target.closest('.emoji-picker-container')) {
            clearTimeout(expireTimerId)
        }
    }

    const toggleEmojiPickerOnMouseout = (event) => {
        if (event.target.closest('.emoji-button') || event.target.closest('.emoji-picker-container')) {
            if (emojiPickerWrapper.classList.contains('active')) {
                expireTimerId = setTimeout(() => {
                    emojiPickerWrapper.classList.remove('active')
                    if (emojiRecentWrapper.classList.contains('active')) {
                        toggleToolbar()
                    }
                }, 300)
            }
        }
    }

    const resetFormatting = (event) => {
        if (event.target.closest('.input')) {
            event.preventDefault();
            const emojiReg = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
            let text = event.clipboardData.getData("text/plain");

            const replaceEmoji = (match) => {
                let img = '';
                data.forEach((element, index) => {
                    element.items.forEach((item) => {
                        if (match === item) {
                            img = `<img src="${images[index][item]}" alt="${item}" class="emoji" loading="lazy">`;
                        }
                    })
                })
                return img
            }
            text = text.replace(emojiReg, replaceEmoji);
            document.execCommand('insertHTML', false, text);
            // textInput.innerHTML = highlightMsg(textInput.innerHTML);
            setSavedState()
        }
    }

    const manageKeyboardEvent = (event) => {
        if (event.code === 'Tab') {
            event.preventDefault();

            const selection = window.getSelection();

            if (selection.rangeCount === 0 ||
                !textInput.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                moveCursorToEnd();
            }
            emojiWrap[focusedEmoji].classList.add('chosen');
            toggleEmojiPicker();

        } else if (
            (event.code === 'ArrowUp')||
            (event.code === 'ArrowDown')||
            (event.code === 'ArrowLeft')||
            (event.code === 'ArrowRight')) {

            if (emojiPickerWrapper.classList.contains('active')) {
                event.preventDefault()
                const chosenEmoji = document.querySelector('.chosen');

                switch(event.code) {
                    case 'ArrowUp':
                        (focusedEmoji - 10) >= 0? focusedEmoji -= 10: focusedEmoji = 0;
                        break
                    case 'ArrowDown':
                        (focusedEmoji + 10) <= 1355? focusedEmoji += 10: focusedEmoji = 1355;
                        break
                    case 'ArrowLeft':
                        (focusedEmoji - 1) >= 0? focusedEmoji -= 1: focusedEmoji = 0;
                        break
                    case 'ArrowRight':
                        (focusedEmoji + 1) <= 1355? focusedEmoji += 1: focusedEmoji = 1355;
                        break
                }

                if (chosenEmoji) {
                    chosenEmoji.classList.remove('chosen');
                }
                emojiWrap[focusedEmoji].classList.add('chosen');
                emojiWrap[focusedEmoji].scrollIntoView(false);
            }
        } else if (event.code === 'Enter') {
            if (emojiPickerWrapper.classList.contains('active')) {
                event.preventDefault()
                chooseEmoji(event, emojiWrap[focusedEmoji])
            }
        } else {
            emojiPickerWrapper.classList.remove('active')
        }
    }

    const addBasicListeners = () => {
        if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) ||
            (window.screen.width <= 1024)) {
            document.addEventListener('click', toggleEmojiPickerOnClick, false)
        } else {
            document.addEventListener('mouseover', toggleEmojiPickerOnMouseover)
            document.addEventListener('mouseout', toggleEmojiPickerOnMouseout)
        }
        document.addEventListener('keydown', manageKeyboardEvent)
        document.addEventListener('keyup', setSavedState)
    }

    const removeBasicListeners = () => {
        document.removeEventListener('click', toggleEmojiPickerOnClick)
        document.removeEventListener('mouseover', toggleEmojiPickerOnMouseout)
        document.removeEventListener('mouseout', toggleEmojiPickerOnMouseover)
        document.removeEventListener('keydown', manageKeyboardEvent)
    }

    const initListeners = () => {
        addBasicListeners()

        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
            window.addEventListener('resize', () => {
                window.location.reload()
                removeBasicListeners();
                addBasicListeners();
            });
        }

        document.addEventListener('click', (event) => chooseEmoji(event))
        document.addEventListener('paste', (event) => resetFormatting(event));
        document.addEventListener("DOMContentLoaded", loadSavedState);
    }

    initListeners();

}

export default manageListeners