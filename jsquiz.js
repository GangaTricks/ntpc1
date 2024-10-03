
let bookmarks = [];
let currentQuestionIndex = 0;
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
let currentBookmarkIndex = 0; // Keep track of the current bookmarked question index
let populateBookmarkedQuestions = false;




// Load the completed work count when the page loads
    window.onload = function() {
        displayCompletedWork();
        // Ensure input field reflects the saved count
        document.getElementById('completedCount').value = getCompletedWork();
    };

    function saveCompletedWork() {
        var completedCount = document.getElementById('completedCount').value;
        localStorage.setItem(`completedCount_${uniqueIdentifier}`, completedCount);
        displayCompletedWork(); // Update the displayed count immediately

        // Update input field value
        document.getElementById('completedCount').value = completedCount;
    }

    // Function to retrieve the completed work count from local storage
    function getCompletedWork() {
        return localStorage.getItem(`completedCount_${uniqueIdentifier}`) || '0';
    }

    // Function to display the completed work count from local storage
    function displayCompletedWork() {
        var completedCount = getCompletedWork();
        var displayCountElement = document.getElementById('displayCount');
        if (displayCountElement) {
            displayCountElement.textContent = completedCount; // Set count inside span
        }
        var completedCountDisplayElement = document.getElementById('completedCountDisplay');
        if (completedCountDisplayElement) {
            completedCountDisplayElement.textContent = `Mark: ${completedCount}🏃`; // Set count outside input field
        }
    }

    function getCurrentQuestion() {
        // Modify this function to return the current question based on the currentQuestionIndex
    }


// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

		
		function getBookmarkedIndices() {
        const bookmarkedIndices = [];
        for (let i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i]) {
                bookmarkedIndices.push(i);
            }
        }
        return bookmarkedIndices;
    }

  function togglePopulateBookmarkedQuestions() {
        populateBookmarkedQuestions = !populateBookmarkedQuestions;
        const toggleButton = document.getElementById('toggleBookmarkQuestions');
        toggleButton.textContent = populateBookmarkedQuestions ? '⛔Exit' : '🔖Saved';
        showQuestion();
    }

function getBookmarkedIndices() {
    const bookmarkedIndices = [];
    
    if (Array.isArray(bookmarks)) {
        // Process as an array
        bookmarks.forEach((isBookmarked, index) => {
            if (isBookmarked) {
                bookmarkedIndices.push(index);
            }
        });
    } else if (typeof bookmarks === 'object' && bookmarks !== null) {
        // Process as an object
        for (let key in bookmarks) {
            if (bookmarks[key]) {
                const index = parseInt(key, 10);
                if (!isNaN(index)) {
                    bookmarkedIndices.push(index);
                }
            }
        }
    } else {
        console.warn('Bookmarks data is not in the expected format.');
    }

    return bookmarkedIndices;
}


function updateBookmarkedCount() {
    let bookmarkedCount = 0;

    // Check the type of bookmarks and process accordingly
    if (Array.isArray(bookmarks)) {
        // Process as an array
        bookmarkedCount = bookmarks.filter(Boolean).length;
    } else if (typeof bookmarks === 'object' && bookmarks !== null) {
        // Process as an object
        bookmarkedCount = Object.values(bookmarks).filter(Boolean).length;
    } else {
        console.warn('Bookmarks is neither an array nor an object. Count will be zero.');
    }

    // Update the UI with the count
    const bookmarkedCountElement = document.getElementById('bookmarkedCount');
    if (bookmarkedCountElement) {
        bookmarkedCountElement.textContent = `See: ${bookmarkedCount}`;
    } else {
        console.error('Element with id "bookmarkedCount" not found');
    }
}

// Function to toggle bookmark for the current question
function toggleBookmark() {
  // Toggle the bookmarked state for the current question
  bookmarks[currentQuestionIndex] = !bookmarks[currentQuestionIndex];
  saveBookmarksToLocalStorage(); // Save bookmarks to local storage
  
  // Update the UI to reflect the new bookmarked state
  showQuestion();
  
  // Update the bookmark count
  updateBookmarkedCount();
}

// Call the updateBookmarkedCount function when the window is fully loaded
window.addEventListener('load', function() {
  updateBookmarkedCount();
});


// Function to load the current question index from local storage
function loadCurrentQuestionIndex() {
  const storedIndex = localStorage.getItem(`${uniqueIdentifier}_currentQuestionIndex`); // Using unique identifier
  if (storedIndex !== null) {
    currentQuestionIndex = parseInt(storedIndex);
  }
}

