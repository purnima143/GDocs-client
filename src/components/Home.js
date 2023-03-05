import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Logo from "../assets/gdocsLogo.png";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from "moment";
import Trash from "../assets/trash.png";

const baseURL = `${process.env.REACT_APP_DB_URL}`;

function Home({ logOutbutton, profile }) {
  let navigate = useNavigate();
  const [fileData, setFileData] = useState([]);
  const [fileName, setFileName] = useState("my document");
  console.log("user", profile?.email);
  const useremail = profile?.email;

  const getMydata = async () => {
    let mydata = await axios.get(baseURL, { params: { user: useremail } });
    setFileData(mydata.data.data);
    console.log("file", fileData.length);
  };

  const handleClick = (filename, id) => {
    let path = `/docs/${filename}/${id}`;
    navigate(path);
  };

  const routeChange = () => {
    console.log(uuid());
    let path = `/docs/${fileName}/${uuid()}`;
    navigate(path);
  };
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  useEffect(() => {
    const myemail = localStorage.getItem("email");
    const myname = localStorage.getItem("username");
    const pic = localStorage.getItem("pic");
    setEmail(myemail);
    setName(myname);
    setPic(pic);
  }, [email]);

  useEffect(() => {
    getMydata();
  }, [email]);

  const handleDelete = async (id) => {
    try {
      const text = "Are you sure you want to delete?";
      if (window.confirm(text) === true) {
        await axios.delete(`${baseURL}/${id}`);
        const updatedlist = fileData.filter((file) => file.id !== id); //filter data and update in list and set the updated one to our todolist
        setFileData(updatedlist);
        window.location.reload();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="home">
        <Navbar
          collapseOnSelect
          sticky="top"
          expand="lg"
          style={{ background: "white", padding: "1rem" }}
        >
          <Container>
            <Navbar.Brand href="">
              <img src={Logo} alt="GDocs" className="logo" />
              GDocs
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto"></Nav>
              <Nav>{logOutbutton}</Nav>

              <Nav>
                <OverlayTrigger
                  key="bottom"
                  placement="bottom"
                  overlay={<Tooltip id={`tooltip-bottom`}>Hi, {name}</Tooltip>}
                >
                  <img src={pic} alt="" className="profilepic" />
                </OverlayTrigger>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
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
        <Container className="mt-4 table">
          <Row className="document-row top-row m-2 bold">
            <Col>My Documents</Col>
            <Col lg="4">Created at</Col>
          </Row>
          {fileData.length === 0 ? (
            <Col>No documents available</Col>
          ) : (
            fileData.map((item) => {
              const { _id, fileName, createdAt } = item;

              return (
                <React.Fragment key={_id}>
                  <Row
                    className="document-row"
                    style={{ fontSize: "14px" }}
                    key={_id}
                  >
                    <Col>
                      <p
                        onClick={() => handleClick(fileName, _id)}
                        style={{ padding: 0, margin: 0 }}
                      >
                        <img src={Logo} alt="GDocs" style={{ width: "32px" }} />
                        {fileName}
                      </p>
                    </Col>
                    <Col lg="3">{moment(createdAt).calendar()}</Col>
                    <Col lg="1">
                      <button
                        className="btn"
                        onClick={() => handleDelete(_id)}
                        style={{ padding: 0, margin: 0 }}
                      >
                        <img
                          src={Trash}
                          alt="dustbin"
                          style={{ width: "28px", border: "none" }}
                        />
                      </button>
                    </Col>{" "}
                  </Row>
                </React.Fragment>
              );
            })
          )}
        </Container>
      </div>
    </>
  );
}

export default Home;
