// Each note gets mapped to a list item
const Note = ({ note, toggleImportance }) => {

    const label = note.important ?
        "Mark as not important" : "Mark as important"

    return (
        <li>
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    )
}

// Each component is exported lul
export default Note