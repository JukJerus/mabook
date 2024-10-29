const books = [];
const bookForm = document.getElementById('bookForm');
const bookTitle = document.getElementById('bookFormTitle');
const bookAuthor = document.getElementById('bookFormAuthor');
const bookYear = document.getElementById('bookFormYear');
const bookIsComplete = document.getElementById('bookFormIsComplete');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'MABOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
  bookForm.addEventListener('submit', function(e){
    e.preventDefault();
    addBook();
  });

  if (isStorageExist()){
  }
});

function isStorageExist(){
  if(typeof(Storage) === undefined){
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function generateBookObject(id, title, author, year, isComplete){
  return{
    id,
    title,
    author,
    year,
    isComplete
  };
}

function addBook(){
  const id = generateId();
  const title = bookTitle.value;
  const author = bookAuthor.value;
  const year = parseInt(bookYear.value);
  const isComplete = bookIsComplete.checked;

  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function generateId(){
  return +new Date();
}

function saveData(){
  parsedData = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsedData);
}

document.addEventListener(RENDER_EVENT, function(){
  console.log(books);
  
})