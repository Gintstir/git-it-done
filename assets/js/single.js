var issueContainerEl = document.querySelector("#issues-container");
//this function will take in a repo name as a parameter
var getRepoIssues = function(repo) {
    // console.log(repo);






//this uses FEtch API to create a HTTP request to this enpoint 
// GET /repos/:owner/:repo/issues   
var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
               displayIssues(data);
            });
        } 
        else {
            alert("There was a problem with your request!");
        }
    });
};
// similar to how we used the function displayRepos in homepage.js
// we'll use this function to turn HitHUb issue data into DOM elements
getRepoIssues("Gintstir/git-it-done");

var displayIssues = function(issues) {
    
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    
    //this loops over the respose data and creates an <a> element
    // for each issue
    for (var i = 0; i < issues.length; i++) {
        //creates a link element to take users to the issue on Github
        var issueEl = document.createElement("a");        

        issueEl.classList = "list-item flex-row justify-space-between align-center";
        //this below catches the item from the array of issue data in the DOM
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        //create a type Element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";        
        } else {
            typeEl.textContent = "(Issue)";
        }

        //append to container
        issueEl.appendChild(typeEl);

        
        issueContainerEl.appendChild(issueEl);        
    }
    
};





