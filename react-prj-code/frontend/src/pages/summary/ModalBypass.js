import React, { useState } from "react";
import { ModalGeneric } from "./ModalGeneric";
import { useSelector, useDispatch } from "react-redux";
import { Button, Input } from "reactstrap";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
const ModalBypass = ({ isOpen, toggle }) => {
	const [invalid, setInvalid] = useState(null);
	const profile = useSelector(
		({ currentCosting }) => currentCosting.currentCostingProfile
	);
	const user = useSelector(({ user }) => user.userRecord.Email);
	const dispatch = useDispatch();
	const app = useSelector(({ app }) => app);
	const header = <h4>Bypass Approval</h4>;
	const body = (
		<>
			<p>Please confirm you want bypass the current approval level:</p>
			{profile.ApprovalDetails ? (
				<>
					<Input
						id="approversNotes"
						type="textarea"
						className="mb-2"
						value={
							profile.ApprovalDetails[profile.ApprovalLevelAwaiting]
								?.BypassJustification || ""
						}
						onChange={(e) => {
							let notes = e.target.value;
							let copyApprovalDetails = profile.ApprovalDetails;
							copyApprovalDetails[
								profile.ApprovalLevelAwaiting
							].BypassJustification = notes;
							copyApprovalDetails[
								profile.ApprovalLevelAwaiting
							].BypassedBy = user;
							dispatch(
								currentCostingActions.updateProfile({
									ApprovalDetails: copyApprovalDetails,
								})
							);
						}}
						placeholder="Please provide your comments if any..."
					/>

					{invalid === true ? (
						<p style={{ color: "red" }}>Please provide a comment</p>
					) : null}
				</>
			) : null}
		</>
	);
	const validate = () => {
		if (
			profile.ApprovalDetails[profile.ApprovalLevelAwaiting]
				.BypassJustification &&
			profile.ApprovalDetails[profile.ApprovalLevelAwaiting].BypassJustification
				.length > 0
		) {
			return true;
		} else {
			return false;
		}
	};
	const footer = (
		<div className="d-flex justify-content-between">
			<Button color="secondary" disabled={app.recordloading} onClick={toggle}>
				Cancel
			</Button>
			<Button
				color="primary"
				className="ml-2"
				onClick={() => {
					if (validate()) {
						setInvalid(false);
						dispatch(currentCostingActions.bypassApproval());
						toggle();
					} else {
						setInvalid(true);
					}
				}}
				disabled={app.recordloading}
			>
				Confirm
			</Button>
		</div>
	);

	return (
		<ModalGeneric
			isOpen={isOpen.ModalBypass}
			toggle={toggle}
			header={header}
			body={body}
			footer={footer}
		/>
	);
};

export default ModalBypass;
