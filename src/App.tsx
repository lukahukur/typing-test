import React,{useState,useEffect,useRef, ChangeEvent, FormEvent} from 'react';
import randomWords from './functions/randomWords'
import { Iword } from './interface/interface';


let index:number = -1;
let str = randomWords(30);
let temp = str.split('');
let typedLetters = 0;
let errors = 0;
let startTime:Date;
let counter = 0;
let WPM:number;
let gameEnd = false;

//======================================================================== 
function App() {
  let res = [];
  const wpmRef = useRef<HTMLDivElement>(null)
  const timer = useRef<HTMLSpanElement>(null);
  const blurWindow = useRef<HTMLDivElement>(null);

  for(let i = 0;i<temp.length;i++){
    res.push({
      letter:temp[i],
      correct:null,
      id:i
    })
  }

  const [wordArray,setWordArray] = useState<Array<Iword>>(res);
  const win = useRef<HTMLDivElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);


    function blurHandler(){
      if(gameEnd === false){
        blurWindow.current!.style.display = 'flex'
      }
    }

    function StartTimer():void{

      function getTimerTime():number{
        return Math.floor((+new Date- (+startTime))/1000)
      }
    if(counter === 0){
   
        startTime = new Date();
        setInterval(()=>{
          //typedLetters
          //errors
          const Mins = (getTimerTime()/ 60);
          const numberOfWords:number = ((typedLetters/5));
         
          const out =  (numberOfWords-(errors/5))/Mins
          WPM = out <0?0:out;
          timer.current!.innerText =Math.round(WPM).toString()
        },1000)
    }

    counter+=1
  }
 
  function gameStart():void{
      gameEnd = false
      inpRef.current!.focus();
      win.current!.style.display = 'none'
  
  }
  function retry():void{
    counter = 0
    gameEnd = false
    str = randomWords(30)
    temp =str.split('');

      setWordArray((prev)=>{
        prev = []
         for(let i = 0;i<temp.length;i++){
            prev.push({
              letter:temp[i],
              correct:null,
              id:i
            })
            }
              return prev  
        })

    inpRef.current!.focus();
    win.current!.style.display = 'none'
  }


  function endGame():void{

    gameEnd = true
    win.current!.style.display = 'flex';
    wpmRef.current!.innerText = `WPM ${Math.round(WPM).toString()}`
    inpRef.current!.blur();
    inpRef.current!.value = '';
    index = -1;
    typedLetters = 0;
    errors = 0;
   
} 


   useEffect(()=>{
    function preventEv(event:Event){
     let ctrl= (event as KeyboardEvent).ctrlKey;
      
      console.log(ctrl)
      
    }

    window.addEventListener('keypress',(e)=>{preventEv(e)});
    return ()=>{
      window.removeEventListener('keypress',(e)=>{preventEv(e)});
      gameStart()
    }
  },[])



  useEffect(()=>{
  if(index === str.length-1){
    endGame()
  }
  },[str,index]);


  const changeHandler = (e:FormEvent)=>{
      const val = (e.target as HTMLInputElement).value;
      const isRemoving = (e.nativeEvent as InputEvent).inputType === 'deleteContentBackward';
     
      if(!isRemoving){
      typedLetters+=1
      if(val[index] !== str[index]){
        errors+=1
      }
        setWordArray((prev)=>{
         
          prev[index].correct = val[index] === str[index]
          return [...prev]
         })
       
          index++
        
      }else{
       
  
        index--
        setWordArray((prev)=>{
          prev[index+1].correct = null
          return [...prev]
         })
         if(val[index] !== str[index]){
          errors-=1
        }
      }
  }

  let htmlOut = wordArray.map((letter,i)=>{
    function returnStyle(e:boolean | null,space?:boolean){
      let res;
          if(space === true && index >= i){
          
             res = e===null?{borderBottom:'none',}:e === true?{borderBottom:'none'}:{borderBottom:'2px solid #FF0000'}
          
          }else{
            res = e===null?{color:'#6E7F80'}:e?{color:'#50FF78'}:{color:'#FF0000'}
          }
          return res
    }

    if(letter.letter === ' '){
      return <span id ='height'className={i === index+1?'curr':' '} key={i} style={returnStyle(letter.correct,true)}>&nbsp;</span>
    }
    else{
      return <span  className={i === index+1?'curr':' '} key={i} style={returnStyle(letter.correct)}>{letter.letter}</span>
     }

  });


  return (
    <div className="App">
    
        <span id='timerWrapper'>~<span id='timer' ref={timer}>0</span></span>
    
      <div className="wordWrapper">
      {
        htmlOut
      }
      </div>
     
      <input type="text" ref={inpRef} style={{top:'-10%',position:'absolute'}} onBlur={blurHandler} onChange={StartTimer} onInput={(e)=>{changeHandler(e)}} />
      <div className='window' ref={win}>
        <div className='wrp1'>
        <button onClick={retry}>Try Again</button>
        <div ref={wpmRef}>
    
        </div>
        </div>
      </div>
      <div id='blur' ref={blurWindow} onClick={(e)=>{ inpRef.current!.focus();(e.target as HTMLDivElement).style.display = 'none'}}>
        continue
       </div>
    </div>
  );
}

export default App;
