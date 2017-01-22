// Student Info
var $studentList = $('ul.student-list');
var studentArray = [];

// Pagination
var $pagination = $('<div class="pagination"></div>');
var $paginationList = $('<ul></ul>');

// Search
var $search = $('<div class="student-search"></div>');
var $searchInput = $('<input placeholder="Search for students...">');
var $searchButton = $('<button>Search</button>');
var $noResultsSpan = $('<span>There are no students that match your search.</span>').hide(); // Start hidden
var lastSearch = '';
var isSearching = false;
var searchResultIndexes = [];

var populateStudentArray = function (studentListItems) {
    // Loop through students
    for (var i = 0; i < studentListItems.length; i++) {
        var $student = $(studentListItems[i]);

        var name = $student.find('h3')[0].innerText.toLowerCase();
        var email = $student.find('span.email')[0].innerText.toLowerCase();
        var joined = $student.find('.joined-details .date')[0].innerText.toLowerCase().replace('joined ', '');

        // Add student information to array
        studentArray.push({
            element: $student,
            name: name,
            email: email,
            joined: joined
        })
    }
};

// Get the amount of pages if each page has 10
var getPageCount = function (students) {
    // Round upwards if not a whole number
    return Math.ceil(students.length / 10);
};

// Create and append pagination links to $paginationList
var appendPagination = function (pageCount) {
    // Clear list
    $paginationList.empty();

    // If there is only a single page, no pagination is needed
    if (pageCount < 2) {
        return;
    }

    for (var i = 0; i < pageCount; i++) {
        $paginationList.append('<li><a href="#">' + (i + 1) + '</a></li>')
    }
};

// Display students for a given page number
var displayStudentsForPage = function (pageNum) {
    // Page num should not be below 0
    if (pageNum < 0) {
        return;
    }

    // Find the index to start from
    var index = (pageNum - 1) * 10;
    var students = [];

    // If searching
    if (isSearching) {
        for (var i = 0; i < searchResultIndexes.length; i++) {
            // Get the students index from searchResultIndexes - then push the student into new array
            students.push(studentArray[searchResultIndexes[i]]);
        }
    } else {
        students = studentArray;
    }

    // Clear list
    $studentList.empty();

    // Insert students into ul for the pageNum
    for (i = index; i < index + 10 && i < students.length; i++) {
        $studentList.append(students[i].element);
    }
};

var pageClickEvent = function (event) {
    event.preventDefault();
    var pageNumber = this.innerText;

    // Change active class
    $('.pagination a').removeClass('active');
    $(this).addClass('active');

    displayStudentsForPage(pageNumber);
};

// Checks if student matches search value
var findMatch = function (student, value) {
    if (student.name.indexOf(value) > -1) {
        return true;
    } else if (student.email.indexOf(value) > -1) {
        return true;
    } else {
        // will return false if none match
        return student.joined.indexOf(value) > -1;
    }
};

var search = function (value) {
    value = value.trim().toLowerCase();
    lastSearch = value;

    // If no value, reset results array and return
    if (!value || value.length < 1) {
        searchResultIndexes = [];
        isSearching = false;
        return;
    }

    isSearching = true;

    // Create results array to add any findings to
    var resultIndexes = [];
    // Loop through students
    for (var i = 0; i < studentArray.length; i++) {
        var student = studentArray[i];

        if (findMatch(student, value)) {
            resultIndexes.push(i);
        }
    }

    searchResultIndexes = resultIndexes;
};

var searchEvent = function (event) {
    if (event.type === 'keyup') {
        // If the search is the same, ignore for keyup event
        if (lastSearch === this.value.trim().toLowerCase()) {
            return;
        }

        search(this.value);
    } else if (event.type === 'click') {
        // Get the inputs value and search
        search($searchInput[0].value);
    } else {
        return;
    }


    if (isSearching) {
        // If there are search results
        if (searchResultIndexes.length) {
            // Display search results
            $noResultsSpan.hide();
            appendPagination(getPageCount(searchResultIndexes));
        } else {
            // Display no results found
            $noResultsSpan.show();
            $paginationList.empty();
        }
    } else {
        // Display normal
        $noResultsSpan.hide();
        appendPagination(getPageCount(studentArray));
    }

    displayStudentsForPage(1);
    $('.pagination a').on('click', pageClickEvent);
    $('.pagination a:first').addClass('active');
};

populateStudentArray($studentList.children('li'));

// Pagination
$pagination.append($paginationList);
$studentList.after($noResultsSpan);
$studentList.after($pagination);

// Get the page count to display for all students and create pagination
appendPagination(getPageCount(studentArray));

// Create handler for pagination links
$('.pagination a').on('click', pageClickEvent);

// On page load, display the first page and set page 1 as active
displayStudentsForPage(1);
$('.pagination a:first').addClass('active');

// Search
// Create handler for input key up
$searchInput.on('keyup', searchEvent);

// Create handler for button click
$searchButton.on('click', searchEvent);

// Append search HTML
$search.append($searchInput).append($searchButton);
$('.page-header').append($search);
