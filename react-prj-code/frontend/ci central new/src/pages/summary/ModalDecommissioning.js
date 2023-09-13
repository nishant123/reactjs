import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ModalGeneric } from "./ModalGeneric";
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, CardTitle } from "reactstrap";
import Spinner from "../../components/Spinner";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
const ModalDecommissioning = ({ isOpen, toggle }) => {
	const history = useHistory();
	const [invalid, setInvalid] = useState(null);
	const profile = useSelector(
		({ currentCosting }) => currentCosting.currentCostingProfile
	);
	const user = useSelector(({ user }) => user.userRecord.Email);
	const dispatch = useDispatch();
	const app = useSelector(({ app }) => app);
	const header = <h4>Warning!</h4>;
	const body = (
		<>
			<CardTitle>
				You are about to edit a commissioned costing profile.
			</CardTitle>
			<p>
				A duplicate profile will be automatically created and the current
				commissioned profile will remain locked.
				<br />
				Approvals will need to be retriggered on the new costing if required and
				schedules (EWNs) will need to be sent again.
			</p>
			<p>
				You are recommended to only use this feature unless absolutely
				necessary.You are also requested to complete the steps above as soon as
				possible to keep the teams involved informed of the change.
			</p>
			<p>
				<strong>Are you sure you want to continue?</strong>
			</p>
			{profile.id ? (
				<>
					<Input
						id="approversNotes"
						type="textarea"
						className="mb-2"
						disabled={app.recordloading}
						value={profile.DecommissionNotes}
						onChange={(e) => {
							dispatch(
								currentCostingActions.updateProfile({
									DecommissionNotes: e.target.value,
								})
							);
						}}
						placeholder="Please provide a justification..."
					/>

					{invalid === true ? (
						<p style={{ color: "red" }}>Justification is required.</p>
					) : null}
				</>
			) : null}
		</>
	);
	const validate = () => {
		if (profile.DecommissionNotes && profile.DecommissionNotes.length > 0) {
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
						dispatch(
							currentCostingActions.decommissionProfile(() => {
								history.push("/proposal");
								toggle();
							})
						);
					} else {
						setInvalid(true);
					}
				}}
				disabled={app.recordloading}
			>
				Confirm
				{app.recordloading ? <Spinner size="small" color="#495057" /> : null}
			</Button>
		</div>
	);

	return (
		<ModalGeneric
			isOpen={isOpen.ModalDecommissioning}
			toggle={toggle}
			header={header}
			body={body}
			footer={footer}
			backdrop={"static"}
			keyboard={false}
			headerNoToggle={true}
		/>
	);
};

export default ModalDecommissioning;
