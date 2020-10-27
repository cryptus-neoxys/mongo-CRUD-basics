const addButton = document.querySelector('.addButton')
var input = document.querySelector('.input')
const container = document.querySelector('.container')

class item {
    constructor(itemName) {
        this.createDiv(itemName)
    }
    createDiv(itemName) {
        let input = document.createElement('input')
        input.value = itemName
        input.disabled = true
        input.classList.add('item_input')
        input.type = 'text'

        let itemBox = document.createElement('div')
        itemBox.classList.add('item')

        let editButton = document.createElement('button')
        editButton.innerHTML = 'EDIT'
        editButton.classList.add('editButton')

        let removeButton = document.createElement('button')
        removeButton.innerHTML = 'REMOVE'
        removeButton.classList.add('removeButton')

        container.appendChild(itemBox)

        itemBox.appendChild(input)
        itemBox.appendChild(editButton)
        itemBox.appendChild(removeButton)

        editButton.addEventListener('click', () => this.edit(input))

        removeButton.addEventListener('click', () => this.remove(itemBox, input.value))
    }

    async edit(input) {
        const newInput = prompt('Enter new msg:', input)
        await fetch('/api/modify', {
            method: 'POST',
            body: JSON.stringify({ old: input.value, new: newInput }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        input.value = await newInput;
    }

    async remove(item, value) {
        container.removeChild(item)
        await fetch('/api/delete', {
            method: 'POST',
            body: JSON.stringify({ record: value }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

async function check() {
    if (input.value != '') {
        new item(input.value)

        await fetch('/api/create', {
            method: 'POST',
            body: JSON.stringify({ record: input.value }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        input.value = ''
    }
}

async function boot() {
    const records = await fetch('/api/get').then((t) => t.json())
    records.forEach(({ record }) => {
        new item(record)
    })
}

boot()

addButton.addEventListener('click', check)

window.addEventListener('keydown', (e) => {
    if (e.which == 13) {
        check()
    }
})