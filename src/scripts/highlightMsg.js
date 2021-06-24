function highlightMsg(text) {
    const urlRegex = /((http(s)?:\/\/.)|(www\.))[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9:%_\+.~#?&//=]*)/g
    const mentionRegex = /\B@\w+/g
    const mailRegex = /([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})/g
    const hashtagRegex = /(#+[a-zA-Z0-9(_)]+)/g

    text = text.replace(hashtagRegex, (match, string) => {
        return `<span style="color: #2A5885">${match}</span>`
    })
    text = text.replace(urlRegex, (match, string) => {
        return `<a href="${match}" style="color: #2A5885; cursor: pointer">${match}</a>`
    })
    text = text.replace(mentionRegex, (match, string) => {
        return `<span style="color: #2A5885">${match}</span>`
    })
    text = text.replace(mailRegex, (match, string) => {
        return `<span style="color: #2A5885">${match}</span>`
    })

    return text
}

export default highlightMsg