// Call the function to load the current question index from local storage when the page loads
window.addEventListener('load', function() {
  loadCurrentQuestionIndex();
  showQuestion();
});

// Function to save the current question index to local storage
function saveCurrentQuestionIndex() {
  localStorage.setItem(`${uniqueIdentifier}_currentQuestionIndex`, currentQuestionIndex); // Using unique identifier
}

// Call the function to save the current question index to local storage when the user navigates to the next or previous question
window.addEventListener('beforeunload', function() {
  saveCurrentQuestionIndex();
});






const uniqueIdentifier = 'sscvocab1';





        loadUserDataAndBookmarksFromLocalStorage(uniqueIdentifier);

        function saveUserDataAndBookmarksToLocalStorage(identifier) {
            localStorage.setItem(`userdata_bookmarks_${identifier}`, JSON.stringify(bookmarks));
        }

        function loadUserDataAndBookmarksFromLocalStorage(identifier) {
            const storedData = localStorage.getItem(`userdata_bookmarks_${identifier}`);
            if (storedData) {
                bookmarks = JSON.parse(storedData);
            }
        }

 function saveBookmarksToLocalStorage() {
            saveUserDataAndBookmarksToLocalStorage(uniqueIdentifier);
        }
	
		function exportBookmarksToFile() {
    const bookmarksData = JSON.stringify(bookmarks);
    const blob = new Blob([bookmarksData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/[^a-zA-Z0-9]/g, '')}_bookmarks.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function importBookmarksFromFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const importedBookmarks = JSON.parse(e.target.result);
        if (importedBookmarks) {
            bookmarks = importedBookmarks;
            saveUserDataAndBookmarksToLocalStorage(uniqueIdentifier);
            showQuestion();
        }
    };
    reader.readAsText(file);
}
		
		
		
	
// Call the function to load bookmarks from local storage when the page loads
window.addEventListener('load', function() {
    loadUserDataAndBookmarksFromLocalStorage(uniqueIdentifier);
    showQuestion();
});



function showQuestion() {
    // Get the current question
    let currentQuestion;

    // Check if only bookmarked questions should be populated
    if (populateBookmarkedQuestions) {
        // Get the bookmarked indices
        const bookmarkedIndices = getBookmarkedIndices();
        
        // If there are bookmarked questions, select the current one
        if (bookmarkedIndices.length > 0) {
            // Select the current bookmarked question
            currentQuestionIndex = bookmarkedIndices[currentBookmarkIndex];
            
            // Update current bookmark index for cycling through bookmarked questions
            currentBookmarkIndex = (currentBookmarkIndex + 1) % bookmarkedIndices.length;
        }
    }

    // Get the current question
    currentQuestion = questions[currentQuestionIndex]; 

    // Shuffle the options
    const shuffledOptions = shuffleArray(currentQuestion.options);

    // Display the question text
        questionElement.textContent = `Q.${currentQuestionIndex + 1}: ${currentQuestion.question}`;


     <!-- Generate HTML for options -->
const optionsHTML = shuffledOptions.map((option, index) => {
    return `
        <div class="form-check" style="margin-bottom: 10px; opacity: 0; transform: translateY(20px); transition: opacity 0.3s ease, transform 0.3s ease;">
            <input class="form-check-input" type="radio" name="option" value="${index}" id="option${index}">
            <label class="form-check-label" for="option${index}">
                <div class="option-border">
                    ${option}
                </div>
            </label>
        </div>`;
}).join('');

// Set the HTML for options
optionsElement.innerHTML = optionsHTML;

    // Apply animations after rendering
    const optionContainers = document.querySelectorAll('.form-check');
    optionContainers.forEach((optionContainer, index) => {
        setTimeout(() => {
            optionContainer.style.opacity = '1';
            optionContainer.style.transform = 'translateY(0)';
        }, index * 100); // Adjust the delay as needed
    });

    // Update bookmark button text
    const bookmarkButton = document.querySelector('.btn-bookmark');
    bookmarkButton.textContent = bookmarks[currentQuestionIndex] ? '🔖' : '✨';
}


  function showNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      resetQuestionContainer();
      currentQuestionIndex++;
      showQuestion();
    }
  }

function showPreviousQuestion() {
    resetQuestionContainer();
    if (populateBookmarkedQuestions) {
        const bookmarkedIndices = getBookmarkedIndices();
        if (bookmarkedIndices.length > 0) {
            // Find the nearest previous bookmarked question index
            let nearestIndex = -1;
            for (let i = bookmarkedIndices.length - 1; i >= 0; i--) {
                if (bookmarkedIndices[i] < currentQuestionIndex) {
                    nearestIndex = i;
                    break;
                }
            }
            // Update current bookmark index
            if (nearestIndex !== -1) {
                currentBookmarkIndex = nearestIndex;
                currentQuestionIndex = bookmarkedIndices[currentBookmarkIndex];
            }
        }
    } else {
        currentQuestionIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
    }
    showQuestion();
}

