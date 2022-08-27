import React,{useState,useEffect,useRef, ChangeEvent, FormEvent} from 'react';
import randomWords from './functions/randomWords'

interface Iword{
  letter:string
  correct:boolean|null
  id:number
}
let index:number = -1;
const str = randomWords(25);

function App() {

  const inpRef = useRef<HTMLInputElement>(null)

  let temp = str.split('');
  let res:Array<Iword> = [];

  for(let i = 0;i<temp.length;i++){
    res.push({
      letter:temp[i],
      correct:null,
      id:i
    })
  }
  

  const [wordArray,setWordArray] = useState<Array<Iword>>(res);

  const changeHandler = (e:FormEvent)=>{
      const val = (e.target as HTMLInputElement).value;
      let out:Array<string> = val.split('');
      const isRemoving = (e.nativeEvent as InputEvent).inputType === 'deleteContentBackward';
      
      if(!isRemoving){
        setWordArray((prev)=>{
          prev[index].correct = val[index] === str[index]
          return [...prev]
         })
        if(index === str.length-1){
          index = str.length-1
        }else{
          index++
        }
      }else{
        index--
        setWordArray((prev)=>{
          prev[index+1].correct = null
          return [...prev]
         })
        
        
      }
     
  }
  function focus(){
    inpRef.current!.focus();
  } 
  useEffect(()=>{
      focus()
  },[]);



  let htmlOut = wordArray.map((letter,i)=>{

    function returnStyle(e:boolean | null,space?:boolean){
      let res;
          if(space === true && index >= i){
          
             res = e===null?{borderBottom:'none',}:e === true?{borderBottom:'none'}:{borderBottom:'2px solid red'}
          
          }else{
            res = e===null?{color:'gray'}:e?{color:'green'}:{color:'red'}
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
      <div className="wordWrapper">
      {
        htmlOut
      }
      </div>
      <input type="text" ref={inpRef}  onBlur={focus}  style={{top:'-10%',position:'absolute'}} onInput={(e)=>{changeHandler(e)}} />
    </div>
  );
}

export default App;
