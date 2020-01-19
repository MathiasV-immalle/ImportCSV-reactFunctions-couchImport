import React, { useState } from 'react'

function NewDatabase() {
    const [persons, setPersons] = useState([{}]);
    const [person, setPerson] = useState([{}]);
    const handleClick = () => {
        let input = document.getElementById("bestand").files[0];
        let formData = new FormData();

        formData.append("input", input);
        formData.append("dbnaam", document.getElementById("dbnaam").value)
        fetch('http://localhost:3000/upload', { method: "POST", body: formData });
    }
    /** PERSOON OBJECT TO FAUXTON */
    const handleAddPerson = () => {
        let name = document.getElementById("name").value;
        let age = document.getElementById("age").value;
        let person = JSON.stringify({ name: name, age: age });
        let username = 'admin';
        let password = 'admin';
        let authString = `${username}:${password}`
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(authString))
        fetch(`http://localhost:5984/person/${name}`, {
            method: 'PUT', headers: headers, body: person
        });
    }
    const handleGetAllPersons = () => {
        fetch(`http://localhost:5984/person/_all_docs`, { method: "GET" }).then(response => response.json()).then(json => {
            setPersons(json.rows)
        })
    }
    const handleGetPerson = (id) => {
        fetch(`http://localhost:5984/person/${id}`, { method: "GET" }).then(response => response.json()).then(json => {
            setPerson([json])
            console.log(json)
        })
    }
    return (
        <div>
            <input type="file" id="bestand"></input>
            <input type="text" placeholder="Database naam" id="dbnaam"></input>
            <button onClick={handleClick}>Bevestigen</button>
            <br></br>
            <input type="text" placeholder="name" id="name"></input>
            <input type="text" placeholder="age" id="age"></input>
            <button onClick={handleAddPerson}>AddPerson</button>
            <br></br>
            <ul>
                {
                    persons.map(person => {
                    return <li>{person.key}</li>
                    })
                }
            </ul>
            <button onClick={handleGetAllPersons}>GetAllPersons</button>
            <br></br>
            <input type="text" placeholder="naam" id="id"></input>
            <button onClick={() => handleGetPerson(document.getElementById("id").value)}>GetPerson</button>
            <ul>
                {
                    person.map(person => {
                    return <li>{person.name}</li>
                    })
                }
            </ul>
        </div>
    )
}

export default NewDatabase