function jumpToQuestion() {
    const jumpInput = document.getElementById('jumpToQuestion');
    const questionNumber = parseInt(jumpInput.value);
    
    if (!isNaN(questionNumber) && questionNumber >= 1 && questionNumber <= questions.length) {
        let targetIndex = questionNumber - 1;
        
        // Get the bookmarked indices
        const bookmarkedIndices = getBookmarkedIndices();
        
        // Check if the target index is bookmarked
        if (populateBookmarkedQuestions) {
            // If only bookmarked questions are being populated, then target index should be among bookmarked indices
            if (bookmarkedIndices.includes(targetIndex)) {
                // Set currentBookmarkIndex to the index of targetIndex in bookmarkedIndices
                currentBookmarkIndex = bookmarkedIndices.indexOf(targetIndex);
                currentQuestionIndex = targetIndex;
                showQuestion();
            } else {
                alert('Please enter a valid question number between 1 and ' + questions.length + ' that is bookmarked.');
            }
        } else {
            // If all questions are being populated, directly jump to the target index
            currentQuestionIndex = targetIndex;
            showQuestion();
        }
    } else {
        alert('Please enter a valid question number between 1 and ' + questions.length);
    }
}

function showAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctOption === currentQuestion.options[parseInt(selectedOption.value)];

     // Display selected option feedback
    const selectedLabel = selectedOption.parentElement.querySelector('.form-check-label');
    selectedLabel.innerHTML += isCorrect ? ' <i class="fas fa-check text-success"></i>' : ' <i class="fas fa-times text-danger"></i>';
    selectedLabel.classList.add(isCorrect ? 'text-success' : 'text-danger');

    // Display correct option feedback
 // Display correct option feedback
const correctOptionIndex = currentQuestion.options.findIndex(option => option === currentQuestion.correctOption);
const correctOptionBorder = document.querySelector(`#option${correctOptionIndex} + .form-check-label .option-border`);

if (correctOptionBorder) {
  correctOptionBorder.innerHTML += ' <span class="text-success-transparent">☑Correct</span>';
  correctOptionBorder.classList.add('text-success-transparent');
  correctOptionBorder.classList.add('shake'); // Apply shake class
}

// Preserve existing option texts
currentQuestion.options.forEach((option, index) => {
  if (index !== correctOptionIndex) {
    const optionLabel = document.querySelector(`#option${index} + .form-check-label .option-border`);
    if (optionLabel) {
      optionLabel.innerHTML = option; // Reset option text
    }
  }
});

// Display explanation
const explanation = document.createElement('p');
    explanation.innerHTML = `<button class="cool">${currentQuestion.correctOption || ''}</button><br><h6>${currentQuestion.explanation || ''}</h6>`.replace(/\n/g, '<br>');
    optionsElement.appendChild(explanation);

 

  }
}

document.addEventListener('change', function(event) {
  if (event.target.tagName.toLowerCase() === 'input' && event.target.type === 'radio' && event.target.name === 'option') {
    showAnswer();
  }
});





function resetQuestionContainer() {
    questionContainer.classList.remove('current-question');
    setTimeout(() => {
      questionContainer.classList.add('current-question');
    }, 10); // Small delay to ensure smooth transition
  }
  



