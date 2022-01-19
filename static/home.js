let host = document.URL
console.log(host)
let letters=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
var socket=io.connect(host)

var dashspace=[]
var lettermapping={}
var answer=[]
var objects
var right=new Audio('../static/audios/right.mp3')
var wrong=new Audio('../static/audios/wrong.mp3')
var mainword
var btnmenu =document.getElementById('btnmenu')

btnmenu.addEventListener('click',function(){
    document.getElementById('menu').classList.toggle('active')
    document.getElementById('content').classList.toggle('fill')
})

function display(words){
    if(words.length!=0){
        words=shuffle(words)
        mainword=words[0]
        console.log(words)
        console.log(mainword)
        words.splice(words.indexOf(mainword),1)
        let picture=document.createElement('img')
        picture.className="picture"
        picture.src="../static/images/objects/"+mainword+".png"
        console.log(picture.src)
        picture.id="picture"
        let piccon=document.getElementById('object')
        piccon.appendChild(picture)
        let dashrow=document.getElementById('dashrow')
        for(i=0;i<mainword.length;i++){
            let dash=document.createElement('span')
            dash.className="dash"
            let dashcon=document.createElement('td')
            dashcon.className="dashcon"
            dashcon.id=i+1
            dashcon.appendChild(dash)
            dashrow.appendChild(dashcon)
            dashspace.push(i+1)
        }

        let checkcon=document.createElement('td')
        checkcon.className="checkcon"
        checkcon.id='checkcon'
        dashrow.appendChild(checkcon)
        var allletters=[]
        let len=mainword.length
        var max = 10-len
        for(i=0;i<max;i++){
            let index=Math.floor(Math.random()*letters.length)
            allletters.push(letters[index])
        }
        allletters=allletters.concat(mainword.split(""))
        console.log(allletters)
        allletters=shuffle(allletters)
        console.log(allletters)
        for(i=0;i<allletters.length;i++){
            let letter=document.createElement('img')
            letter.src='../static/images/letters/'+allletters[i]+'.png'
            letter.id=allletters[i]+i
            letter.className='letter'
            letter.name=allletters[i]
            let lettercon=document.createElement('td')
            lettercon.className='lettercon'
            lettercon.id=i+10
            lettercon.appendChild(letter)
            let letterrow=document.getElementById('letterrow')
            letterrow.appendChild(lettercon)
            lettermapping[i+10]=letter.id
        }
    }else{
        let complete=document.getElementById('message')
        complete.innerHTML='CHALLEGE COMPLETE'
        let welcome=document.getElementById('welcome')
        document.getElementById('intro').innerHTML='E-KIDS CHALLEGE'
        document.getElementById('start').innerHTML="NEXT CHALLEGE"
        welcome.style.top="50%"
    }
}

socket.on('learn', function(words){
    objects=words
        display(objects)
})

function shuffle(arr){
    let res=arr
   for(i=arr.length-1;i>=0;i--){
        let j=Math.floor(Math.random()*arr.length)
        let temp=res[i]
        res[i]=res[j]
        res[j]=temp
   }
   return res
}
let letterclick=document.getElementById('letterrow')
letterclick.addEventListener('click',function(e){
    if(e.target.classList.contains('letter')){
        if(dashspace.length>0){
            let keypress=document.getElementById(e.target.id)
            keypress.parentElement.removeChild(keypress)
            let fill=document.getElementById(Math.min.apply(null,dashspace))
            let index=dashspace.indexOf(Math.min.apply(null,dashspace))
            let dash=document.querySelector('.dash')
            fill.removeChild(dash)
            fill.appendChild(keypress)
            answer.splice(Math.min.apply(null,dashspace)-1,0,e.target.name) 
            dashspace.splice(index,1)
            if(dashspace.length==0){
                console.log(answer.join(""))
                var check=document.createElement('img')
                check.className='check'
                check.id="check"
                let checkout=document.getElementById('dashrow')
                if(mainword==answer.join("")){
                    check.src="static/images/right.png"
                    checkcon.appendChild(check)
                    right.play()
                    checkout.style.border="solid 8px #00ff55"
                    checkout.style.borderradius='10px'
                    setTimeout(function(){
                        checkout.style.border="none"
                        checkcon.removeChild(check)
                        let letterrow=document.getElementById('letterrow')
                        let dashrow=document.getElementById('dashrow')
                        let pic=document.getElementById('picture')
                        while(letterrow.firstChild){
                            letterrow.removeChild(letterrow.firstChild)
                        }
                        while(dashrow.firstChild){
                            dashrow.removeChild(dashrow.firstChild)
                        }
                        pic.parentNode.removeChild(pic)
                        answer=[]
                        display(objects)
                    },2000)
                }else{
                    check.src="static/images/wrong.png"
                    checkcon.appendChild(check)
                    wrong.play()
                    checkout.style.border="solid 8px #cc4444"
                    checkout.style.borderradius='10px'
                }
            }
        }
    }
})

