const books = [];
const bookForm = document.getElementById('bookForm');
const bookTitle = document.getElementById('bookFormTitle');
const bookAuthor = document.getElementById('bookFormAuthor');
const bookYear = document.getElementById('bookFormYear');
const bookIsComplete = document.getElementById('bookFormIsComplete');
const incompleteBookList = document.getElementById('incompleteBookList');
const searchBookTitle = document.getElementById('searchBookTitle');
const completeBookList = document.getElementById('completeBookList');
const RENDER_EVENT = 'render-books';
const STORAGE_KEY = 'MABOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
  bookForm.addEventListener('submit', function(e){
    e.preventDefault();
    addBook();
  });

  if (isStorageExist()){
    loadDataFromStorage();
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

function loadDataFromStorage(){
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if(data !== null){
    for (const book of data){
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function(){
  console.log(books);
  
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books){
    const bookElement = createBookElement(book);
    if (book.isComplete){
      completeBookList.append(bookElement);
    }
    else{
      incompleteBookList.append(bookElement);
    }
  }
})

function createBookElement(bookObject){
  const card = document.createElement('div');
  card.classList.add('card');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.setAttribute('data-bookid', bookObject.id);
  cardBody.setAttribute('data-testid', 'bookItem');

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.setAttribute('data-testid', 'bookItemTitle');
  cardTitle.innerText = bookObject.title;

  const cardSubtitle = document.createElement('h6');
  cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
  cardSubtitle.setAttribute('data-testid', 'bookItemAuthor');
  cardSubtitle.innerText = bookObject.author;

  const cardText = document.createElement('p');
  cardText.classList.add('card-text');
  cardText.setAttribute('data-testid', 'bookItemYear');
  cardText.innerText = bookObject.year;

  cardBody.append(cardTitle, cardSubtitle, cardText);

  if (bookObject.isComplete){
    const incompleteButton = document.createElement('button');
    incompleteButton.classList.add('btn', 'btn-warning', 'text-white');
    incompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    incompleteButton.setAttribute('type', 'button');
    incompleteButton.innerText = 'Belum';

    incompleteButton.addEventListener('click', function(){
      undoBookFromComplete(bookObject.id);
    })

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.setAttribute('type', 'button');
    deleteButton.innerText = 'Hapus';

    deleteButton.addEventListener('click', function(){
      removeBook(bookObject.id);
    })

    // const editButton = document.createElement('button');
    // editButton.classList.add('btn', 'btn-secondary');
    // editButton.setAttribute('data-testid', 'bookItemEditButton');
    // editButton.setAttribute('type', 'button');
    // editButton.setAttribute('data-bs-toggle', 'modal');
    // editButton.setAttribute('data-bs-target', '#staticBackdrop');
    // editButton.innerText = 'Edit';

    // completeButton.addEventListener('click', function(){
    //   addBookToComplete(bookObject.id); 
    // })
    const incompleteButtonContainer = document.createElement('div');
    incompleteButtonContainer.classList.add('d-flex', 'gap-1');
    incompleteButtonContainer.append(incompleteButton, deleteButton);
    cardBody.append(incompleteButtonContainer);
  }
  else{
    const completeButton = document.createElement('button');
    completeButton.classList.add('btn', 'btn-success');
    completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    completeButton.setAttribute('type', 'button');
    completeButton.innerText = 'Selesai';

    completeButton.addEventListener('click', function(){
      addBookToComplete(bookObject.id);
    })

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.setAttribute('type', 'button');
    deleteButton.innerText = 'Hapus';

    deleteButton.addEventListener('click', function(){
      removeBook(bookObject.id);
    })

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('d-flex', 'gap-1');
    buttonContainer.append(completeButton, deleteButton);
    cardBody.append(buttonContainer);
  }
  card.append(cardBody);
  return card;
}

function addBookToComplete(id){
  const bookTarget = findBook(id);

  if (bookTarget == null){
    return;
  }

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromComplete(id){
  const bookTarget = findBook(id);
  if(bookTarget == null){
    return;
  }
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(id){
  const bookIndex = findBookIndex(id);
  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId){
  for(let i in books){
    if(books[i].id === bookId){
      return i;
    }
  }
}

function findBook(id){
  for (const book of books){
    if(book.id === id){
      return book;
    }
  }
}

searchBookTitle.addEventListener('input', function(){
  searchBookByTitle(searchBookTitle.value);
})

function searchBookByTitle(title){
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(title.toLowerCase())
  );

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}