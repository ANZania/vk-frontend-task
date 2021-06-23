function manageListeners(data) {
    const images = require('../assets/icons/emoji/*/*.png');
    const buttonsToolbar = document.querySelectorAll('.emoji-toolbar__button');
    const emojiBlockWrapper = document.querySelector('.emoji-block_wrapper');
    const emojiRecentWrapper = document.querySelector('.emoji-recent_wrapper');
    const emojiPickerWrapper = document.querySelector('.emoji-picker-wrapper');
    const emojiWrap = document.querySelectorAll('.emoji__wrap');
    const textInput = document.querySelector('.input');
    let recent = [];
    let focusedEmoji = 0;
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
                    const chosenEmoji = document.querySelector('.chosen');
                    if (chosenEmoji) {
                        chosenEmoji.classList.remove('chosen');
                    }
                }
            }
        }

        const toggleEmojiPickerMouseover = (event) => {
            if (event.target.closest('.emoji-button')) {
                if (!emojiPicker.classList.contains('active')) {
                    emojiPicker.classList.add('active')
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
                emojiWrap[focusedEmoji].classList.add('chosen');
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

            } else if ((event.code === 'ArrowUp')||
                (event.code === 'ArrowDown')||
                (event.code === 'ArrowLeft')||
                (event.code === 'ArrowRight')) {
                if (emojiPicker.classList.contains('active')) {
                    event.preventDefault()
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

                    const chosenEmoji = document.querySelector('.chosen');
                    if (chosenEmoji) {
                        chosenEmoji.classList.remove('chosen');
                    }
                    emojiWrap[focusedEmoji].classList.add('chosen');
                    emojiWrap[focusedEmoji].scrollIntoView(false)
                }
            } else if (event.code === 'Enter') {
                if (emojiPickerWrapper.classList.contains('active')) {
                    event.preventDefault()
                    initEmojiChoice(event, emojiWrap[focusedEmoji])
                }
            } else {
                emojiPicker.classList.remove('active')
            }

            // const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g
            // const mentionRegex = /\B@\w+/g
            // const mailRegex = /^\S+@\S+\.\S+$/g
            // const hashtagRegex = /(#+[a-zA-Z0-9(_)]+)/g
            //
            // textInput.innerHTML = textInput.textContent.replace(hashtagRegex, (match) => {
            //     return `<span class="defined">${match}</span>`
            // })
            // textInput.innerHTML = textInput.textContent.replace(urlRegex, (match) => {
            //     return `<span class="defined">${match}</span>`
            // });
            // textInput.innerHTML = textInput.textContent.replace(mentionRegex, (match) => {
            //     return `<span class="defined">${match}</span>`
            // })
            // textInput.innerHTML = textInput.textContent.replace(mailRegex, (match) => {
            //     return `<span class="defined">${match}</span>`
            // })
        }

        if (actionType === 'add') {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) || (window.screen.width <= 1024)) {
                document.addEventListener('click', toggleEmojiPickerClick, false)
            } else {
                document.addEventListener('mouseover', toggleEmojiPickerMouseover)
                document.addEventListener('mouseout', toggleEmojiPickerMouseout)
                document.addEventListener('keydown', manageKeyboardEvent)
            }
        } else {
            document.removeEventListener('click', toggleEmojiPickerClick)
            document.removeEventListener('mouseover', toggleEmojiPickerMouseout)
            document.removeEventListener('mouseout', toggleEmojiPickerMouseover)
            document.removeEventListener('keydown', manageKeyboardEvent)
        }
    }
    const initEmojiChoice = (event, emoji = null) => {
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
            // const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g
            // const mentionRegex = /\B@\w+/g
            // const mailRegex = /^\S+@\S+\.\S+$/g
            // const hashtagRegex = /(#+[a-zA-Z0-9(_)]+)/g
            //
            // textInput.innerHTML = textInput.textContent.replace(hashtagRegex, (match) => {
            //     return `<span class="defined">${match}</span>`
            // })
            // textInput.innerHTML = textInput.textContent.replace(urlRegex, (match) => {
            //     return `<span class="defined">${match}</span>`
            // });
            // textInput.innerHTML = textInput.textContent.replace(mentionRegex, (match) => {
            //     return `<span class="defined">${match}</span>`
            // })
            // textInput.innerHTML = textInput.textContent.replace(mailRegex, (match) => {
            //     return `<span class="defined">${match}</span>`
            // })
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
            }
        })
        if (ifRecentIncludes === undefined) {
            recent.unshift({
                "id": id,
                "index": index,
                "src": src
            });
            recent = recent.splice(0, 25);
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
    document.addEventListener("DOMContentLoaded", () => {

    });
}

export default manageListeners