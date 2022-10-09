const elForm = document.querySelector("#form");

const elInput = document.querySelector(".input");

const elDropdown = document.querySelector(".dropdown");

const elNetStatusAlert = document.querySelector(".status");

const elCategories = document.querySelector(".categories");

const elArrowTop = document.querySelector(".top");

const elBody = document.querySelector(".body");

const elList = document.querySelector(".list");

const contents = document.querySelectorAll(".movie__item");

const items = elList.getElementsByClassName("movie__item");

const elTemplate = document.querySelector(".movie__template").content;

//slice qisak, originalga ta'sir qimasdan, yengi arrayga kopiya oladi.
//splice qisak, original array kesvoladi

const cinemas = movies.slice(0, 100);

const fragment = document.createDocumentFragment();

const modalBox = document.querySelector(".modal");

const modalSkeleton = document.querySelector(".skeleton-card");

const connectionSpeed = navigator.connection.effectiveType;



// Function for removing skeleton animation
function skeleton(items, content ) {
    if (navigator.onLine) {
        setTimeout(() => {
            items.style.display = "none";
            elNetStatusAlert.classList.add("d-none");
        }, 1);
    }else if (navigator.offLine ){
        content.style.display = "none";
        elNetStatusAlert.classList.add("d-block");
        items.classList.remove("d-none");
        setInterval(() => { window.location.reload()}, 4000)
    }
}


// Rendering main items
function renderContent() {
    for (let i = 0; i < cinemas.length; i++) {
        
        let clonedTemplate = elTemplate.cloneNode(true);
        let cards = clonedTemplate.querySelector(".skeleton-cards");
        
        // Check internet connectivity
        skeleton(cards, items);
        
        clonedTemplate.querySelector(".movie__item").dataset.index = cinemas[i].imdb_rating;
        clonedTemplate.querySelector(".movie__item").setAttribute(`data-year` ,`${cinemas[i].movie_year}`);
        clonedTemplate.querySelector(".movie__cover").src = `http://i3.ytimg.com/vi/${cinemas[i].ytid}/mqdefault.jpg`;  
        clonedTemplate.querySelector(".movie__title").textContent = cinemas[i].Title;
        clonedTemplate.querySelector(".movie__rating").textContent = cinemas[i].imdb_rating;
        clonedTemplate.querySelector(".movie__time").textContent = cinemas[i].movie_year;
        clonedTemplate.querySelector(".movie__time").dateTime = cinemas[i].movie_year + "-10-05";
        clonedTemplate.querySelector(".movie__duration").textContent = Number(Math.floor(cinemas[i].runtime / 60)) + " hr ";
        clonedTemplate.querySelector(".movie__duration").textContent += Number(cinemas[i].runtime % 60) + " min ";
        clonedTemplate.querySelector(".movie__genre").textContent = cinemas[i].Categories.split("|").join(", ");
        clonedTemplate.querySelector(".movie__info").dataset.modalIndex = cinemas[i].imdb_id;
        
        fragment.appendChild(clonedTemplate);
        
    }
    elList.appendChild(fragment);  
    
}



// Function for checking internet connection status
function makeRequest(data) {
    setTimeout(() => {
        fetch(`{https://www.youtube.com/embed/${data}`)
        .then(response => {
            console.log('response.status: ', response.status); 
            console.log(response, "errorr");
        })
        .catch(err => {
            console.log(err, "Yes this error");
        });
    }, 3500);
}

// Function for stoping youtube video when modal box close
function stopYoutube(media) {
    
    modalBox.addEventListener('hide.bs.modal', () => { 
        media.src = ""
        setTimeout(() => {
            modalSkeleton.classList.remove("d-none");
        }, 500);
    });
}


