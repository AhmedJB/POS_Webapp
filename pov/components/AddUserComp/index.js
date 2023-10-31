import React, { useEffect, useState, Fragment, useContext } from 'react';
import UserEditableRow from './UserEditableRow';
import UserReadOnly from './UserReadOnly';
import styles from "../../styles/modular/addUser/addUser.module.css"
import { style } from '@mui/system';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { UserContext } from '../../contexts/user';
import { PosContext } from '../../contexts/points';
import { delReq, postReq, req } from '../../utils/helper';
import { toast } from 'react-toastify';


export default function AddUserComp(props) {

	const [contacts, setcontacts] = useState([]);
	const [addFormData, setAddFormData] = useState({
		prenom: "",
		nom: "",
		role: "",
		username: "",
		pin: ""
	});

	const [editFormData, setEditFormData] = useState({
		prenom: "",
		nom: "",
		role: "",
	});
	const [editContactId, setEditContactId] = useState(null);

	// contexts
	const { user, setUser } = useContext(UserContext);
	const { selectedPos, setSelectedPos } = useContext(PosContext);

	// fetching users
	const fetchUsers = async () => {
		let resp = await req("getusers/" + selectedPos.id + "/all");
		if (resp) {
			let temp = resp.filter((e) => e.linked);
			setcontacts(temp);
		} else {
			toast.error("failed loading data")
		}
	}


	useEffect(() => {
		fetchUsers().then(() => console.log("done loading data"));

	}, [user, selectedPos])


	const handleAddFormchange = (event) => {
		event.preventDefault();
		const fieldName = event.target.getAttribute("name");
		const fieldValue = event.target.value;
		const newFormData = { ...addFormData };
		newFormData[fieldName] = fieldValue;

		setAddFormData(newFormData);
	};

	const handleEditFormchange = (event) => {
		event.preventDefault();
		const fieldName = event.target.getAttribute("name");
		const fieldValue = event.target.value;
		const newFormData = { ...editFormData };
		newFormData[fieldName] = fieldValue;

		setEditFormData(newFormData);
	};

	const handleAddFormSubmit = async (event) => {
		addFormData["pov"] = selectedPos.id
		let resp = await postReq("register", addFormData);
		if (resp) {
			if (resp.failed) {
				toast.error("Failed saved user");
			} else {
				toast.success("saved user")
				fetchUsers();
				setAddFormData({
					prenom: "",
					nom: "",
					role: "",
					username: "",
					pin: ""
				});
			}

		}
	};

	const handleEditFormSubmit = (event) => {
		event.preventDefault();
		const editedContact = {
			id: editContactId,
			prenom: editFormData.prenom,
			nom: editFormData.nom,
			solde: editFormData.solde,
			CA: editFormData.CA
		};
		const newContacts = [...contacts];
		const index = contacts.findIndex((contact) => contact.id === editContactId);
		newContacts[index] = editedContact;
		setcontacts(newContacts);
		setEditContactId();
	};
	const handleEditClick = (event, contact) => {
		event.preventDefault();
		setEditContactId(contact.id);

		const formValues = {
			prenom: contact.prenom,
			nom: contact.nom,
			role: contact.role
		};

		setEditFormData(formValues);
	};

	const handleCancelClick = () => {
		setEditContactId(null);
	};

	const handleDeleteClick = async (contactId) => {
		let resp = await delReq("user/" + contactId + "/")
		if (resp) {
			toast.success("deleted user")
			fetchUsers();
		} else {
			toast.error("failed deleting user");
		}
	};

	const html = <>

		<div className={styles.parentcontainer}>
			<div className={styles.container}>
				<h2 className={styles.title}>Users Management</h2>

				<div className={styles.tableau}>
					<Table>
						<Thead>
							<Tr>
								<Th>Nom</Th>
								<Th>Prenom</Th>
								<Th>Role</Th>
								<Th>Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{contacts.map((contact,i) => (
								<Fragment key={i}>
									{editContactId === contact.id ? (
										<UserEditableRow
											editFormData={editFormData}
											contactId={contact.id}
											handleEditFormchange={handleEditFormchange}
											handleCancelClick={handleCancelClick}
											refreshUsers={fetchUsers}
										/>
									) : (
										<UserReadOnly
											contact={contact}
											handleEditClick={handleEditClick}
											handleDeleteClick={handleDeleteClick}
										/>
									)}
								</Fragment>
							))}
						</Tbody>
					</Table>
				</div>
				<div className={styles.addContainer}>
					<h2 className={styles.title}>Add User</h2>
					<label>Username</label>
					<input type="text" name="username" onChange={handleAddFormchange} />
					<label>Nom</label>
					<input type="text" name="nom" onChange={handleAddFormchange} />
					<label>Prenom</label>
					<input type="text" name="prenom" onChange={handleAddFormchange} />
					<label>Pin</label>
					<input type="text" name="pin" onChange={handleAddFormchange} />
					<label>Role</label>
					<select name="role" onChange={handleAddFormchange}>
						<option value="admin">Admin</option>
						<option value="vendeur">Vendeur</option>
					</select>

					<button onClick={handleAddFormSubmit} type="submit" className={styles.button}>Save</button>

				</div>
			</div>
		</div>

	</>

	return html;


}