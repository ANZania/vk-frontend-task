function manageListeners(data) {
    const images = require('../assets/icons/emoji/*/*.png');
    const buttonsToolbar = document.querySelectorAll('.emoji-toolbar__button');
    const emojiBlockWrapper = document.querySelector('.emoji-block_wrapper');
    const emojiRecentWrapper = document.querySelector('.emoji-recent_wrapper');
    const textInput = document.querySelector('.input');
    let recent = [];
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
            if (event.target.closest('.emoji-picker-container')) {
                clearTimeout(expireTimerId)
            }
        }

        const toggleEmojiPickerMouseout = (event) => {
            if (event.target.closest('.emoji-button') || event.target.closest('.emoji-picker-container')) {
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

        const manageKeyboardEvent = (event) => {
            if (event.code === 'Tab') {
                event.preventDefault()
                if (!emojiPicker.classList.contains('active')) {
                    emojiPicker.classList.add('active')
                } else {
                    emojiPicker.classList.remove('active')
                }
                const selection = window.getSelection();
                if (selection.rangeCount === 0 ||
                    !textInput.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                    const range = document.createRange();
                    range.selectNodeContents(textInput);
                    range.collapse(false);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range)
                }

            }
        }

        if (actionType === 'add') {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) || (window.screen.width <= 1024)) {
                document.addEventListener('click', toggleEmojiPickerClick, false)
            } else {
                document.addEventListener('mouseover', toggleEmojiPickerMouseover, false)
                document.addEventListener('mouseout', toggleEmojiPickerMouseout, false)
                document.addEventListener('keydown', manageKeyboardEvent)
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
            const elementId = event.target.closest('.emoji-addButton__container').id;
            const elementBlockIndex = event.target.closest('.emoji-addButton__container').attributes.blockindex.value;

            const imgSrc = images[elementBlockIndex][elementId];
            const img = document.createElement('img');
            img.setAttribute('src',imgSrc);
            img.setAttribute('class','emoji');

            const selection = window.getSelection();
            if (selection.rangeCount === 0 ||
                !textInput.contains(selection.getRangeAt(0).commonAncestorContainer)) {
                textInput.appendChild(img);
                const range = document.createRange();
                range.selectNodeContents(textInput);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range)
            } else {
                let range = selection.getRangeAt(0);
                range.collapse(false);
                range.insertNode(img);
                selection.removeAllRanges();
                range.setStartAfter(img);
                selection.addRange(range);
            }
            manageRecentEmoji(elementId, elementBlockIndex, imgSrc)
        } else if (event.target.closest('.emoji-toolbar__button')) {
                toggleEmojiStates()
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
        }
    }
    const renderRecent = (data) => {
        const recentBlock = emojiRecentWrapper.querySelector('.emoji-recent');
        recentBlock.textContent = '';
        let elemAccum = '';
        data.forEach((element) => {
            const emojiBlock =
            `<div class="emoji__wrap">
                <div class="emoji-addButton__container" id="${element.id}" blockIndex="${element.index}">
                    <img src="${element.src}" alt="${element.id}" class="emoji-img" loading="lazy">
                </div>
            </div>`;
                elemAccum += emojiBlock;
        })
        const emojiWrap =
            `<section class="emoji-block__container">
                    ${elemAccum}
                </section>`;
        recentBlock.insertAdjacentHTML('beforeend', emojiWrap);
    }
    const manageRecentEmoji = (id, index, src) => {
        let ifRecentIncludes;
        recent.forEach((element, index) => {
            if (element.id === id) {
                ifRecentIncludes = index;
                console.log(ifRecentIncludes)
            }
        })
        if (ifRecentIncludes === undefined) {
            recent.unshift({
                "id": id,
                "index": index,
                "src": src
            });
            recent = recent.splice(0, 25);
            console.log('new', recent)
            renderRecent(recent);
        } else {
            if (ifRecentIncludes!==0) {
                const elementsBefore = recent.slice(0, ifRecentIncludes);
                const elementsAfter = recent.slice(ifRecentIncludes+1);
                recent = [{
                    "id": id,
                    "index": index,
                    "src": src
                }, ...elementsBefore, ...elementsAfter];
                recent = recent.splice(0, 25);
                console.log('old', recent)
                renderRecent(recent);
            }
        }

    }

    toggleListeners('add');

    window.addEventListener('resize', () => {
        window.location.reload()
        toggleListeners('remove');
        toggleListeners('add');
    });

    document.addEventListener('click', (event) => initEmojiChoice(event))
    document.addEventListener('paste', (event) => resetFormatting(event));
}

export default manageListeners