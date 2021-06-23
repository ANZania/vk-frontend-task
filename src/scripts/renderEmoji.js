function renderEmoji(data, images) {
    const emojiBlock = document.querySelector('.emoji-block');
    data.forEach((element, blockIndex) => {
        const heading = `<p class="emoji-heading">${element.title}</p>`;
        emojiBlock.insertAdjacentHTML('beforeend', heading);
        let elemAccum = '';
        element.items.forEach((item, itemIndex) => {
            const emojiBlock =
                `<div class="emoji__wrap">
                    <div class="emoji-addButton__container" id="${item}" blockIndex="${blockIndex}" itemIndex="${itemIndex}">
                        <img src="${images[blockIndex][item]}" alt="${item}" class="emoji-img" loading="lazy">
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