// Event Delegation for Modal boxes
elList.addEventListener("click", function(ev) {
    let modalTitle = document.querySelector(".modal-title");
    let modalIframe = document.querySelector(".modal-iframe");
    console.log(modalIframe);
    let modalContent = document.querySelector(".modal-content-right");
    
    let clonedTemplated = document.querySelector(".modal__template").content;
    
    let clonedTemplate = clonedTemplated.cloneNode(true);
    
    // Canceling skeleton anmitation
    setTimeout(() => {
        modalSkeleton.classList.add("d-none");
    }, 1500);
    if(ev.target.matches(".movie__info") && navigator.onLine) {
        
        skeleton();
        makeRequest(modalIframe.src);
        
        let buttonId = ev.target.dataset.modalIndex;
        let find = cinemas.find(element => element.imdb_id === buttonId);
        
        modalTitle.textContent = find.Title;
        modalIframe.src = `https://www.youtube.com/embed/${find.ytid}`;
        
        stopYoutube(modalIframe);
        
        clonedTemplate.querySelector(".movie__rating").textContent = find.imdb_rating;
        clonedTemplate.querySelector(".movie__time").textContent = find.movie_year;
        clonedTemplate.querySelector(".movie__duration").textContent = Number(Math.floor(find.runtime / 60)) + " hr ";
        clonedTemplate.querySelector(".movie__duration").textContent += Number(Math.floor(find.runtime % 60)) + " min ";
        clonedTemplate.querySelector(".movie__genre").textContent = find.Categories.split("|").join(", ");
        clonedTemplate.querySelector(".movie__description").textContent = find.summary;
        clonedTemplate.querySelector(".movie__link-imdb").href = `https://www.imdb.com/title/${find.imdb_id}`
        fragment.appendChild(clonedTemplate);
        
        modalContent.innerHTML = "";
        modalContent.appendChild(fragment);
        
    }else {
        modalSkeleton.style.display = "block";
    }
    
})

renderContent();


const convertedToArrayItems = Array.from(items);

// Function for search movie via input
function search(value = null) {  
    convertedToArrayItems.forEach(element => {
        let titles = element.getElementsByClassName("movie__title")[0].innerHTML.toUpperCase();
        let result = titles.match(value);
        
        if (result != null) {
            element.style.display = "";
            
        }else if (result === null) {
            element.style.display = "none";
            // notFound.classList.remove("d-none");
        }
    });
    
}


// EventListener function for searching movie via input

elForm.addEventListener("keyup", function(evt) {

    let elInputValue = elInput.value.toUpperCase();   
    
    search(value = elInputValue);
    
});

// Function for searching via buttons
function sortingContent(element, evennt) {
    // convertedToArrayItems.forEach(element => {
    for (let i = 0; i < items.length; i++) {  
        let titles = items[i].getElementsByClassName(element)[0].innerHTML;
        let res = titles.match(evennt.target.textContent);
        if (res) {
            items[i].style.display = "";
        }else {
            items[i].style.display = "none";
        }
        
    }
}


// Function mini for searching with dropdown list
function dropdownSorting (targetedElem, targeted) {
    return targetedElem.textContent.startsWith(targeted)
}


function compare (a, b) {
    if (a.dataset.index > b.dataset.index){
        return -1
    }
    if (a.dataset.index < b.dataset.index || a.dataset.index == b.dataset.index) {
        return 1
    }
}



// Function for sorting by rating
function sortByRating(item) {
    let itemIndexes = document.querySelectorAll(item);
    let indexesArray = Array.from(itemIndexes);
    let sort = indexesArray.sort(compare);
    let sorted  = sort.forEach(element => {
        elList.appendChild(element);
    });
}


elCategories.addEventListener("click", function(evt) {
    // window.location.reload();
    let targetedTags = evt.target.matches(".tags");
    let targetedDropdown = evt.target;
    
    if(targetedTags) {
        // elList.innerHTML = "";
        // renderContent();
        sortingContent("movie__genre", evt);
        
    }else if (targetedDropdown) {
        if (dropdownSorting(targetedDropdown, "High")) {
            // elList.innerHTML = "";
            // renderContent();
            sortByRating("[data-index]");
            
        }
        if (dropdownSorting(targetedDropdown, "Year")) {
            // Unfinished
            // sortByRating();
            // renderContent();
        }
        
    }
})


elBody.onscroll = function(e) {
    this.oldScroll = this.scrollY;
    elArrowTop.classList.remove("d-none");
    setTimeout(function() {
        elArrowTop.classList.add("d-none");
    }, 3000)
    
}

