//variables to capture the user form and text input areas by ID 
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var languageButtonsEl = document.querySelector("#language-buttons");
// these two vars reference the DOM elements for the Repos/repo username
// that will be displayed
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//event handler to be executed upon a form submission browser event
var formSubmitHandler = function(event) {
    // this event.preventDefault(); stops the browser from performing the default action the
    // events wants it to do
    // in the case of submitting the form it prevents the browsert from sending
    //the forms input data to a URL- we"ll handle this ourselves in JS
    event.preventDefault();

    // get value from input element, trim accounts of leading or trailing
    // spaces like " gintstir" or "ginststir "
    var username = nameInputEl.value.trim();
    //we check that the nameInputEl isnt blank
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
        // create alert if input field has been left empty
    } else {
        alert("Please enter a valid Github username");
    }
    
};

//This function requests info from Github but the results are only diplayed
// in devtools.  
var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl).then(function(response) {
        // we check if it was a successful request by using the 'ok' property thats bundled
        // in the response object from fetch().  When the HTTP request status code is something 
        //in the 200s the 'ok' property will be true
        if (response.ok) {        
            response.json().then(function(data) {
            //when response data is converted to JSON, it will be sent
            // from this function -getUserRepos()- to displayRepos()
            displayRepos(data, user);
            });
        // if 'ok' property is false we know that something is wrong with the HTTP request so
        // we send alert checking the statusText property to see what the problem is.
        } else {
            alert("Error: " + response.statusText);
        }         
    })
    .catch(function(error) {
        // this .catch() is being chained to the end of the '.then() method
        // when the request succeeds it gets turned into the .then(), when it fails
        // the error will be sent to the .catch() method.  
        alert("Unable to connect to GitHub");
    })
};

//  This function will accept both the array of repository data
// and the term we searched for as parameters

var displayRepos = function(repos, searchTerm) {
    
    // check if the API returned any repos, If user exists but if
    // repos === 0 then display message in repo container 
    if (repos.length === 0) {
        repoContainerEl.textContent = "No respositories found.";
        return;
    }
    
    
    // When working with an app that displays data based on user
    //inoput, we should always be sure to clear old content before
    // displaying new content.
    repoContainerEl.texcontent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over entries in repository
    for (var i = 0; i < repos.length; i++) {
        //format repo name (.owner refers to repo owner, name refers to repo name)
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo so it appears on the page in a new <a>
        var repoEl = document.createElement("a");//turns the repo into <a> elements
        // assign css classes to newly created div
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);//gives the newly create <a> element an href that links to single-repo.html

        //create a span element to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName; 

        //append to container- add span to Div
        repoEl.appendChild(titleEl);
        
        //Create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not with conditional statement
        // if repo has issues(issues > 0), display red x and number of open issues
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        // if "if condition is not met" display check mark mark showing no open issues
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        //append container to the DOM- add Div to the div container we created earlier
        repoContainerEl.appendChild(repoEl);
    }
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
          alert("Error: " + response.statusText);
        }     
    });
};

var buttonClickHandler = function(event){
    var language = event.target.getAttribute("data-language");
    if (language) {
        getFeaturedRepos(language);
      
        // clear old content
        repoContainerEl.textContent = "";
      }
};



// event listener for the submit button 
userFormEl.addEventListener("submit", formSubmitHandler);
//event listener for the sort by language buttons
languageButtonsEl.addEventListener("click", buttonClickHandler);
