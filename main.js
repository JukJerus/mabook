const books = [];
const bookForm = document.getElementById('bookForm');
const bookTitle = document.getElementById('bookFormTitle');
const bookAuthor = document.getElementById('bookFormAuthor');
const bookYear = document.getElementById('bookFormYear');
const bookIsComplete = document.getElementById('bookFormIsComplete');
const RENDER_EVENT = 'bookListUpdated';



document.addEventListener('DOMContentLoaded', function () {
  bookForm.addEventListener('submit', function(e){
    e.preventDefault();
    addBook();
  });

  if(isStorageExist()){
    loadDataFromStorage();
  }
})

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
  const title = bookTitle.value;
  const author = bookAuthor.value;
  const year = bookYear.value;
  const isComplete = bookIsComplete.checked;

  const id = generateId();

  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}
