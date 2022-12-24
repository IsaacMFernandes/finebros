// Import statements
// like import [name] from [directory/location]
import './App.css';
import { useState, useEffect } from 'react';
import Note from './components/Note'
import noteService from './services/notes'

// React component to show button click history
// Define it with const because it will not be changed
// It is equal to a function that we pass a properties parameter
// Function definition uses arrow notation
const History = (props) => {
  // Conditional rendering
  // Return some text if no buttons have been pressed
  if (props.allClicks.length === 0) {
    return (
      // Using html-like syntax
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    // Using "join" function to add a space after each item in the array
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

// Simple button component with decoupled parameters
// parameters are a function to handle click and text on the button
// One line is needed because it just returns an html button
const Button = ({ handleClick, text }) => (
  <button className='Button' onClick={handleClick}>{text}</button>)

// Main App component that most logic is defined in
const App = () => {
  // Setting some state variables to allow for mutable, app-wide variables
  // The first name is the variable name and the second is the function to change the variable
  // useState() takes the default value for the variable
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)

  // useEffect lets us perform asychronous tasks
  // Takes a hook function and array to control when to run the effect
  // Hook function is defined with arrow notation
  useEffect(() => {
    console.log("effect activated")

    // Using note service to make fetching data easier
    // Performing functions one after the other
    // .get function takes a location and returns a promise
    noteService
      .getAll()
      // promise.then() defines the actions to perform when promise is fullfilled
      .then(response => {
        // More arrow notation to define what to do with the response
        // In this case, call setNotes function to update notes variable in useState
        // Using response.data, or the json returned from the axios call
        setNotes(response.data)
        console.log("notes have been fetched")
      })
  }, [])

  console.log("rendering", notes.length, "notes")

  // Functions to handle button clicks
  const handleLeftClick = () => {
    // Using array.concat function instead of array.push
    // because concat does not mutate directly; causes react to go weird
    setAll(allClicks.concat('L'))
    // Update useState variable
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  // Variable passed contains form text from input field
  const addNote = (event) => {
    // Prevent reloading the page when button clicked
    event.preventDefault()
    //console.log("Submit button clicked");
    // Create new note object
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    }

    // Posting to the /notes page via json-server
    noteService
      .create(noteObject)
      .then(r => {
        // Settings the notes array and new note var to reflect the change
        setNotes(notes.concat(noteObject))
        setNewNote('')
        console.log("Note posted to server")
      })
  }

  // Function for onChange on the form input
  // Changes newNote variable for every text change
  // event.target.value contains the text we need
  const handleNewNote = (event) => {
    //console.log("New note entered", event.target.value)
    setNewNote(event.target.value)
  }

  // Function to change a notes' importance
  // Gets passed the id of the note to change
  const toggleImportance = id => {
    // Finding the note from the local array
    // Passes a function of what to compare when finding
    const note = notes.find(n => n.id === id)

    // New note object that has everything except its importance is inverted
    const changedNote = { ...note, important: !note.important }

    // Use note service to replace a note, then change local notes
    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
  }

  // Storing all the notes in a conditional variable to show only important ones
  // Uses conditional statement
  // condition ? iftrue : iffalse
  const notesToShow = showAll ?
    notes : notes.filter(note => note.important === true)

  // Main website definition
  // Uses css from App.css
  // Starts with two buttons using the Button component
  // Shows History component
  // Mapping each note to their own Note component from a component file
  // Regular button to show important notes via conditional statement
  // Html form with input that changes and submit button
  return (
    <div className='App-body'>
      {left}
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      {right}
      
      <History allClicks={allClicks} />
      
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportance(note.id)} />
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
