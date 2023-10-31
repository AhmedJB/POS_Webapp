import React from "react";
import styles from "../../styles/modular/UserEditable/UserEditable.module.css"
import { Tr, Td } from "react-super-responsive-table"
import { patchReq } from "../../utils/helper";
import { toast } from "react-toastify";

const FournEditableRow = ({
	editFormData,
	handleEditFormchange,
	contactId,
	refreshUsers,
	handleCancelClick,
	key
}) => {


	const EditUsers = async () => {
		let resp = await patchReq("fournisseur/" + contactId + "/", editFormData);
		if (resp) {
			toast.success("Modified Fournisseur");
			refreshUsers();
			handleCancelClick();
		} else {
			toast.error("failed modifying Fournisseur");
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
					name="prenom"
					value={editFormData.prenom}
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
export default FournEditableRow;
