import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Question } from "../../components";
import { GameTimer } from '../../components/';
import { AnswerButton } from "../../components"
export const QuizPage = () => {

    const [answers,setAnswers] = useState([])
    const [question,setQuestion] = useState("")
    const [apiData, setApiData]= useState([])
    const [chosenAnswer,setChosenAnswer] = useState("")
    const [correctAnswer,setCorrectAnswer] = useState("")
    const [timer,setTimer] = useState();

    const handleAnswer = async(e) => {
        e.preventDefault()
        console.log(e.target.textContent);
        setChosenAnswer(e.target.textContent);
    }

    useEffect(() =>{
        async function callAPI() {
            let amount = 10;
            let category = 23;
            let difficulty = "easy";
            let {data} = await axios.get(`https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`)
            setApiData(data.results);
            recievesQuestionData(data.results[0])
            setTimer(10)
        }
        callAPI()
    },[])

    useEffect(() =>{
        const authenticate = () => {
            console.log(correctAnswer);
            console.log(chosenAnswer);
            if(correctAnswer===chosenAnswer){
                console.log("answer authenticated");
            } else{
                console.log("wrong");
            }
        }
    
        const handleTimeout = () =>{
            authenticate()
    
        }

    },[chosenAnswer])
    // const setTimer = () => {
    //     setInterval(()=>{
    //         if(chosenAnswer === correctAnswer){
    //             console.log(chosenAnswer);
    //             console.log(correctAnswer);
    //             console.log("correct");
    //         }
    //         if(moreQuestions){
    //             recievesQuestionData(apiData[nextQuestion])
    //             setTimer()
    //         }
    //     },10000)
    // }

    // useEffect(()=>{
    //     const countDownTimer = () => {
    //         setInterval(()=>{
    //             setTimer(timer-1)

    //         },1000)
    //     }
    //     countDownTimer()
    // },[timer])
  


    // setTimer()

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    const recievesQuestionData = (data) =>{
        let question = data.question
        let answers = data.incorrect_answers.map(a=>({answer:a, correct:false}))
        answers.push({answer:data.correct_answer, correct:true})
        let shuffled = shuffle(answers);
        setAnswers(shuffled);
        setQuestion(question);
        setCorrectAnswer(data.correct_answer)
    }

    const renderAnswers = () => {
        return  answers.map((a, i) => <AnswerButton key={i} handleAnswer={handleAnswer} text={a.answer}/>)
    }
    return(
        <>
            {/* <Header/> */}
            {/* <PlayerList/> */}
            <Question question={question}/>
            <GameTimer  duration={10000} timerDone={()=>handleTimeout()}/>
            <form>
                { renderAnswers() }
                <input type="hidden" value={chosenAnswer} />

            </form>

        </>
    )
}