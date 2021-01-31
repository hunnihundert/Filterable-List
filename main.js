// entry class: represents an entry
class PhoneBookEntry {
    constructor(name, phoneNumber) {
        this.name = name
        this.phoneNumber = phoneNumber
    }
}

// handles UI tasks
class UI {



    static displayEntries() {
        const entries = Storage.getEntries()
        entries.forEach((entry) => UI.addEntry(entry))
    }

    static addEntryToList(entry) {
        const firstLetterOfEntry = entry.name.charAt(0).toUpperCase()
        // check if it is the first entry with the starting letter and add if non-existent
        UI.addHeaderIfNonExistent(firstLetterOfEntry)

        // add to list
        // find position to add
        let insertIndex
        const namesUl = document.querySelector('#names')
        // find header
        let targetHeader
        let afterHeaderTarget
        const namesHeaders = namesUl.querySelectorAll('.collection-header')
        for (var i = 0; i < namesHeaders.length; i++) {
            const namesHeadersFirstLetter = namesHeaders[i].querySelector('h5').innerHTML
            if (namesHeadersFirstLetter == firstLetterOfEntry) {
                targetHeader = namesHeaders[i]
            } else if (namesHeadersFirstLetter > firstLetterOfEntry) {
                afterHeaderTarget = namesHeaders[i]
                break
            }
        }
        const targetHeaderIndex = Array.prototype.indexOf.call(namesUl.children, targetHeader)
        var afterTargetHeaderIndex = Array.prototype.indexOf.call(namesUl.children, afterHeaderTarget)
        if (afterTargetHeaderIndex == -1) {
            afterTargetHeaderIndex = namesUl.children.length
        }

        // check the list elements after the header (before next header)
        // if no list element exists, position is right after header
        if (targetHeaderIndex == afterTargetHeaderIndex - 1) {

            insertIndex = afterTargetHeaderIndex
        } else {
            // if list element exists, position is alphabetically set
            // travers through list elements and find alphabetical correct position
            for (var i = targetHeaderIndex + 1; i < afterTargetHeaderIndex; i++) {
                const nameInList = namesUl.children[i].querySelector('a').innerHTML
                if (entry.name.localeCompare(nameInList) < 0) {
                    insertIndex = i
                    break
                }
                insertIndex = i + 1
            }
        }

        // create DOM
        const newEntry = document.createElement('li')
        newEntry.className = 'collection-item row'
        newEntry.innerHTML = `
        <div class="col s8"><a href="#">${entry.name}</a></div>
        <div class="col s4"><a href="#">${entry.phoneNumber}</a></div>
        `
        // append DOM
        namesUl.insertBefore(newEntry, namesUl.children[insertIndex])

    }

    static deleteEntry(element) {
        // remove element from the parent

    }

    static showAlert(message, className) {
        // show alert, if entry field is missing

        // show alert that entry has been added successfully

        // show alert that entry has been deleted successfully
    }

    static addHeaderIfNonExistent(firstLetterOfEntry) {
        const namesUl = document.querySelector('#names')
        const namesHeaders = namesUl.querySelectorAll('.collection-header')
        var containsLetter = ''

        for (var i = 0; i < namesHeaders.length; i++) {
            const namesHeadersFirstLetter = namesHeaders[i].querySelector('h5').innerHTML
            if (namesHeadersFirstLetter == firstLetterOfEntry) {
                containsLetter = firstLetterOfEntry
                break
            }
        }

        if (containsLetter == '') {
            // if so add entry header with starting letter
            // find position to insert the header
            // traverse through list and return the position of the element at which the first letter changes
            const namesLi = namesUl.children
            var index = 0
            for (; index < namesLi.length; index++) {
                if (namesLi[index].className == 'collection-header') {
                    if (firstLetterOfEntry < namesLi[index].querySelector('h5').innerHTML.toUpperCase()) {
                        break
                    }
                }
            }
            // create the header
            const newHeader = document.createElement('li')
            newHeader.className = "collection-header"
            newHeader.innerHTML = `<h5>${firstLetterOfEntry}</h5>`

            // insert the header
            namesUl.insertBefore(newHeader, namesUl.children[index])
        }
    }
}

// handles local storage
class Storage {
    // get items from storage

    // add item to storage

    // remove item from storage
}




// get input element
const filterInput = document.querySelector('#filterInput')

// set filterinput to listen to keyup event
filterInput.addEventListener('keyup', filterNames)

function filterNames() {
    // get value of input
    const filterValue = filterInput.value.toUpperCase()

    // get names of ul
    const namesUl = document.querySelector('#names')

    // get lis from ul
    const namesLi = namesUl.querySelectorAll('.collection-item')

    // loop through colleciton-item list
    for (i = 0; i < namesLi.length; i++) {
        // get the innerHTML from each list item
        const name = namesLi[i].getElementsByTagName('a')[0].innerHTML

        // check if name contains search input
        if (name.toUpperCase().indexOf(filterValue) > -1) {
            namesLi[i].style.display = ''
        } else {
            namesLi[i].style.display = 'none'
        }
    }
}

document.querySelector('#addEntry').addEventListener('click', (e) => {
    // get name, phone number field values
    const name = document.querySelector('#name').value
    const phoneNumber = document.querySelector('#phoneNumber').value

    // reset error messages 
    document.querySelector('#nameError').innerHTML = ''
    document.querySelector('#phoneNumberError').innerHTML = ''

    // check if fields are not empty
    if (name === '' || phoneNumber === '') {
        // show error for each field in case of emptiness
        if (name === '') {
            const span = document.querySelector('#nameError')
            span.innerHTML = "Please enter name"
            span.style.color = 'red'
        }
        if (phoneNumber === '') {
            const span = document.querySelector('#phoneNumberError')
            span.innerHTML = "Please enter number"
            span.style.color = 'red'
        }
    } else {
        // check if name is alpha numberic character
        const alphanumbericString = /^[0-9a-zA-Z]+$/
        if (!name.match(alphanumbericString)) {
            const span = document.querySelector('#nameError')
            span.innerHTML = "Please enter characters and numbers only"
            span.style.color = 'red'
        } else {
            // create entry
            const newEntry = new PhoneBookEntry(name, phoneNumber)
            // add entry to UI
            UI.addEntryToList(newEntry)
            // add entry to local storage
            // TODO

            // clear input fields
            document.querySelector('#name').value = ''
            document.querySelector('#phoneNumber').value = ''
        }

    }

})