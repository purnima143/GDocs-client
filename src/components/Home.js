import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from "axios";
import Form from "react-bootstrap/Form";
import Logo from "../assets/gdocsLogo.png";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from "moment";

const baseURL = `${process.env.REACT_APP_DB_URL}`;

function Home({ logOutbutton, profile }) {
    let navigate = useNavigate();
    const [fileData, setFileData] = useState([]);
    const [fileName, setFileName] = useState("my document");

    const getMydata = async () => {
        let mydata = await axios.get(baseURL);
        setFileData(mydata.data.data);
    };

    const handleClick = (filename, id) => {
        let path = `/docs/${filename}/${id}`;
        navigate(path);
    }

    const routeChange = () => {
        console.log(uuid())
        let path = `/docs/${fileName}/${uuid()}`;
        navigate(path);
    }
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pic, setPic] = useState("")
    useEffect(() => {
        const myemail = localStorage.getItem("email");
        const myname = localStorage.getItem("username");
        const pic = localStorage.getItem("pic")
        setEmail(myemail);
        setName(myname);
        setPic(pic);
    }, [email]);

    useEffect(() => {
        getMydata();
    }, [email]);

    return (
        <>
            <div className="home">
                <div className="header" >
                    <Container className="form-container p-0">
                        <div className="logo-header">
                            <img src={Logo} alt="GDocs" />
                            <h2>GDocs</h2>
                        </div>
                        <div className="header-right">

                            {logOutbutton}
                            <OverlayTrigger
                                key='bottom'
                                placement='bottom'
                                overlay={
                                    <Tooltip id={`tooltip-bottom`}>
                                        Hi, {name}
                                    </Tooltip>
                                }
                            >
                                <img src={pic} alt="" className="profilepic" />
                            </OverlayTrigger>
                        </div>

                    </Container>
                </div>
                <Form.Group className="form-box container mt-4">

                    <Form.Control
                        type="email"
                        placeholder="+ Enter filename"
                        onChange={(e) => setFileName(e.target.value)}
                        className="inputarea"
                    />

                    <Button color="primary" className="px-4" onClick={routeChange}>
                        Create Document
                    </Button>

                </Form.Group>
                <Container className="mt-4 table" >

                    <Row className="document-row top-row m-2 bold">
                        <Col>My Documents</Col>
                        <Col lg="3">Created at</Col>
                    </Row>
                    {fileData.map((item) => {
                        const { _id, fileName, createdAt } = item;

                        return (
                            <React.Fragment key={_id}>
                                <Row
                                    onClick={() => handleClick(fileName, _id)}
                                    className="document-row"
                                    style={{ fontSize: "14px" }}
                                    key={_id}
                                >
                                    <Col>
                                        <img src={Logo} alt="GDocs" style={{ width: "32px" }} />
                                        {fileName}
                                    </Col>
                                    <Col lg="3">{moment(createdAt).calendar()}</Col>
                                </Row>
                            </React.Fragment>
                        );
                    })}
                </Container>
            </div>
        </>
    );
}

export default Home;
