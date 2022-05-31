import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login")
    }

    const findNotes = async () => {
        if (localStorage.getItem("token")){
            const req = await fetch("http://localhost:1000/api/home", {
                method: "POST",
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
    
            const data = await req.json();
            if (data.status === "ok"){
                console.log("Ok");
                setData(data.notes);
            } else{
                navigate("/login");
            }    
        } else{
            navigate("/login");
        }
    }

    useEffect(() => {
        findNotes();
    }, [])

    return (
        <div className="container">
            {data}
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Home