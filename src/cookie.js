/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

const getCookie = () => document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');

    prev[name] = value;

    return prev;
}, {});

const chickSearch = (key, value) =>
    !filterNameInput.value || key.includes(filterNameInput.value) || value.includes(filterNameInput.value) ? true : false;

filterNameInput.addEventListener('keyup', function() {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    const cookie = getCookie();

    listTable.innerHTML = '';
    for (const key in cookie) {
        if (chickSearch(key, cookie[key])) {
            addTr(key, cookie[key]);
        } else {
            delTr(key);
        }
    }
});

const addTr = (key, value) => {
    const tr = document.createElement('tr');

    tr.innerHTML =`<td>${key}</td><td>${value}</td><td><button class="delCookie">Удалить</button></td>`;
    listTable.appendChild(tr);

    tr.querySelector('.delCookie').addEventListener('click', () =>{ // Удаление cookie
        const nameCookie = tr.children[0].textContent;

        listTable.removeChild(tr);

        setCookie(nameCookie, '', -1);
    });
};

const delTr = (key) => {
    for (const tr of listTable.children) {
        if (tr.children[0].textContent === key) {
            listTable.removeChild(tr);
        }
    }
};

(() => {
    const cookie = getCookie();

    for (const key in cookie) {
        if (key) {
            addTr(key, cookie[key]);
        }
    }
})();

const replaceTr = (key, value) =>{

    for (const tr of listTable.children) {
        if (tr.children[0].textContent === key) {
            tr.children[1].textContent = value;
        }
    }
};

addButton.addEventListener('click', () => { // добавление cookie

    if (addNameInput.value && addValueInput.value) {
        if (chickSearch(addNameInput.value, addValueInput.value)) {
            if (addNameInput.value in getCookie()) { // если в объекте есть такое имя
                replaceTr(addNameInput.value, addValueInput.value);
            } else {
                addTr(addNameInput.value, addValueInput.value);
            }
        } else {
            delTr(addNameInput.value);
        }

        setCookie(addNameInput.value, addValueInput.value);
    }
});

const setCookie = (name, value, expires) => {
    let options = {};

    if (typeof expires === 'number' && expires) {
        const d = new Date();

        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + '=' + value;

    for (const propName in options) {
        updatedCookie += '; ' + propName;
        const propValue = options[propName];

        if (propValue !== true) {
            updatedCookie += '=' + propValue;
        }
    }
    document.cookie = updatedCookie;
};