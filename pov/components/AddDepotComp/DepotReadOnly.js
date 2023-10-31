import React from "react";
import styles from "../../styles/modular/UserReadOnly/UserReadOnly.module.css"
import { Tr, Td } from "react-super-responsive-table";



const DepotReadOnly = ({ contact, handleEditClick, handleDeleteClick,key }) => {
	return (
		<Tr key={key} className={styles.tr}>
			<Td>{contact.nom}</Td>
			<Td>{contact.address}</Td>
			<Td>
				<div className={styles.buttons}>
					<button
						className={styles.button}
						type="button"
						onClick={(event) => handleEditClick(event, contact)}
					>
						Edit
					</button>
					<button className={styles.button} type="button" onClick={() => handleDeleteClick(contact.id)}>
						Delete
					</button>
				</div>

			</Td>
		</Tr>
	);
};
export default DepotReadOnly;
