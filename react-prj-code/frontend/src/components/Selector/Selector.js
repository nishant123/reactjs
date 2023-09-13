import React, { useState } from "react";
import "./Selector.css";
import {
	ListGroup,
	ListGroupItem,
	Card,
	CardBody,
	Row,
	Button,
} from "reactstrap";
import { getLabel } from "../../utils/codeLabels";

/*
Props:
heading - selector heading text
records[] - array of records
clicked - click handler
todo***applyAllButton - apply to all button available
todo***applyAllMethod - method to apply all
displayField - field to display for each record
*/
const Selector = ({
	heading,
	records,
	applyAll,
	applyAllText,
	clicked,
	displayField,
	selected,
	labelGroup,
	interPolField,
}) => {
	return (
		<Card>
			<CardBody className="p-1 text-center">
				<h4>{heading}</h4>
				{applyAll ? (
					<Button onClick={() => applyAll()} className="mb-2">
						{applyAllText ? applyAllText : "Apply to All"}
					</Button>
				) : null}
				<ListGroup className="p-0">
					{records?.map((item, index) => {
						return (
							<ListGroupItem
								key={index}
								onClick={() => {
									clicked(item);
								}}
								id={item.id}
								style={
									selected.id === item.id ? { background: "#e8e8e8" } : null
								}
							>
								{labelGroup ? (
									getLabel(labelGroup, item[displayField])
								) : typeof displayField == "string" ? (
									item[displayField]
								) : (
									<span>
										#{interPolField.map((int) => item[int]).join(" ")}
										{displayField}
									</span>
								)}
							</ListGroupItem>
						);
					})}
				</ListGroup>
			</CardBody>
		</Card>
	);
};

export default Selector;
