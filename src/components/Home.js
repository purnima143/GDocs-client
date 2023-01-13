import React, { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid'
import axios from "axios"
import Form from 'react-bootstrap/Form';
import Logo from '../assets/gdocsLogo.png'
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import moment from 'moment'

const baseURL = "http://localhost:9000";

function Home() {
    let navigate = useNavigate();
    const [fileData, setFileData] = useState([])
    const [fileName, setFileName] = useState("my document")

    const getMydata = async () => {
        let mydata = await axios.get(baseURL)
        setFileData(mydata.data.data)
    }

    const handleClick = (filename, id) => {
        let path = `/docs/${filename}/${id}`;
        navigate(path);
    }

    const routeChange = () => {
        console.log(uuid())
        let path = `/docs/${fileName}/${uuid()}`;
        navigate(path);
    }

    useEffect(() => {
        getMydata();
    }, []);

    return (
        <div className='home'>
            <Container className='form-container'>
                <Form.Group className="form-box">
                    <div className='form-header'>
                        <img src={Logo} alt="GDocs" />
                        <h2>GDocs</h2>
                    </div>
                    <Form.Control type="email" placeholder="Enter filename for blank document" onChange={(e) => setFileName(e.target.value)} />
                    <Button color="primary" className="px-4 mt-2"
                        onClick={routeChange}>Create Document</Button>
                </Form.Group>
                <Container className='mt-4  table'>
                    <Row className="document-row m-2 justify-content-center bold">
                        <Col>
                            My Documents
                        </Col>
                        <Col>
                            Created at
                        </Col>
                    </Row>
                    {
                        fileData.map((item) => {
                            const { _id, fileName, createdAt } = item

                            return (
                                <>
                                    <Row key={_id} onClick={() => handleClick(fileName, _id)} className="document-row" style={{ fontSize: "14px" }}>
                                        <Col>
                                            <img src={Logo} alt="GDocs" style={{ width: '32px' }} />
                                            {fileName}
                                        </Col>
                                        <Col>
                                            {
                                                moment(createdAt).calendar()
                                            }
                                        </Col>
                                    </Row>
                                </>
                            )
                        }
                        )
                    }
                </Container>
            </Container>

        </div>
    )
}

export default Home