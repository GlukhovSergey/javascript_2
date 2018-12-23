"use strict";

/**
 * Класс Галерея
 */
class Gallery {
    constructor(userSettings, dataJson) {
        this.settings = {
            previewSelector: '.mySuperGallery',
            openedImageWrapperClass: 'galleryWrapper',
            openedImageClass: 'galleryWrapper__image',
            openedImageScreenClass: 'galleryWrapper__screen',
            openedImageCloseBtnClass: 'galleryWrapper__close',
            openedImageCloseBtnSrc: 'images/gallery/close.png',
            openedImagePictureNoImageSrc: 'images/gallery/noImage.jpeg',
            openedImageNextBtnSrc: 'images/gallery/next.png',
            openedImageBackBtnSrc: 'images/gallery/back.png',
            openedImageNextBtnClass: 'galleryWrapper__next',
            openedImageBackBtnClass: 'galleryWrapper__back',
        };
        this.openedImageEl = null;

        Object.assign(this.settings, userSettings);

        // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
        // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
        // gallery и передадим туда событие MouseEvent, которое случилось.
        document
            .querySelector(this.settings.previewSelector)
            .addEventListener('click', event => this._containerClickHandler(event));

        this.imgCollection = dataJson;
    }

    /**
     * Генерируем тег с коллекцией миниатюр галереи
     * @return {string} сформированный тег со списком миниатюр галереи
     */
    render() {
        let result = '';
        this.imgCollection.forEach(el => {
            result += `<img src="${el.src}" data-full_image_url="${el.fullImageUrl}" alt="${el.alt}">`;
        });
        return result;
    }

    /**
     * Обработчик события клика для открытия картинки.
     * @param {MouseEvent} event Событие клики мышью.
     */
    _containerClickHandler(event) {
        // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
        if (event.target.tagName !== 'IMG') {
            return;
        }
        // Открываем картинку с полученным из целевого тега (data-full_image_url аттрибут).
        this._openImage(event.target.dataset.full_image_url, event.target);
    }

    /**
     * Открывает предыдущую картинку
     */
    _getBackImage() {
        const imgElements = document.querySelectorAll('.galleryPreviewsContainer > img');
        for (let i = 0; i < imgElements.length; i++) {
            if (imgElements[i] === this.openedImageEl) {
                const indexBackImg = i === 0 ? imgElements.length - 1 : i - 1;

                // Открываем картинку с полученным из целевого тега (data-full_image_url аттрибут).
                this._openImage(imgElements[indexBackImg].dataset.full_image_url, imgElements[indexBackImg]);
                return;
            }
        }
    }

    /**
     * Открывает следующую картинку
     */
    _getNextImage() {
        const imgElements = document.querySelectorAll('.galleryPreviewsContainer > img');
        for (let i = 0; i < imgElements.length; i++) {
            if (imgElements[i] === this.openedImageEl) {
                const indexNextImg = i + 1 < imgElements.length ? i + 1 : 0;

                // Открываем картинку с полученным из целевого тега (data-full_image_url аттрибут).
                this._openImage(imgElements[indexNextImg].dataset.full_image_url, imgElements[indexNextImg]);
                return;
            }
        }
    }


    /**
     * Открывает картинку.
     * @param {string} src Ссылка на картинку, которую надо открыть.
     * @param imgElement элемент миниатюры которуюб мы открыли.
     */
    _openImage(src, imgElement) {
        // Получаем контейнер для открытой картинки, в нем находим тег img и ставим ему нужный src.
        this._getScreenContainer().querySelector(`.${this.settings.openedImageClass}`).src = src;

        //запоминаем картинку которую мы открыли
        this.openedImageEl = imgElement;
    }

    /**
     * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
     * @returns {Element}
     */
    _getScreenContainer() {
        // Получаем контейнер для открытой картинки.
        const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
        // Если контейнер для открытой картинки существует - возвращаем его.
        if (galleryWrapperElement) {
            return galleryWrapperElement;
        }

        // Возвращаем полученный из метода createScreenContainer контейнер.
        return this._createScreenContainer();
    }

    /**
     * Создает контейнер для открытой картинки.
     * @returns {HTMLElement}
     */
    _createScreenContainer() {
        // Создаем сам контейнер-обертку и ставим ему класс.
        const galleryWrapperElement = document.createElement('div');
        galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);

        // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
        const galleryScreenElement = document.createElement('div');
        galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
        galleryWrapperElement.appendChild(galleryScreenElement);

        // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
        const closeImageElement = new Image();
        closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
        closeImageElement.src = this.settings.openedImageCloseBtnSrc;
        closeImageElement.addEventListener('click', () => this._close());
        galleryWrapperElement.appendChild(closeImageElement);

        // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
        const image = new Image();
        image.classList.add(this.settings.openedImageClass);
        image.onerror = () => this._showNoImage();
        galleryWrapperElement.appendChild(image);

        // Создаем картинку, стрелку влево и добавляем ее в контейнер-обертку.
        const backImageElement = new Image();
        backImageElement.classList.add(this.settings.openedImageBackBtnClass);
        backImageElement.src = this.settings.openedImageBackBtnSrc;
        backImageElement.addEventListener('click', () => this._getBackImage());
        galleryWrapperElement.appendChild(backImageElement);

        // Создаем картинку, стрелку вправо и добавляем ее в контейнер-обертку.
        const nextImageElement = new Image();
        nextImageElement.classList.add(this.settings.openedImageNextBtnClass);
        nextImageElement.src = this.settings.openedImageNextBtnSrc;
        nextImageElement.addEventListener('click', () => this._getNextImage());
        galleryWrapperElement.appendChild(nextImageElement);

        // Добавляем контейнер-обертку в тег body.
        document.body.appendChild(galleryWrapperElement);

        // Возвращаем добавленный в body элемент, наш контейнер-обертку.
        return galleryWrapperElement;
    }

    /**
     * Показывает изображение заглушку для открытой картинки.
     */
    _showNoImage() {
        document.querySelector(`.${this.settings.openedImageClass}`).src = this.settings.openedImagePictureNoImageSrc;
    }

    /**
     * Закрывает (удаляет) контейнер для открытой картинки.
     */
    _close() {
        document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
    }
}

