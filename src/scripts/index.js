import manageListeners from "./manageListeners";
import renderEmoji from "./renderEmoji";
import data from '../emojiData.json';

const images = require('../assets/icons/emoji/*/*.png')

renderEmoji(data, images)
manageListeners(data, images)