let fillclick=document.getElementById('dashrow')
fillclick.addEventListener('click',function(e){
    if(e.target.classList.contains('letter')){
        if(mainword==answer.join("")){

        }else{
            if(dashspace.length==0){
                let check=document.getElementById('check')
                check.parentNode.parentNode.style.border="none"
                check.parentNode.removeChild(check)
            }
            let keypress=document.getElementById(e.target.id)
            let index=parseInt(keypress.parentNode.id)
            dashspace.push(index)
            answer.splice(Math.min.apply(null,dashspace)-1,1)
            console.log(answer.join(""))
            console.log(dashspace)
            let fill=keypress.parentElement
            fill.removeChild(keypress)
            let lettercon=document.getElementById(getkey(keypress.id))
            let returnletter=document.querySelector('.dash')
            lettercon.appendChild(keypress)
            let newdash=document.createElement('span')
            newdash.className="dash"
            fill.appendChild(newdash)
        }
    }
})

function getkey(item){
    let res=undefined
    for(let i in lettermapping){
        if(lettermapping[i]==item){
            res = i
            break
        }
    }
    return res
}

let btnstart=document.getElementById('start')
btnstart.addEventListener('click',function(){
    let welcome=document.getElementById('welcome')
    welcome.style.top="-1000px"
    welcome.classList.toggle('welcomehide')
    setTimeout(function(){
        socket.emit('start',"ready")
    },1000)
})

/*window.onresize=function(){
    letter=document.getElementById('letters')
    if(window.innerWidth>window.innerHeight){
        letter.style.width="10vw"
        letter.style.height="8vh"
    }else{
        letter.style.width="8vw"
        letter.style.height="10vh"
    }
}
*/
let menuitems=document.getElementById('menuitems')
menuitems.addEventListener('click',function(e){
    if(e.target.classList.contains('menuitem')){
        for(i=0;i<menuitems.children.length;i++){
           menuitems.children[i].style.backgroundColor="transparent"
        }
            e.target.style.backgroundColor="#222"
            if(e.target.children.length>0){
                let catlearn=e.target.children[1]
                e.target.classList.toggle('menuitem-ex')    
                catlearn.classList.toggle('expand')
                let icon=e.target.children[0]
                icon.classList.toggle('glyphicon-remove')
            }
    }
})
menuitemclick=document.getElementById('menuitems')
menuitemclick.addEventListener('click',function(e){
        if(e.target.id=='rand'){
            while(letterrow.firstChild){
                letterrow.removeChild(letterrow.firstChild)
            }
            while(dashrow.firstChild){
                dashrow.removeChild(dashrow.firstChild)
            }
            let pic=document.getElementById('picture')
            if(pic!=null){
                pic.parentNode.removeChild(pic)
            }
            answer=[]
            let welcome=document.getElementById('welcome')
            welcome.style.top="-1000px"
            welcome.classList.toggle('welcomehide')
            setTimeout(function(){
                socket.emit('start',"ready")
            },1000)
        }
})