import React,{useState,useEffect,useRef, ChangeEvent, FormEvent} from 'react';
import randomWords from './functions/randomWords'
import { Iword } from './interface/interface';

let index:number = -1;

/**
 * @str here we generate random words
 * @temp string to array
 * @typedLetters count of user entered letters(it is needed for calculating WPM)
 * @errors incorrect letters
 * @startTime u know
 * @counter reset timer (if 0 timer starts counting)
 * @WPM idk 
 * @gameEnd game ends after user entered all of the characters
 * @isGameStarted useEffect fires twice (Facebook fuck you)
 */
let str = randomWords(30);
let temp = str.split('');
let typedLetters = 0;
let errors = 0;
let startTime:Date;
let counter = 0;
let WPM:number;
let gameEnd = false;
let isGameStarted = false;

//======================================================================== 
function App() {

  let res:Array<Iword> = [];

  const wpmRef = useRef<HTMLDivElement>(null)
  const timer = useRef<HTMLSpanElement>(null);
  const blurWindow = useRef<HTMLDivElement>(null);
  /**
   * 1 letter === 1 object,that contains {
   *                              @letter :string
   *                              @correct : null : boolean
   *                              @id : number
   *                              @current : boolean
   *                                }
   */
  for(let i = 0;i<temp.length;i++){
    res.push({
      letter:temp[i],
      correct:null,
      id:i,
      current:false
    })
  }

  const [wordArray,setWordArray] = useState<Array<Iword>>(res);

  /**
   * window that contains restart button and average WPM
   */
  const win = useRef<HTMLDivElement>(null);
  /**
   * input Ref
   */
  const inpRef = useRef<HTMLInputElement>(null);

  /**
   * if input is not focused  
   *                          show window that contains button that focuses input
   */
    function blurHandler(){
      if(gameEnd === false){
        blurWindow.current!.style.display = 'flex'
      }
    }

    /**
     * after writting the word
     * start the timer
     */
    function StartTimer():void{
      /**
       * 
       * @returns time that has passed since user started typing 
       */
      function getTimerTime():number{
        return Math.floor((+new Date- (+startTime))/1000)
      }
      /**
       * @counter we need counter because function runs every time user hits the key
       * function should start timer only once , when user starts typing
       * function runs after first keypress
       * if counter === 0 means that user jsut started typing 
       * @counter increases with every keypress
       */
    if(counter === 0){
        //setting start time
        startTime = new Date();
        setInterval(()=>{
          /**
           * every 5 letter === 1 word
           * 
           */
          //check net WPM algo
          const Mins = (getTimerTime()/ 60);
          const numberOfWords:number = ((typedLetters/5));
          const out =  (numberOfWords-(errors/5))/Mins;
          WPM = out <0?0:out;
          timer.current!.innerText =Math.round(WPM).toString();

        },1000)
    }
    //u know 
    counter+=1
  }
      

  //this function just focuses cursor on input and hides restart window
  function gameStart():void{
      gameEnd = false
      inpRef.current!.focus();
      win.current!.style.display = 'none'
  
  }
  //u know
  function retry():void{
    //counter just resets timer
    counter = 0
    gameEnd = false
    //generating new 30 words
    //open folder functions and check how it works
    str = randomWords(30)
    //str to arr
    temp =str.split('');

      setWordArray((prev)=>{
        prev = []
         for(let i = 0;i<temp.length;i++){
            prev.push({
              letter:temp[i],
              correct:null,
              id:i,
              current:false
            })
            }
              return prev  
        })

    inpRef.current!.focus();
    win.current!.style.display = 'none'
  }

  //u know
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
    /**
     * 
     * @function preventEv is handling ctrl+backspace event 
     */
    function preventEv(event:Event){
     let keyEvent= (event as KeyboardEvent)
      if(keyEvent.keyCode===8 && keyEvent.ctrlKey){
        event.preventDefault()
      }
    }

    if(isGameStarted === false){
      gameStart()
    }
    inpRef.current!.addEventListener('keydown',(e)=>{preventEv(e)});
    return ()=>{
      inpRef.current!.removeEventListener('keydown',(e)=>{preventEv(e)});
      isGameStarted = true;
    }
  },[])


  /**
   * if there are no more words 
   *  end the game 
   */
  useEffect(()=>{
    //index --- increases with each keystroke
    //str --- u know
    if(index === str.length-1){
      endGame();
      
    }
  },[str,index]);


  const changeHandler = (e:FormEvent)=>{
 
      //just input value 
      // thanks to typescript for a very cool syntax
      const val = (e.target as HTMLInputElement).value;
      // here we catch backspace
      const isRemoving = (e.nativeEvent as InputEvent).inputType === 'deleteContentBackward';
      //if user does not hit backspace( or else just typed letter )
      if(!isRemoving){
        //here we count letters 
        //it is needed to calculate words per minute 
      typedLetters+=1
      //here we count incorrect letters
      if(val[index] !== str[index]){
        errors+=1
      } 
      
        setWordArray((prev)=>{
          //cursor simulation
          if(index>=0){
            //cleaning up
            prev[index].current = false;
          }
          if(index<str.length-1){
            prev[index+1].current = true
          }
         
          //checking if word is correct
          prev[index].correct = val[index] === str[index]// true||false
          return [...prev]
         })
          //u know
          index++
      }
      //if backspace
      else{
       
          //decreasing index by one if backspace was stroked
        index--
          //painting letter in gray
          //null === gray
          //true === green
          //red - u know
        setWordArray((prev)=>{
          //cursor simulation
          prev[index+2].current = false;
          //cleaning up 
          prev[index+1].current = true;

          prev[index+1].correct = null
          return [...prev]
         })
         //if user removed incorrect letter
         if(val[index] !== str[index]){
          errors-=1
        }
      }
  }
   /**
   * @HTMLOUT is a function which is making an array of words of an array of letters
   *          logic is very simple 
   *          if array[index] is an empty string (' ')
   *          create a new array of letters behind of this empty string 
   *          ['w','o','r','d',' ','l','o','l'] =>
   *          [['w','o','r','d'],[' '],['l','o','l']]
   */

  function HTMLOUT():Iword[][]{
    let response:Iword[][] =[];
    //left is left border
    let left = 0
    for(let i = 0;i<wordArray.length;i++){
      let container:Iword[] = []
      //here we put an empty string 
      let Space:Iword[] = []
      //
        if(wordArray[i].letter === ' '){
          for(let j = left;j<=i;j++){
            
            if(wordArray[j].letter === ' '){
              Space.push(wordArray[j])
            }
            else{
              container.push(wordArray[j])
            }
          }
          left = i+1
          response.push(container)
          response.push(Space)
          
        }//putting last word into array 
        else if(i === wordArray.length-1){
          for(let j = left;j<wordArray.length;j++){
            container.push(wordArray[j])
          }
          response.push(container)
        }
    }

    return response
  }

  function returnStyle(e:boolean | null,space?:boolean,element?:Iword){
    let res;
        //making red underline if user does not hit spacebar
        if(space === true ){
          //////for spacebar there are different styels
                                  //if current === true -> blue underline       //if user entered incorrect symbol -> red underline
          res = element!.current? {borderBottom:'5px solid rgb(0, 255, 229)'}:e === false?{borderBottom:'2px solid #FF0000'}:{}
        
        }else{
          //syles for letters
          res = e===null?{color:'#6E7F80'}:e?{color:'#50FF78'}:{color:'#FF0000'}
        }
        return res
  }
 
  let resp:JSX.Element[] = HTMLOUT().map((elem,ind)=>{
    //wrapping letters
     return<div key={ind}>{ elem.map((letter,i)=>{

      if(letter.letter === ' '){//styles for spacebar
                                      
        return <span  id ='height'  key={i} style={returnStyle(letter.correct,true,letter)}>&nbsp;</span>
      }
      else{// styles for letters

        return <span  className={letter.current?'curr':''} key={i} style={returnStyle(letter.correct)}>{letter.letter}</span>
       }

     })}</div>
});

  return (
    <div className="App">
    
        <span id='timerWrapper'>~<span id='timer' ref={timer}>0</span></span>
    
      <div className="wordWrapper">
      {
       resp
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
