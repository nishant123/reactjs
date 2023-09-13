import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row
} from "reactstrap";

const Install = () => (
  <Card className="p3 p-lg-4">
    <CardHeader>
      <CardTitle tag="h5" className="mb-0">
        Installation
      </CardTitle>
    </CardHeader>
    <CardBody>
      <div id="installation">
        <p>
          This project was bootstrapped with{" "}
          <a href="https://github.com/facebook/create-react-app">
            Create React App
          </a>
          . You'll need to install <a href="https://nodejs.org/en/">Node.js</a>{" "}
          before using Appstack React.
        </p>

        <p className="mb-2">
          Once Node.js is installed, run <code>npm install</code> to install the
          rest of AppStack React's dependencies. All dependencies will be
          downloaded to the <code>node_modules</code> directory.
        </p>
        <pre className="snippet">npm install</pre>

        <p className="mb-2">
          Now you're ready to modify the source files and generate new{" "}
          <code>build/</code> files. AppStack is using webpack and webpack-serve
          to automatically detect file changes and start a local webserver at{" "}
          <code>http://localhost:3000</code>.
        </p>
        <pre className="snippet">npm start</pre>
      </div>
    </CardBody>
  </Card>
);

const BuildTools = () => (
  <Card className="p3 p-lg-4">
    <CardHeader>
      <CardTitle tag="h5" className="mb-0">
        Build tools
      </CardTitle>
    </CardHeader>
    <CardBody>
      <div id="build-tools">
        <p className="mb-2">
          Start a local webserver at <code>http://localhost:3000</code> and
          detect file changes:
        </p>
        <pre className="snippet">npm start</pre>

        <p className="mb-2">
          Compile, optimize, minify and uglify all source files to{" "}
          <code>build/</code>:
        </p>
        <pre className="snippet">npm run build</pre>
      </div>
    </CardBody>
  </Card>
);

const Installation = () => (
  <Container fluid className="p-0">
    <h1 className="h3 mb-3">Getting Started</h1>

    <Row>
      <Col lg="12">
        <Install />
        <BuildTools />
      </Col>
    </Row>
  </Container>
);

export default Installation;
