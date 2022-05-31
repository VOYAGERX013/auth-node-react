import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")){
            navigate("/");
        }
    })

    const loginUser = async (event) => {
        event.preventDefault();
        const response = await fetch("http://localhost:1000/api/login", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await response.json();
        if (data.user){
            localStorage.setItem("token", data.user);
            navigate("/");
        } else{
            alert("Unauthorized")
        }

        console.log(data);
    }

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={loginUser}>
                <input type="email" placeholder="Email" onChange={(event) => setEmail(event.target.value)} />
                <input type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
                <input type="submit" value="Login" />
            </form>
            <br />
            <Link to="/signup">Don't have an account?</Link>
        </div>
    )
}

export default Login;

