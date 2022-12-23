import './App.css';
import { useState } from 'react';
import Note from './Note'

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({ handleClick, text }) => (
  <button className='Button' onClick={handleClick}>{text}</button>)

const App = (props) => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  const addNote = (event) => {
    event.preventDefault()
    //console.log("Submit button clicked");
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }
  
    console.log(noteObject)
    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  const handleNewNote = (event) => {
    console.log("New note entered", event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ?
    notes : notes.filter(note => note.important === true)

  return (
    <div className='App-body'>
      {left}
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      {right}
      
      <History allClicks={allClicks} />
      
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all' }
      </button>
      
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNewNote}
        />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default App;
