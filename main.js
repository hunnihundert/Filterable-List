// entry class: represents an entry
class PhoneBookEntry {
    constructor(name, phoneNumber) {
        this.name = name
        this.phoneNumber = phoneNumber
        this.id = name + phoneNumber
    }
}

// handles UI tasks
class UI {

    static displayEntries() {
        const entries = Storage.getEntries()
        entries.forEach((entry) => UI.addEntryToList(entry))
    }

    static addEntryToList(entry) {
        const firstLetterOfEntry = entry.name.charAt(0).toUpperCase()
        // check if it is the first entry with the starting letter and add if non-existent
        UI.addHeaderIfNonExistent(firstLetterOfEntry)
        const namesUl = document.querySelector('#names')
        // add to list
        // find position to add
        let insertIndex
        
        // get index from surrounding headers
        const surroundingHeaders = this.getSurroundingHeaderIndexes(firstLetterOfEntry)
        const targetHeaderIndex = surroundingHeaders["targetHeaderIndex"]
        const afterTargetHeaderIndex = surroundingHeaders["afterTargetHeaderIndex"]

        // check the list elements after the header (before next header)
        // if no list element exists, position is right after header
        if (targetHeaderIndex == afterTargetHeaderIndex - 1) {

            insertIndex = afterTargetHeaderIndex
        } else {
            // if list element exists, position is set alphabetically
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
        <div class="col s8" id="name"><a href="#">${entry.name}</a></div>
        <div class="col s3" id="phoneNumber"><a href="#">${entry.phoneNumber}</a></div>
        <div class="col s1"><a href="#" class="btn red darken-1" id="delete">x</a></div>
        `
        // append DOM
        namesUl.insertBefore(newEntry, namesUl.children[insertIndex])
        
    }

    static deleteEntry(element) {
        
        // check if list below header is empty, if so delete header, too
        // get first letter of element
        const firstLetterOfEntry = element.querySelector('#name').children[0].innerHTML.charAt(0).toUpperCase()
        // find index of header and index of header of the next starting letter
        const surroundingHeaders = this.getSurroundingHeaderIndexes(firstLetterOfEntry)
        const targetHeaderIndex = surroundingHeaders["targetHeaderIndex"]
        const afterTargetHeaderIndex = surroundingHeaders["afterTargetHeaderIndex"]


        // check if difference of index is 2 (header: 0, elements: 1, afterHeader: 2)
        if(afterTargetHeaderIndex - targetHeaderIndex == 2) {
            // if so delete header
            element.parentElement.children[targetHeaderIndex].remove()
        }

        // remove element
        element.remove()
        
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

    static getSurroundingHeaderIndexes(firstLetterOfEntry) {
        const namesUl = document.querySelector('#names')
        let targetHeader
        let afterHeaderTarget
        
        // get all headers
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

        // get the index of target header and after header inside children of ul
        const targetHeaderIndex = Array.prototype.indexOf.call(namesUl.children, targetHeader)
        var afterTargetHeaderIndex = Array.prototype.indexOf.call(namesUl.children, afterHeaderTarget)
        
        // if there is no afterheader then it is the last item among the children of the ul
        if (afterTargetHeaderIndex == -1) {
            afterTargetHeaderIndex = namesUl.children.length
        }
        
        var surroundingHeaders = {}
        surroundingHeaders["targetHeaderIndex"] = targetHeaderIndex
        surroundingHeaders["afterTargetHeaderIndex"] = afterTargetHeaderIndex
        return surroundingHeaders
    }
}

// handles local storage
class Storage {
    // get items from storage
    static getEntries() {
        let entries
        if(localStorage.getItem('entries') == null) {
            entries = []
        } else {
            entries = JSON.parse(localStorage.getItem('entries'))
        }
        return entries
    }

    // add item to storage
    static addEntry(entry) {
        var entries = Storage.getEntries()
        entries.push(entry)
        localStorage.setItem('entries',JSON.stringify(entries))
    }

    // remove item from storage
    static removeEntry(entryId) {
        var entries = Storage.getEntries()
        entries.forEach((entry, index) => {
            if(entry.id == entryId) {
                entries.splice(index,1)
            }
        })
        localStorage.setItem('entries', JSON.stringify(entries))
    }
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
            Storage.addEntry(newEntry)

            // clear input fields
            document.querySelector('#name').value = ''
            document.querySelector('#phoneNumber').value = ''
        }

    }

})

// add click listener to the list
document.querySelector('#names').addEventListener('click', (e) => {
    
    // check if 'x' button was clicked
    if(e.target.id == 'delete') {
        
        // remove from UI
        UI.deleteEntry(e.target.parentElement.parentElement)

        // remove from local storage
        
        const name = e.target.parentElement.parentElement.querySelector('#name').children[0].innerHTML
        const phoneNumber = e.target.parentElement.parentElement.querySelector('#phoneNumber').children[0].innerHTML
        entryId = name + phoneNumber
        Storage.removeEntry(entryId)
    }
})

// display locally saved entries
document.addEventListener('DOMContentLoaded',UI.displayEntries)