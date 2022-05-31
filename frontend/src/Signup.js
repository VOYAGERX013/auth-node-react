import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")){
            navigate("/");
        }
    })

    const registerUser = async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:1000/api/register", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })

        const data = await response.json();
        if (data.status === "ok"){
            navigate("/login");
        } else{
            alert("User exists");
        }
    }

    return (
        <div className="container">
            <h1>Register</h1>
            <form onSubmit={registerUser}>
                <input type="text" onChange={(event) => setName(event.target.value)} placeholder="Name" />
                <input type="email" onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
                <input type="password" onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
                <input type="submit" value="Register" />
            </form>
            <br />
            <Link to="/login">Already have an account?</Link>
        </div>
    )
}

export default Signup;