function showBookmarkedQuestions() {
  // Hide layer 1
  const layer1 = document.getElementById('layer1');
  layer1.style.display = 'none';

  // Get the container for bookmarked questions
  const bookmarkedQuestionsContainer = document.getElementById('bookmarkedQuestions');
  bookmarkedQuestionsContainer.innerHTML = ''; // Clear previous content

  // Initialize count for bookmarked questions
  let bookmarkedCount = 0;

  // Iterate through all questions to collect bookmarked ones
  for (let i = 0; i < questions.length; i++) {
    if (bookmarks[i]) {
      bookmarkedCount++; // Increment bookmarked count

      // Create a div for each bookmarked question
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('bookmarked-question');

      // Display the question
      const questionText = document.createElement('p');
      questionText.textContent = `Question ${i + 1}: ${questions[i].question}`;
	  questionText.style.fontSize = '18px'; // Change the font size as needed
      questionDiv.appendChild(questionText);

      // Display the options as radio buttons
      const optionsList = document.createElement('ul');
      optionsList.style.listStyleType = 'none';
      for (let j = 0; j < questions[i].options.length; j++) {
        const optionItem = document.createElement('li');
        const optionLabel = document.createElement('label');
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = `question${i}`;
        optionInput.value = j;
        optionInput.addEventListener('change', function() {
          // Highlight the correct option when any option is selected
          const correctOptionIndex = questions[i].options.indexOf(questions[i].correctOption);
          const correctOptionLabel = optionsList.querySelectorAll('label')[correctOptionIndex];
          correctOptionLabel.style.backgroundColor = 'lightgreen';
        });
        optionLabel.textContent = questions[i].options[j];
        optionLabel.prepend(optionInput);
        optionItem.appendChild(optionLabel);
        optionsList.appendChild(optionItem);
      }
      questionDiv.appendChild(optionsList);

      // Add a button to check the correct answer
      const checkAnswerButton = document.createElement('button');
      checkAnswerButton.textContent = 'Check Answer';
      checkAnswerButton.onclick = function() {
        // Get the selected option
        const selectedOption = optionsList.querySelector('input:checked');
        if (selectedOption) {
          const selectedIndex = parseInt(selectedOption.value);
          if (questions[i].options[selectedIndex] === questions[i].correctOption) {
            // Highlight the correct option
            const correctOptionIndex = questions[i].options.indexOf(questions[i].correctOption);
            const correctOptionLabel = optionsList.querySelectorAll('label')[correctOptionIndex];
            correctOptionLabel.style.backgroundColor = 'gray';
          }
        } else {
          // No option selected
          alert('Please select an option.');
        }
      };
      questionDiv.appendChild(checkAnswerButton);

      // Add a button to remove the bookmark
      const removeBookmarkButton = document.createElement('button');
      removeBookmarkButton.textContent = 'Remove Bookmark';
      removeBookmarkButton.onclick = function() {
        // Remove the bookmark for this question
        bookmarks[i] = false;
        // Update the UI to reflect the change
        showBookmarkedQuestions(); // Update the bookmarked questions list
      };
      questionDiv.appendChild(removeBookmarkButton);

      // Add the bookmarked question to the container
      bookmarkedQuestionsContainer.appendChild(questionDiv);
    }
  }
// Display total bookmarked questions count
const bookmarkedCountElement = document.createElement('p');
bookmarkedCountElement.textContent = `Total Bookmarked Questions: ${bookmarkedCount}`;
bookmarkedCountElement.style.color = 'black'; // Set text color to blue
bookmarkedCountElement.style.fontWeight = 'bold'; // Make text bold
bookmarkedCountElement.style.fontSize = '14px'; // Set font size
bookmarkedCountElement.style.backgroundColor = 'gold'; // Add background color
bookmarkedCountElement.style.padding = '8px'; // Add padding for better appearance
bookmarkedCountElement.style.marginBottom = '10px'; // Add some margin bottom for spacing
bookmarkedQuestionsContainer.prepend(bookmarkedCountElement);

  // Show layer 2
  const layer2 = document.getElementById('layer2');
  layer2.style.display = 'block';
}


function hideBookmarkedQuestions() {
  // Hide layer 2
  const layer2 = document.getElementById('layer2');
  layer2.style.display = 'none';

  // Show layer 1
  const layer1 = document.getElementById('layer1');
  layer1.style.display = 'block';
}

