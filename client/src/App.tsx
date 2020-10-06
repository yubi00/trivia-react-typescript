import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [questions, setQuestions] = useState<string[]>([])
  const [question, setQuestion] = useState<string>('')
  const [correct_answers, setCorrectAnswers] = useState<string[]>([])
  const [options, setAllOptions] = useState<string[]>([])
  const [answerOptions, setOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [questionNo, setQuestionCount] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    fetch(
      'https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple'
    )
      .then((data) => {
        return data.json()
      })
      .then((res) => {
        const loaded_questions = res.results.map((data: any) => data.question)
        setQuestions(loaded_questions)
        setQuestion(loaded_questions[0])

        const loaded_correctAnswers = res.results.map(
          (data: any) => data.correct_answer
        )
        setCorrectAnswers(loaded_correctAnswers)

        const loaded_options = res.results.map((data: any) => {
          return [...data.incorrect_answers, data.correct_answer]
        })

        setAllOptions(loaded_options)
        setOptions(loaded_options[0])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const loadedOptions: any = options[questionNo]
    setOptions(loadedOptions)
    setQuestion(questions[questionNo])
    setSelectedOption('')
  }, [questionNo, options, questions])

  const handleSubmit = () => {
    const correct_answer = correct_answers[questionNo]
    if (questionNo < questions.length - 1) {
      if (!selectedOption) return alert('choose any option')
      if (selectedOption === correct_answer) {
        setScore(score + 1)
      }

      setQuestionCount(questionNo + 1)
    } else {
      alert(`Score: ${score}/${questions.length}`)
      window.location.reload()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.currentTarget.value)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='App'>
      <h1 className='header-title'>Movie Trivia</h1>
      <h4 className='trivia-qn'> {question && question}</h4>

      {answerOptions.map((option: string, i: number) => (
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
