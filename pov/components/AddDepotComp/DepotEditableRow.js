import React from "react";
import styles from "../../styles/modular/UserEditable/UserEditable.module.css"
import { Tr, Td } from "react-super-responsive-table"
import { patchReq } from "../../utils/helper";
import { toast } from "react-toastify";

const DepotEditableRow = ({
	editFormData,
	handleEditFormchange,
	contactId,
	refreshUsers,
	handleCancelClick,
	key
}) => {


	const EditUsers = async () => {
		let resp = await patchReq("admin/depot/" + contactId + "/", editFormData);
		if (resp) {
			toast.success("Modified Depot");
			refreshUsers();
			handleCancelClick();
		} else {
			toast.error("failed modifying Depot");
		}
	}

	return (
		<Tr key={key} className={styles.tr}>
			<Td>
				<input
					type="text"
					required="required"
					name="nom"
					value={editFormData.nom}
					onChange={handleEditFormchange}
				/>
			</Td>
			<Td>
				<input
					type="text"
					required="required"
					name="address"
					value={editFormData.address}
					onChange={handleEditFormchange}
				/>
			</Td>
			
			

			<Td>
				<div className={styles.buttons}>
					<button type="submit" onClick={EditUsers}>Save </button>
					<button type="submit" onClick={handleCancelClick}>
						Cancel{" "}
					</button>
				</div>
			</Td>
		</Tr>
	);
};
export default DepotEditableRow;
