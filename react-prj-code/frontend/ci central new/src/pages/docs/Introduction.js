import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row
} from "reactstrap";

const Intro = () => (
  <Card className="p3 p-lg-4">
    <CardHeader>
      <CardTitle tag="h5" className="mb-0">
        Introduction
      </CardTitle>
    </CardHeader>
    <CardBody>
      <div id="introduction">
        <p className="lead">
          Hello, I hope you find this template useful. AppStack React has been
          crafted on top of Bootstrap 4 and React. The included docs don't
          replace the official ones, but provide a clear view of all extended
          styles and new components that this template provides on top of
          Bootstrap 4.
        </p>

        <p>
          The docs includes information to understand how the theme is
          organized, how to make changes to the source code, and how to compile
          and extend it to fit your needs.
        </p>

        <p>
          We care about our customers, so in case you have any questions or
          feedback, please don't hesistate to reach out via{" "}
          <a href="mailto:support@bootlab.io">email</a> or by filling out our
          contact form on our{" "}
          <a
            href="https://bootlab.io/contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            website
          </a>
          .
        </p>

        <Button href="/docs/installation" color="primary">
          Getting Started
        </Button>
      </div>
    </CardBody>
  </Card>
);

const Contents = () => (
  <Card className="p3 p-lg-4">
    <CardHeader>
      <CardTitle tag="h5" className="mb-0">
        Contents
      </CardTitle>
    </CardHeader>
    <CardBody>
      <div id="contents">
        <p>
          Inside the zip-file you'll find the following directories and files.
          Both compiled and minified distrubution files, as well as the source
          files are included in the package.
        </p>

        <pre className="snippet">{`theme/
  ├── .gitignore
  ├── package.json
  ├── package-lock.json
  ├── README.md
  ├── build/
  ├── public/
  │   ├── index.html
  │   └── manifest.json
  └── src/
      ├── assets/
      │   ├── img/
      │   └── scss/
      ├── components/
      ├── layouts/
      ├── pages/
      ├── redux/
      ├── routes/
      ├── vendor/
      ├── App.js
      └── index.js
      `}</pre>
      </div>
    </CardBody>
  </Card>
);

const Introduction = () => (
  <Container fluid className="p-0">
    <h1 className="h3 mb-3">Introduction</h1>

    <Row>
      <Col lg="12">
        <Intro />
        <Contents />
      </Col>
    </Row>
  </Container>
);

export default Introduction;
