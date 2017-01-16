var $studentList = $('ul.student-list');
var studentListItems = $studentList.children('li');

// Get the amount of pages if each page has 10
var getPageCount = function (students) {
    // Round upwards if not a whole number
    return Math.ceil(students.length / 10);
};

// Display students for a given page number
var displayStudentsForPage = function (pageNum) {
    // Page num should not be below 0
    if (pageNum < 0) {
        return;
    }

    // Find the index to start from
    var index = (pageNum - 1) * 10;

    // Clear list
    $studentList.empty();

    // Insert students into ul for the pageNum
    for (var i = index; i < index + 10; i++) {
        if (i < studentListItems.length) {
            $studentList.append(studentListItems[i]);
        }
    }
};

// Pagination
var $paginationDiv = $('<div class="pagination"></div>');
var $paginationList = $('<ul></ul>');
$paginationDiv.append($paginationList);
$studentList.after($paginationDiv);

// Create pagination links
for (var i = 0; i < getPageCount(studentListItems); i++) {
    $paginationList.append('<li><a href="#">' + (i + 1) + '</a></li>')
}

// Create handler for pagination links
$('.pagination a').on('click', function (event) {
    event.preventDefault();
    var pageNumber = this.innerText;

    displayStudentsForPage(pageNumber);
});

// On page load, display the first page
displayStudentsForPage(1);
