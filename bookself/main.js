const BOOKS_KEY = 'BOOKS_APP';
let books = [];
let editingBookId = null;

document.addEventListener('DOMContentLoaded', function () {
    loadBooksFromStorage();
    document.getElementById('book-form').addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const isComplete = document.getElementById('isComplete').checked;

    if (editingBookId) {
    updateBook(editingBookId, { title, author, year, isComplete });
    } else {
    addBook({ title, author, year, isComplete });
    }

    resetForm();
}

function addBook({ title, author, year, isComplete }) {
    const newBook = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete
    };

    books.push(newBook);
    saveBooksToStorage();
    renderBooks();
}

function updateBook(bookId, updatedData) {
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedData };
    saveBooksToStorage();
    renderBooks();
    }
}

function loadBooksFromStorage() {
    const data = localStorage.getItem(BOOKS_KEY);
    if (data) {
    books = JSON.parse(data);
    renderBooks();
    }
}

function renderBooks() {
    const incompleteBookshelf = document.getElementById('incomplete-bookshelf');
    const completeBookshelf = document.getElementById('complete-bookshelf');
    incompleteBookshelf.innerHTML = '';
    completeBookshelf.innerHTML = '';

    books.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid',book.id);
    bookElement.setAttribute('data-testid','bookItem');
    
    bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <button data-testid="bookItemIsCompleteButton" onclick="toggleBook(${book.id})">${book.isComplete ? 'Pindahkan ke Belum Selesai' : 'Pindahkan ke Selesai'}</button>
        <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
        <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
    `;

    if (book.isComplete) {
        completeBookshelf.appendChild(bookElement);
    } else {
        incompleteBookshelf.appendChild(bookElement);
    }
    });
}

function toggleBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
    renderBooks();
    }
}

function editBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
    editingBookId = bookId;
    document.getElementById('book-id').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('year').value = book.year;
    document.getElementById('isComplete').checked = book.isComplete;
    document.getElementById('form-title').innerText = 'Edit Buku';
    document.getElementById('submit-button').innerText = 'Update Buku';
    }
}

function deleteBook(bookId) {
    books = books.filter(b => b.id !== bookId);
    saveBooksToStorage();
    renderBooks();
}

function resetForm() {
    editingBookId = null;
    document.getElementById('book-form').reset();
    document.getElementById('form-title').innerText = 'Tambah Buku Baru';
    document.getElementById('submit-button').innerText = 'Tambah Buku';
}
function saveBooksToStorage() {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}