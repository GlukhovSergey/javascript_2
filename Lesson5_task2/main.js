$(document).ready(() => {
    //Отзывы
    let feedback = new Feedback('feedback.json');

    //Добавление отзыва
    $('#addFeedback').on('submit', (e) => {
        e.preventDefault();

        const author = $('#author').val();
        const text = $('#text').val();

        if (author === '') {
            alert('Не заполнено поле автор.');
            return;
        }
        if (text === '') {
            alert('Не заполнен текст отзыва.');
            return;
        }

        feedback.addFeedback(author, text);
    });
});