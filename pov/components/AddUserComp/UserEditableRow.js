import React from "react";
import styles from "../../styles/modular/UserEditable/UserEditable.module.css"
import { Tr, Td } from "react-super-responsive-table"
import { patchReq } from "../../utils/helper";
import { toast } from "react-toastify";

const UserEditableRow = ({
	editFormData,
	handleEditFormchange,
	contactId,
	refreshUsers,
	handleCancelClick
}) => {


	const EditUsers = async () => {
		let resp = await patchReq("user/" + contactId + "/", editFormData);
		if (resp) {
			toast.success("Modified User");
			refreshUsers();
			handleCancelClick();
		} else {
			toast.error("failed modifying User");
		}
	}

	return (
		<Tr className={styles.tr}>
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
					name="prenom"
					value={editFormData.prenom}
					onChange={handleEditFormchange}
				/>
			</Td>
			<Td>
				<select name="role" onChange={handleEditFormchange}>
					<option value="admin" selected={editFormData.role == "admin"} > Admin </option>
					<option value="vendeur" selected={editFormData.role == "vendeur"}> Vendeur </option>
				</select>
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
export default UserEditableRow;
