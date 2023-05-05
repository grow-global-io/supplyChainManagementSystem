
import {
    Container,
    Row,
    Col,
    Tabs,
    Tab,
    Card,
    Form,
    Button,
    Table,
    Modal
} from "react-bootstrap";
import Navbar from "../../components/Navbar";

import { useState } from "react";
export default function ProductionManager() {
    const [show, setShow] = useState(false);
    const navItem = [
      ];
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <Navbar pageTitle={"Production Manager"} navItems={navItem}>
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Tabs
                                    defaultActiveKey="createOrder"
                                    id="uncontrolled-tab-example"
                                    className="mb-3"
                                >
                                    <Tab eventKey="createOrder" title="Create Order">
                                        <Form>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Order Number</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Date</Form.Label>
                                                <Form.Control type="date" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>SO Number</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Delivery Date</Form.Label>
                                                <Form.Control type="date" />
                                            </Form.Group>

                                            <Button variant="primary" type="submit">
                                                Submit
                                            </Button>
                                        </Form>
                                    </Tab>
                                    <Tab eventKey="materialList" title="Material List">
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                onClick={handleShow}
                                                className="mb-3"
                                                variant="primary"
                                            >
                                                Create Material
                                            </Button>{" "}
                                        </div>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Material Code</th>
                                                    <th>Material</th>
                                                    <th>Quantity</th>
                                                    <th>Unit Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>SO1</td>
                                                    <td>test1</td>
                                                    <td>1</td>
                                                    <td>$10</td>
                                                </tr>
                                                <tr>
                                                    <td>SO2</td>
                                                    <td>test2</td>
                                                    <td>1</td>
                                                    <td>$10</td>
                                                </tr>
                                                <tr>
                                                    <td>SO2</td>
                                                    <td>test2</td>
                                                    <td>1</td>
                                                    <td>$10</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <Modal className="mt-5" show={show} onHide={handleClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Create Material</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="exampleForm.ControlInput1"
                                                    >
                                                        <Form.Label>Material Code</Form.Label>
                                                        <Form.Control type="text" placeholder="" />
                                                    </Form.Group>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="exampleForm.ControlInput1"
                                                    >
                                                        <Form.Label>Material</Form.Label>
                                                        <Form.Control type="text" placeholder="" />
                                                    </Form.Group>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="exampleForm.ControlInput1"
                                                    >
                                                        <Form.Label>Quantity</Form.Label>
                                                        <Form.Control type="number" placeholder="" />
                                                    </Form.Group>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="exampleForm.ControlInput1"
                                                    >
                                                        <Form.Label>Unit Price</Form.Label>
                                                        <Form.Control type="number" placeholder="" />
                                                    </Form.Group>
                                                </Form>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                                <Button variant="primary" onClick={handleClose}>
                                                    Save Product
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Navbar>


    );
}
