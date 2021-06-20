function renderEmoji( data) {
    const images = require('../assets/icons/emoji/*/*.png')
    const emojiBlock = document.querySelector('.emoji-block');
    data.forEach((element, index) => {
        const heading = `<p class="emoji-heading">${element.title}</p>`;
        emojiBlock.insertAdjacentHTML('beforeend', heading);
        let elemAccum = '';
        element.items.forEach((item) => {
            if (!images[index][item]) {
                console.log('item = ', item, ' index = ', index, 'images[index] = ', )
            }
            const emojiBlock =
                `<div class="emoji__wrap">
                    <div class="emoji-addButton__container" id="${item}" blockIndex="${index}">
                        <img src="${images[index][item]}" alt="${item}" class="emoji-img" loading="lazy">
                    </div>
                </div>`;
            elemAccum += emojiBlock;
        })
        const emojiWrap =
            `<section class="emoji-block__container">
            ${elemAccum}
            </section>`;
        emojiBlock.insertAdjacentHTML('beforeend', emojiWrap);

    })
}

export default renderEmoji