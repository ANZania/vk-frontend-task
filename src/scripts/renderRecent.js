function renderRecent(recentData) {
    const emojiRecentWrapper = document.querySelector('.emoji-recent_wrapper');
    const recentBlock = emojiRecentWrapper.querySelector('.emoji-recent');
    recentBlock.textContent = '';
    let elemAccum = '';
    recentData.forEach((element) => {
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

export default renderRecent