import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import './Home.css';  // Import the CSS file

export default function Home() {

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const handleCloseAddModal = () => setShowAddModal(false);
    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleShowEditModal = () => setShowEditModal(true);

    const [feedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/feedback")
            .then(response => {
                setFeedbackData(response.data.feedback);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const [feedbackUrl, setFeedbackUrl] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    function feedbackUrlInput(e) {
        setFeedbackUrl(e.target.value);
    }

    function titleInput(e) {
        setTitle(e.target.value);
    }

    function contentInput(e) {
        setContent(e.target.value);
    }

    function addFeedback() {
        axios.post("http://localhost:5000/add", { feedbackUrl, title, content })
            .then(() => {
                handleCloseAddModal();
                setFeedbackUrl('');
                setTitle('');
                setContent('');
                fetchFeedbacks();
            })
            .catch(err => {
                console.log(err);
            });
        window.location.reload();
    }

    const [id, setId] = useState(null);

    function edit(feedback) {
        setId(feedback.id);
        setFeedbackUrl(feedback.feedbackUrl);
        setTitle(feedback.title);
        setContent(feedback.text);
        handleShowEditModal();
    }

    function editFeedback() {
        axios.put("http://localhost:5000/edit", { id, feedbackUrl, title, content })
            .then(() => {
                handleCloseEditModal();
                setId(null);
                setFeedbackUrl('');
                setTitle('');
                setContent('');
                fetchFeedbacks();
            })
            .catch(err => {
                console.log(err);
            });
    }

    function deleteFeedback(feedback) {
        axios.post(`http://localhost:5000/delete`, { id: feedback.id })
            .then(() => {
                fetchFeedbacks();
            })
            .catch(err => {
                console.log(err);
            });
    }

    function fetchFeedbacks() {
        axios.get("http://localhost:5000/feedback")
            .then(response => {
                setFeedbackData(response.data.feedback);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const [search, setsearch] = useState('');
    function searchfun(e) {
        setsearch(e.target.value);
    }

    return (
        <div className="home-background">
            <Modal
                show={showAddModal}
                onHide={handleCloseAddModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
                    <input type="text" value={title} placeholder="Title" style={{ marginTop: "10px" }} onChange={titleInput} />
                    <input type="text" value={content} placeholder="Content" style={{ marginTop: "10px" }} onChange={contentInput} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addFeedback}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showEditModal}
                onHide={handleCloseEditModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
                    <input type="text" value={title} placeholder="Title" style={{ marginTop: "10px" }} onChange={titleInput} />
                    <input type="text" value={content} placeholder="Content" style={{ marginTop: "10px" }} onChange={contentInput} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editFeedback}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="#">Feedback</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                        </Nav>
                        <div>Number of feedback : {feedbackData.length}</div>
                        <div>ㅤ</div>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                onChange={searchfun}
                            />
                            <Button variant="outline-success" onClick={handleShowAddModal}>Add</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="content-container">
                <Row>
                    {feedbackData.map((feedback, index) => (
                        ((feedback.title).toLowerCase().includes(search.toLowerCase())) ?
                        (
                            <Col key={index} sm={6} md={4} lg={3}>
                            <Card style={{ margin: '10px' }}>
                                <Card.Body>
                                    <Card.Title>{feedback.title}</Card.Title>
                                    <Card.Text>{feedback.text}</Card.Text>
                                    <Button variant="primary" style={{ margin: "10px" }} onClick={() => { edit(feedback) }}>Edit</Button>
                                    <Button variant="primary" style={{ margin: "10px" }} onClick={() => { deleteFeedback(feedback) }}>Delete</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        ) : (null)
                    ))}
                </Row>
            </Container>
        </div>
    );
}
