import { sendemail } from "../utils/netsuite";
import React, { useRef, useState } from 'react'



function BTSendMessage() {

    const [message, setMessage] = useState('');

    const textarea = useRef(null);


    function cleartextarea(){
        setMessage('');
        textarea.value = '';
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
        <textarea value={message} ref={textarea} onChange={(e) => setMessage(e.target.value)} style={{
            width: '300px',
            height: '200px'
        }}>

        </textarea>
        <button onClick={() => {sendemail(message); cleartextarea()}} style={{width: '200px', marginTop: '10px'}}>
        Send</button>
        </div>
    )
}

export default BTSendMessage
