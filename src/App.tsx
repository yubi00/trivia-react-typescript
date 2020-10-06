import React, { useState, useEffect } from 'react'
import './App.css'

type Option = {
  option: undefined | string
}

function App() {
  const [questions, setQuestions] = useState<string[]>([])
  const [question, setQuestion] = useState<string>('')
  const [correct_answers, setCorrectAnswers] = useState<string[]>([])
  const [options, setAllOptions] = useState<Option[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [answerOptions, setOptions] = useState<[]>([])
  const [questionNo, setQuestionCount] = useState<number>(0)
  const [score, setScore] = useState<number>(0)

  useEffect(() => {
    fetch(
      'https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple'
    )
      .then((data) => {
        return data.json()
      })
      .then((res) => {
        console.log(res.results)
        const loaded_questions = res.results.map((data: any) => data.question)
        setQuestions(loaded_questions)
        setQuestion(loaded_questions[questionNo])

        const loaded_correctAnswers = res.results.map(
          (data: any) => data.correct_answer
        )
        setCorrectAnswers(loaded_correctAnswers)

        const options = res.results.map((data: any) => {
          return [...data.incorrect_answers, data.correct_answer]
        })
        setAllOptions(options)
        setOptions(options[questionNo])
      })
  }, [questionNo])

  const handleSubmit = () => {
    const correct_answer = correct_answers[questionNo]

    if (questionNo < questions.length - 1) {
      if (selectedOption) {
        if (selectedOption === correct_answer) {
          setScore((score) => score + 1)
        }

        setQuestionCount((count) => count + 1)

        const loadedOptions: any = options[questionNo]
        setOptions(loadedOptions)
        setQuestion(questions[questionNo])
      } else {
        alert('select any option')
      }
    } else {
      alert(`Score: ${score}/${questions.length}`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.currentTarget.value)
  }

  if (options.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className='App'>
      <h1 className='header-title'>Movie Trivia</h1>
      <h4 className='trivia-qn'> {question && question}</h4>

      {answerOptions.map((option: Option, i: number) => (
        <div className='option' key={i}>
          <input
            type='radio'
            onChange={handleChange}
            className='answer-option'
            value={`${option}`}
            checked={selectedOption === `${option}`}
          />
          <label htmlFor='' className='answer'>
            {option}
          </label>
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default App
