import React from "react";
import { Link } from "react-router-dom";

import { Button } from "reactstrap";

const Page404 = () => (
	<div className="text-center">
		<h1 className="display-1 font-weight-bold">404</h1>
		<p className="h1">Page not found.</p>
		<p className="h2 font-weight-normal mt-3 mb-4">
			The page you are looking for is not available. If you believe this is an
			error, please contact your local administrator.
		</p>
		<Link to="/">
			<Button color="primary" size="lg">
				Return to Home Page
			</Button>
		</Link>
	</div>
);

export default Page404;
