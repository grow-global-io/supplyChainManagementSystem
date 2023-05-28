import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';

const StatusModal = (props) => {
    const {
        statusModalShow,
        setModalStatus,
        url1,
        url2,
        url3,
        url4,
        url5,
        url6,
        url7,
        url8,
        url9,
        url10,
        setStatusModalShow,
        modalStatus,
        counter,
        progressWidth,
        setCounter,
    } = props;
    const common_url = "https://mumbai.polygonscan.com/tx/"

    
    return (
        <Modal
            className="mt-5"
            show={statusModalShow}
            onHide={() => {
                setModalStatus("");
                setStatusModalShow(false);
                setCounter(0);
            }}
            style={{ height: "100%", width: "100%" }}
        >
            <Modal.Title style={{ padding: "30px" }}>
                Status
            </Modal.Title>
            <Modal.Body style={{ backgroundColor: "#cfcfcf", padding: "2.5rem" }}>
                <div className="progress-bar1">
                    <div
                        className="progress1"
                        id="progress"
                        style={{ width: progressWidth }}
                    ></div>
                    <div
                        className={
                            counter >= 0
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 1
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 2
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 3
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 4
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 5
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 6
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 7
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 8
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                    <div
                        className={
                            counter >= 9
                                ? "progress-step progress-step-active"
                                : "progress-step"
                        }
                    ></div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    {
                        url1 ?
                            <a
                                style={{
                                    transform: "translate(-15px, 10px)",
                                    fontSize: "1em",
                                    textAlign: "center",
                                }}
                                href={common_url + url1}
                                target="_blank"
                            >
                                Order <br /> Received
                            </a> :
                            <p
                                style={{
                                    transform: "translate(-15px, 10px)",
                                    fontSize: "1em",
                                    textAlign: "center",
                                }}
                            >
                                Order <br /> Received
                            </p>
                    }

                    {
                        url2 ?

                            <a
                                style={{
                                    transform: "translate(-16px, -97px)",
                                    fontSize: "1em",
                                    textAlign: "center",
                                }}
                                href={common_url + url2}
                                target="_blank"
                            >
                                Looking <br /> for Vendor <br /> Acceptance
                            </a> :
                            <p
                                style={{
                                    transform: "translate(-16px, -97px)",
                                    fontSize: "1em",
                                    textAlign: "center",
                                }}
                            >
                                Looking <br /> for Vendor <br /> Acceptance
                            </p>
                    }

                    {
                        url3 ?
                            <a
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-22px, 10px)",
                                    textAlign: "center",
                                }}
                                href={common_url + url3}
                                target="_blank"
                            >
                                Vendor <br /> Accepted
                            </a> :
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-22px, 10px)",
                                    textAlign: "center",
                                }}
                            >
                                Vendor <br /> Accepted
                            </p>
                    }

                    {
                        url4 ?

                            <a
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-15px, -80px)",
                                    textAlign: "center",
                                }}
                                href={common_url + url4}
                                target="_blank"
                            >
                                Fullfilled
                            </a> :
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-15px, -80px)",
                                    textAlign: "center",
                                }}
                            >
                                Fullfilled
                            </p>
                    }

                    {
                        url5 ?

                            <a
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-10px, 10px)",
                                    textAlign: "center",
                                }}
                                href={common_url + url5}
                                target="_blank"
                            >
                                Ready for <br /> Production
                            </a> :
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-10px, 10px)",
                                    textAlign: "center",
                                }}
                            >
                                Ready for <br /> Production
                            </p>
                    }

                    {
                        url6 ?

                            <a
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-10px, -80px)",
                                    textAlign: "center",
                                }}
                                href={common_url + url6}
                                target="_blank"
                            >
                                Ready for <br /> Batching
                            </a> :
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-10px, -80px)",
                                    textAlign: "center",
                                }}
                            >
                                Ready for <br /> Batching
                            </p>
                    }

                    {
                        url7 ?
                            <a
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-9px, 10px)",
                                    textAlign: "center",
                                }}
                                href={common_url + url7}
                                target="_blank"
                            >
                                Ready for <br /> Customer <br /> Delivery
                            </a> :
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-9px, 10px)",
                                    textAlign: "center",
                                }}
                            >
                                Ready for <br /> Customer <br /> Delivery
                            </p>
                    }

                    {
                        url8 ?
                            <a
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-11px, -80px)",
                                    textAlign: "center",
                                }}
                                href={common_url + url8}
                                target="_blank"
                            >
                                Ready for <br /> Invoice
                            </a> :
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-11px, -80px)",
                                    textAlign: "center",
                                }}
                            >
                                Ready for <br /> Invoice
                            </p>
                    }

                    {
                        url9 ?
                            <a
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(7px, 10px)",
                                    textAlign: "center",
                                }}
                                href={common_url + url9}
                                target="_blank"
                            >
                                Paid
                            </a> :
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(7px, 10px)",
                                    textAlign: "center",
                                }}
                            >
                                Paid
                            </p>
                    }

                    {
                        url10 ?
                            <a
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(24px, -80px)",
                                    textAlign: "center",
                                }}
                                href={common_url + url10}
                                target="_blank"
                            >
                                Completed
                            </a> :
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(24px, -80px)",
                                    textAlign: "center",
                                }}
                            >
                                Completed
                            </p>
                    }


                </div>
                <h3
                    className="text-center mt-5"
                    style={{ color: "#1A237E" }}
                >
                    {modalStatus}
                </h3>
            </Modal.Body>
        </Modal>
    )
}

export default StatusModal
