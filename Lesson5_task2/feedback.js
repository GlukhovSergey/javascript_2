class Feedback {
    constructor(source, container = '#feedback') {
        this.source = source;
        this.container = container;
        this.feedbackItems = []; //Массив для хранения отзывов
        this._init(this.source);
    }

    _render() {
        let $feedbackItemsDiv = $('<div/>', {
            class: 'feedback-items-wrap'
        });
        let $totalAmount = $('<div/>', {
            class: 'feedback-summary sum-amount'
        });
        $(this.container).text('Отзывы');
        $feedbackItemsDiv.appendTo($(this.container));
        $totalAmount.appendTo($(this.container));
    }

    _init(source) {
        this._render();
        fetch(source)
            .then(result => result.json())
            .then(data => {
                for (let feedbackItem of data) {
                    this.feedbackItems.push(feedbackItem);
                    this._renderItem(feedbackItem);
                }
                this._renderSum();

                $('.feedback-items-wrap').click(e => {
                    if (e.target.className === 'removeBtn') {
                        this._removeFeedback(e.target);
                    }
                    if (e.target.className === 'approveBtn') {
                        this._approveFeedback(e.target);
                    }
                });
            })
    }

    _renderItem(feedbackItem) {
        let $container = $('<div/>', {
            class: 'feedback-item',
            'data-id': feedbackItem.id
        });

        if (feedbackItem.isApproved) {
            $container.addClass('approved');
        }

        $container.append($(`<p class="feedback-author">${feedbackItem.author}</p>`));
        $container.append($(`<p class="feedback-text">${feedbackItem.text}</p>`));

        if (feedbackItem.isApproved) {
            $container.append($(`<p></p>`));
        } else {
            let $approveBtn = $('<button/>', {
                class: 'approveBtn',
                text: 'Одобрить',
                'data-id': feedbackItem.id,
            });
            $container.append($approveBtn);
        }

        let $removeBtn = $('<button/>', {
            class: 'removeBtn',
            text: 'Удалить',
            'data-id': feedbackItem.id,
        });
        $container.append($removeBtn);

        $container.appendTo($('.feedback-items-wrap'));
    }

    _renderSum() {
        $('.sum-amount').text(`Всего отзывов: ${this.feedbackItems.length}`);
    }

    _getNewId() {
        //ищем максимальный ИД
        let maxId = 0;
        for (let feedbackItem of this.feedbackItems) {
            if (feedbackItem.id > maxId) {
                maxId = feedbackItem.id;
            }
        }
        return maxId + 1;
    }

    addFeedback(author, text) {
        let feedbackId = this._getNewId();

        let feedbackItem = {
            id: feedbackId,
            author: author,
            text: text,
            isApproved: false
        };
        this.feedbackItems.push(feedbackItem);
        this._renderItem(feedbackItem);
        this._renderSum();
    }

    _removeFeedback(element) {
        let feedbackId = +$(element).data('id');
        let find = this.feedbackItems.find(feedbackItem => feedbackItem.id === feedbackId);
        if (find) {
            this.feedbackItems.splice(this.feedbackItems.indexOf(find), 1);
            let $container = $(`div[data-id=${feedbackId}]`);
            $container.remove();
        }
        this._renderSum();
    }

    _approveFeedback(element) {
        let feedbackId = +$(element).data('id');
        let find = this.feedbackItems.find(feedbackItem => feedbackItem.id === feedbackId);
        if (find) {
            find.isApproved = true;
            const $container = $(`div[data-id=${feedbackId}]`);
            $container.addClass('approved');
            const $approveBtn = $(`button[data-id=${feedbackId}].approveBtn`);
            $approveBtn.replaceWith(`<p></p>`);
        }
        this._renderSum();
    }}