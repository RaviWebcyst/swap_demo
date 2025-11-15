import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../utils/constants";
import { RightArrow } from "../../../assets/icons/svgicons";

const PageNotFound = () => {
    return (
        <>
            <section className={"error_page"}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <h3>Error 404</h3>
                            <h1>Sorry !!! <br />There's No Page.</h1>
                            <p>The page you are looking for is not available for the moment!!! <br /> You can go home or please try again later.</p>
                            <Link to={ROUTES.HOME}>Go Home <RightArrow /></Link>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default PageNotFound