// Unlimited Scrolling codes start from here

    var bookmarkedQuestions = document.getElementById('bookmarkedQuestions');
    var lastScrollTop = 0;

    // Function to load more content when the user scrolls to the bottom
    function loadMoreContent() {
      var scrollTop = bookmarkedQuestions.scrollTop;
      var scrollHeight = bookmarkedQuestions.scrollHeight;
      var clientHeight = bookmarkedQuestions.clientHeight;

      if (scrollTop > lastScrollTop) {
        if (scrollTop + clientHeight >= scrollHeight) {
          // Load more content here
          // Example: fetch more bookmarked questions from the server and append them to the #bookmarkedQuestions element

          // For example:
          // fetch('/load-more-bookmarked-questions')
          //   .then(response => response.json())
          //   .then(data => {
          //     // Append the new questions to the #bookmarkedQuestions element
          //     // Example: data.forEach(question => { /* Append question to #bookmarkedQuestions */ });
          //   });
        }
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }

    // Add event listener for scroll events
    bookmarkedQuestions.addEventListener('scroll', loadMoreContent);

// Unlimited Scrolling codes end here

document.addEventListener('keydown', function(event) {
  switch (event.key) {
    case 'ArrowLeft':
      showPreviousQuestion();
      break;
    case 'ArrowRight':
      showNextQuestion();
      break;
    case 'ArrowUp':
      showAnswer();
      break;
    case '1':
    case '2':
    case '3':
    case '4':
	case '5':
      // Convert the key to an index (0-based)
      const index = parseInt(event.key) - 1;
      const radios = document.getElementsByName('option');
      if (index >= 0 && index < radios.length) {
        radios[index].checked = true;
      }
      break;
    default:
      break;
  }
});

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwipe = false;


document.addEventListener('touchstart', function(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  isSwipe = false; // Reset the flag for each touchstart
});

document.addEventListener('touchmove', function(event) {
  touchEndX = event.touches[0].clientX;
  touchEndY = event.touches[0].clientY;

  // Calculate the distance moved in the X and Y directions
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // If the distance moved in the X direction is greater than the threshold, consider it a swipe
  if (Math.abs(deltaX) > 10) {
    isSwipe = true;
  }
});

document.addEventListener('touchend', function(event) {
  if (isSwipe) {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    const touchSensitivity = 50; // Adjust as needed

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > touchSensitivity) {
      if (deltaX > 0) {
        // Swipe right (previous question)
        showPreviousQuestion();
      } else {
        // Swipe left (next question)
        showNextQuestion();
      }
    } else if (Math.abs(deltaY) > touchSensitivity) {
      if (deltaY < 0) {
        // Swipe up (open answer)
        ; 				// write showAnswer(); to enable it in this very line 
      }
    }
  }
});




 function goToHub() {
        // Change 'https://example.com' to the actual URL you want to redirect to
        window.location.href = '../../awareness/awareness1.html';
    }

  function goToWebsite() {
        // Change 'https://example.com' to the actual URL you want to redirect to
        window.location.href = '../../index.html';
    }
 function examQuiz() {
        // Change 'https://example.com' to the actual URL you want to redirect to
        window.location.href = '../../examquiz/examquiz.html';
    }

 function goToEnglish() {
        // Change 'https://example.com' to the actual URL you want to redirect to
        window.location.href = '../../english/english1.html';
    }


  

	// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-mode');
    
    // Toggle the class and set the cookie
    if (isDarkMode) {
        body.classList.remove('dark-mode');
        setDarkModeCookie(false); // Set cookie to false (light mode)
    } else {
        body.classList.add('dark-mode');
        setDarkModeCookie(true); // Set cookie to true (dark mode)
    }
}

// Function to set the dark mode cookie
function setDarkModeCookie(isDarkMode) {
    document.cookie = `darkMode=${isDarkMode}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
}

// Function to check if dark mode preference is stored in the cookie and apply it
function applyDarkModeFromCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'darkMode' && value === 'true') {
            document.body.classList.add('dark-mode');
            return;
        }
    }
}

// Apply dark mode preference from the cookie on page load
applyDarkModeFromCookie();

function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.style.left === "-250px") {
    sidebar.style.left = "0";
  } else {
    sidebar.style.left = "-250px";
  }
}

   function goBack() {
            window.history.back();
        }
	
        var prevScrollpos = window.pageYOffset;

        window.onscroll = function() {
            var currentScrollPos = window.pageYOffset;
            var navbar = document.getElementById('navbot');

            if (prevScrollpos > currentScrollPos) {
                navbar.classList.remove('hidden');
            } else {
                navbar.classList.add('hidden');
            }

            prevScrollpos = currentScrollPos;
        };
	

const copyButton = document.querySelector('.btn-copy');

        // Add a click event listener to the "Copy to Clipboard" button
        copyButton.addEventListener('click', () => {
            const questionText = document.querySelector('#question').textContent;
            const optionElements = document.querySelectorAll('.form-check-label');
            
            let optionsText = '';
            let correctOption = null;

            optionElements.forEach((optionElement, index) => {
                const optionText = optionElement.textContent.trim();
                const isCorrect = optionElement.querySelector('.text-info'); // Check for correct answer indication
                optionsText += `Option ${index + 1}: ${optionText}${isCorrect ? '' : ''}\n`;

                if (isCorrect) {
                    correctOption = `correctOption is Option ${index + 1}: ${optionText}`;
                }
            });

            const textToCopy = `${questionText}\n\n${optionsText}\n${correctOption ? correctOption : ''}`;

            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            // Toggle button text
            copyButton.textContent = '✅';
            setTimeout(() => {
                copyButton.textContent = '📋';
            }, 2000); // Reset text after 2 seconds
        });
		
	
