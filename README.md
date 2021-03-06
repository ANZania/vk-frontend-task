# Описание проекта
-------------
Тестовое задание на стажировку в команду "Веб-мессенджер" (фронтенд)

Задача - реализация поля ввода сообщений с интерфейсом выбора эмоджи.

Ссылка: https://vk-frontend-task.herokuapp.com/

---------
## Технологии:

- HTML & JS
- Sass
- Parcel (сборка)

Поскольку проект небольшой, я решила не перегружать его библиотеками и фреймворками, и реализацию осуществила на базовых HTML & JS. Для удобства верстки использовала препроцессор Sass, а для сборки - Parcel. Он был выбран, поскольку в данном исполнении проект не требует сложной конфигурации, которую предоставляет webpack, содержит более подробные описания ошибок и собирает проекты быстрее благодаря кэшированию. 

----------
## Этапы работы:

1. Изучение требований и формирование понимания о результате, который необходимо предоставить.
2. Деструктуризация задач. На данном этапе я разложила проект на небольшие задачи, которые необходимо решить во время работы. После того, как я составила список с задачами, я приблизительно оценила их по времени и распределила по дням.
В общем виде список выглядел так:

```
Интерфейс
-- Верстка основных компонентов
---- Окно выбора эмоджи
------ Блок со всеми доступными эмоджи
------ Блок с последними использованными эмоджи
------ Панель инструментов переключения между блоками

---- Поле ввода сообщения

Функционал
-- Отображение одинаковых эмоджи на всех устройствах
-- Выгрузка эмоджи из файла json
-- Управление с клавиатуры
-- Адаптация размера поля ввода сообщения под объем текста
-- Выбор эмоджи и его вставка в поле ввода
-- Хранение и отображение последних 25 использованных эмоджи
-- Хранение сообщения и последних использованных сообщений локально, чтобы они не пропадпли при перезагрузке страницы
-- Подсветка упоминаний, ссылок, мейлов, хэштегов
-- Оптимизация загрузки через кэширование и/или использование сервис-воркера

Другое
-- Составление описания
-- Деплой на Heroku
```
3. Разработка. 
4. Поиск багов и проверка работы при крайних случаях.
5. Исправление багов.
6. Добавление описания и деплой.

--------
## Комментарии:

Я решила сделать ширину окна выбора эмоджи фиксированной для упрощения поддержки данного решения. Для меня это упростило реализацию выбора эмоджи с клавиатуры.
Поле ввода сообщения реализовано с помощью div с аттрибутом contenteditable (вместо textarea), поскольку только он не имеет проблем с реализацией увеличения с возрастанием объема текста и вставкой эмоджи картинкой.
К сожалению, я не успела реализовать подсветку упоминаний, ссылок, мэлов и хэштегов, не посадив в проект множество багов, поэтому в финальном коде данный функционал не выполняется.
В перспективе развития я бы добавила в проект сервис-веркер, чтобы он мог работать при отсутсвии сети и оптимизировал загрузку интерфейса.
