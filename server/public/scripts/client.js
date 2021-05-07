$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.btn-del', function(event) {
    console.log('delete btn clicked');
    let delBookID = event.target.dataset.id;
    // console.log(delBookID);
    $.ajax({
      method: 'DELETE',
      url: `/books/${delBookID}`
    }).then((response) => {
      console.log('Book deleted:', delBookID);
      refreshBooks();
    }).catch((error) => {
      console.log('Sorry, there was a problem with the delete');
    })
  })

  $('#bookShelf').on('click', '.btn-read', function(event) {
    console.log('read btn clicked');
    let bookID = event.target.dataset.id;
    // console.log(delBookID);
    $.ajax({
      method: 'PUT',
      url: `/books/${bookID}`
    }).then((response) => {
      console.log('Book read:', bookID);      
      refreshBooks();
    }).catch((error) => {
      console.log('Sorry, there was a problem with the delete');
    })
  })
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
    $('#title').val('');
    $('#author').val('');
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let isReadBtn;
    //check db for isRead=TRUE
    if (book.isRead) {
      console.log(book.isRead);
      //build button based on isRead
      isReadBtn = `<button class="btn-read red" data-id=${book.id}>Read</button>`; 
    }
    else {
      isReadBtn = `<button class="btn-read green" data-id=${book.id}>Not Read</button>`;

    }
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${isReadBtn}</td>
        <td><button class="btn-del" data-id=${book.id}>Delete</button></td>
        <td><button class="btn-edit" data-id=${book.id}>Edit</button></td>

      </tr>
    `);
  }
}
