let modal =document.querySelector('.startgame-modal')
let starterButton = modal.lastElementChild;
let dicecontainer = document.querySelector('.container')
let cardcon =document.querySelector('.card-container')
let counter = document.querySelector('.counter')
let levelcount = 1;
let dicecount = 4;
let now;
let starttime;
let timer
let level;
let diceimages=['./img/dicebear.png','./img/dicechicken.png','./img/dicecow.png','./img/diceelephent.png','./img/dicejiraf.png','./img/dicelion.png','./img/dicemonkey.png','./img/diceowl.png','./img/diceporkepine.png','./img/dicetortol.png',]

function suffle(array){
    for(let j=0; j < array.length; j++){
        let keep = array[j]
        let ran = Math.floor(Math.random()*4)
        array[j]=array[ran]
        array[ran]=keep
    }
}

function createdicearray(dice){
    let getdice= new Set();
        do{
            let item = diceimages[Math.round(Math.random()*diceimages.length)];
            if(!getdice.has(item) && item != undefined){
                getdice.add(item)}
        }while(getdice.size != dice/2)
        getdice = Array.from(getdice);
        getdice = getdice.concat(getdice)
        suffle(getdice)
        return getdice
}
function Level(level,dice){
        this.level= level;
        this.dicecount= dice;
        this.dicearray = createdicearray(this.dicecount);
        this.playermatch=[];
        this.match=0;
        this.clickcount=1;
        this.timeouttohide= this.level*2000;
    }

function setgame(){
    level = new Level(levelcount,dicecount);
    dicecontainer.style.display='';
    for(let i = 0; i < level.dicecount; i++){
       let  clone = cardcon.cloneNode(true)
        clone.hidden=false;
        clone.firstElementChild.firstElementChild.firstElementChild.hidden=false
        clone.firstElementChild.firstElementChild.firstElementChild.src = level.dicearray[i]
        dicecontainer.append(clone)
    }   
}

function hidedice(){
     let alldice = Array.from(document.querySelectorAll('.card-container'));
     for(let dice of alldice){
         dice.firstElementChild.classList.toggle('is-flipped')
     }
}

function setstartbutton(buttontag){
    starterButton.parentElement.parentElement.hidden = false;
    starterButton.innerHTML=buttontag;
     dicecontainer.style.display='none';
    dicecontainer.innerHTML="";  
    counter.hidden=true;
    clearTimeout(timer);  
    hidedice()  
}

function setcounter(){
    timer=setTimeout(()=>{
    let endtime = new Date();
    let interval = 60;
    ++now ;
    let distance = interval - now;
    let seconds = Math.floor(distance) %  60;
    counter.hidden = false;
    counter.textContent = `COUNTDOWN : ${seconds}S`;
    
    if(Math.round((endtime - starttime)/1000) === interval){
        if(level.match != level.dicecount/2){
            setstartbutton(`Try Again`)
             starterButton.previousElementSibling.previousElementSibling.hidden=true;
             starterButton.previousElementSibling.innerHTML=`TIME UP, TOO SLOW`;
        }
        return
    }
    setcounter()
    },1000) 
}

starterButton.addEventListener('click',function(e){
      modal.parentElement.hidden = true;
      setgame();
      setTimeout(function(){
          starttime=new Date();
          now=0
          hidedice();
          setcounter();
          for(let dice of dicecontainer.children){
            dice.addEventListener('click',function(e){
                let target=e.target.closest('.card-container');
                let targetImg=target.firstElementChild.firstElementChild.firstElementChild;
                let targetImgSrc=targetImg.src
                      if(e.target.tagName != 'IMG'){
                          if(level.clickcount%2 == 0){
                               if(level.playermatch.includes(targetImgSrc)){
                                  target.firstElementChild.classList.toggle('is-flipped')
                                   level.match++
                                   if(level.playermatch.length == level.dicecount/2){
                                        setTimeout(() => {
                                            setstartbutton(`Start Game`)  
                                        }, 2000); 
                                        if(levelcount >4){
                                             starterButton.hidden=true;
                                             starterButton.previousElementSibling.previousElementSibling.innerHTML=`ALL LEVEL CLEARED`
                                             starterButton.previousElementSibling.innerHTML=`CONGRATULATION`;
                                        }else{
                                            starterButton.previousElementSibling.previousElementSibling.innerHTML=`LEVEL${levelcount} CLEAR`
                                            levelcount+=1;
                                            dicecount +=4;
                                            document.querySelector('body > h1').innerHTML=`LEVEL${levelcount}`
                                            starterButton.previousElementSibling.innerHTML=`LEVEL${levelcount}`;
                                        }
                                    }
                                }else{
                                    target.firstElementChild.classList.toggle('is-flipped')
                                    setTimeout(()=>{
                                        let allimg = document.querySelectorAll('img') ;
                                        for(let img of allimg){                   
                                            if(img.src === level.playermatch[level.playermatch.length-1]){
                                              if(!img.parentElement.parentElement.classList.contains('is-flipped')){
                                                img.parentElement.parentElement.classList.toggle('is-flipped') 
                                              }
                                            }
                                        }
                                        target.firstElementChild.classList.toggle('is-flipped')
                                        level.playermatch.pop()
                                    },800)   
                                }
                          }else{
                               level.playermatch.push(targetImgSrc)
                               target.firstElementChild.classList.toggle('is-flipped')
                           }            
                           level.clickcount+=1;
                } 
            })
        }
    },level.timeouttohide)      
})


