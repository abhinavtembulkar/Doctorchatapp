console.log('HELLO')
const socket = io.connect()

socket.emit('senddata',"send data")

var str1,str2,str3='CHATS'

//const user = document.getElementById('name')
const msgs = document.getElementById('msgs')
const mbox = document.getElementById('mbox')
const user = document.getElementById('note')
const clear = document.getElementById('clear')
//const exit = document.getElementById('exit')

socket.on('chata',(data) => {
    console.log(data,data[0])
    data.forEach(ele => {
        str3+=`<br> ${ele.name} : ${ele.chat}`
    })
    msgs.innerHTML=str3
})

mbox.addEventListener('keydown',(event)=>{
    if(event.which === 13)
    { 
        //str1=user.value
        str1=user.value
        str2=mbox.value
        str3+=`<br> ${str1} : ${str2}`
        
        //msgs.textContent=str3
        msgs.innerHTML=str3
        console.log(msgs.value)
        
        socket.emit('newuser',{
            name:str1,
            chat:str2,
        })
    }
})

socket.on('newmsg',(data)=>{
        
    var chatlog=data.chat
    var Name=data.name
    
    str3+=`<br>${Name} : ${chatlog}`
    console.log('backup!')
    msgs.innerHTML=str3
})

clear.addEventListener('click',(event)=>{
    msgs.innerHTML=''
    str3=''
})
/*
exit.addEventListener('click',(event)=>{
    socket.emit('clear',str1)
    console.log('exeunt !')
})*/