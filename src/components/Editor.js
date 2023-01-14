import React, { useState, useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Header from './Header'
const baseURL = `${process.env.REACT_APP_DB_URL}`;
const clientURL = 'https://gdocs-0lmi.onrender.com/'
function Editor() {
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    const [isCopied, setIsCopied] = useState(false);
    const { id, fileName } = useParams()
    const componentRef = useRef();

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image'],

        ['clean']                                         // remove formatting button
    ];

    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    const handleCopyClick = () => {

        let copyurl = `${clientURL}/docs/${fileName}/${id}`

        copyTextToClipboard(copyurl)
            .then(() => {

                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        document.title = fileName;
    }, []);

    useEffect(() => {
        const quillServer = new Quill('#box', { theme: 'snow', modules: { toolbar: toolbarOptions } });
        quillServer.disable()
        quillServer.setText('Loading the document...')
        setQuill(quillServer)
    }, []);

    useEffect(() => {
        const socketServer = io(baseURL)
        setSocket(socketServer)
        return () => {
            socketServer.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket === null || quill === null) { return }
        const handleChange = (delta, oldData, source) => {
            if (source !== 'user') return;
            socket && socket.emit('send-changes', delta)
        }
        quill && quill.on('text-change', handleChange)
        return () => {
            quill && quill.off('text-change', handleChange)
        }
    }, [quill, socket])

    useEffect(() => {
        if (socket === null || quill === null) { return }
        const handleChange = (delta) => {
            quill.updateContents(delta)
        }
        socket && socket.on('receive-changes', handleChange)
        return () => {
            socket && socket.off('receive-changes', handleChange)
        }
    }, [quill, socket])

    useEffect(() => {
        if (quill == null || socket == null) return
        socket && socket.once('load-document', (document) => {
            quill && quill.setContents(document)
            quill && quill.enable()
        })
        socket && socket.emit('get-document', id, fileName)
    }, [quill, socket, id])


    useEffect(() => {
        if (socket === null || quill === null) return;

        const interval = setInterval(() => {
            socket && socket.emit('save-document', quill.getContents())
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [socket, quill]);


    return (
        <>
            <Header componentRef={componentRef} handleCopyClick={handleCopyClick} isCopied={isCopied} fileName={fileName} />
            <Container fluid className='editor-container p-0'>
                <Container id="box" className='container' ref={componentRef}></Container>
            </Container>
        </>

    )
}

export default Editor